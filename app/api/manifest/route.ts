import { NextResponse } from "next/server";
import config from "@/minikit.config";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },
    ...config,
  };

  return NextResponse.json(manifest);
}
