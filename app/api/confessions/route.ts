import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient, Errors } from "@farcaster/quick-auth";
import {
  saveConfession,
  getRecentConfessions,
  saveRevealToken,
} from "@/lib/db";
import { sendConfessionNotification } from "@/lib/notifications";
import type { Confession } from "@/lib/types";
import type { ThemeId } from "@/lib/constants";

const quickAuthClient = createClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = parseInt(searchParams.get("offset") ?? "0");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const confessions = await getRecentConfessions(offset, limit);
  return NextResponse.json({ confessions });
}

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
    const {
      recipientUsername,
      recipientAddress,
      recipientFid,
      message,
      theme,
      txHash,
      senderUsername,
      senderPfp,
    } = body;

    if (!message || message.length > 500) {
      return NextResponse.json(
        { error: "Message required (max 500 chars)" },
        { status: 400 }
      );
    }

    if (!recipientUsername && !recipientAddress) {
      return NextResponse.json(
        { error: "Recipient required" },
        { status: 400 }
      );
    }

    if (!txHash) {
      return NextResponse.json(
        { error: "Transaction hash required" },
        { status: 400 }
      );
    }

    const confessionId = nanoid(12);
    const revealToken = nanoid(24);

    const confession: Confession = {
      id: confessionId,
      senderFid,
      recipientUsername: recipientUsername || undefined,
      recipientAddress: recipientAddress || undefined,
      recipientFid: recipientFid || undefined,
      message,
      theme: (theme as ThemeId) || "hearts",
      txHash,
      timestamp: Date.now(),
      revealed: false,
      likes: 0,
    };

    await saveConfession(confession);
    await saveRevealToken(confessionId, { senderFid, token: revealToken });

    // Send notification in background (don't block response)
    if (recipientFid) {
      sendConfessionNotification(recipientFid, confessionId).catch(() => {});
    }

    return NextResponse.json({
      confession,
      revealToken,
    });
  } catch (error) {
    console.error("Error creating confession:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
