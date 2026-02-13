import { NextResponse } from "next/server";
import config from "@/minikit.config";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJmaWQiOjExNDg5NzEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwMTMwOTViRDIzM2U1ZDgzQzY1NTA3NjVhMUVjRDkzYzMzNDFCNEQ1In0",
      payload: "eyJkb21haW4iOiJjcnlwdG8tY3J1c2gtZmxhbWUudmVyY2VsLmFwcCJ9",
      signature: "ZtKA4J23aDpZhwk056r76v+3gL5Ptm0f9Pu8A4e3yggCCMWJ/c7475c/uIpKveqPdxF/dsC3ywYXWtR2rv8t0Rw=",
    },
    ...config,
  };

  return NextResponse.json(manifest);
}
