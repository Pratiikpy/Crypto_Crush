import { NextRequest, NextResponse } from "next/server";
import { createClient, Errors } from "@farcaster/quick-auth";
import { getRevealToken, getConfession, updateConfession } from "@/lib/db";
import { sendRevealNotification } from "@/lib/notifications";

const quickAuthClient = createClient();

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const host = request.headers.get("host") ?? "localhost:3000";
    const domain = host.split(":")[0];

    let senderFid: number;
    try {
      const payload = await quickAuthClient.verifyJwt({ token, domain });
      senderFid = Number(payload.sub);
    } catch (e) {
      if (e instanceof Errors.InvalidTokenError) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      throw e;
    }

    const body = await request.json();
    const { confessionId, revealToken, senderUsername, senderPfp } = body;

    if (!confessionId || !revealToken) {
      return NextResponse.json(
        { error: "confessionId and revealToken required" },
        { status: 400 }
      );
    }

    const storedReveal = await getRevealToken(confessionId);
    if (!storedReveal) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 }
      );
    }

    if (storedReveal.senderFid !== senderFid) {
      return NextResponse.json(
        { error: "Not your confession" },
        { status: 403 }
      );
    }

    if (storedReveal.token !== revealToken) {
      return NextResponse.json(
        { error: "Invalid reveal token" },
        { status: 403 }
      );
    }

    const confession = await getConfession(confessionId);
    if (!confession) {
      return NextResponse.json(
        { error: "Confession not found" },
        { status: 404 }
      );
    }

    if (confession.revealed) {
      return NextResponse.json(
        { error: "Already revealed" },
        { status: 400 }
      );
    }

    const updated = await updateConfession(confessionId, {
      revealed: true,
      senderUsername: senderUsername || undefined,
      senderPfp: senderPfp || undefined,
    });

    if (confession.recipientFid && senderUsername) {
      sendRevealNotification(
        confession.recipientFid,
        confessionId,
        senderUsername
      ).catch(() => {});
    }

    return NextResponse.json({ confession: updated });
  } catch (error) {
    console.error("Error revealing confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
