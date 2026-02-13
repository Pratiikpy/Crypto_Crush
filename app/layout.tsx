import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  title: "Crypto Crush Confession",
  description:
    "Send anonymous Valentine's confessions to your crush for 0.1 USDC on Base.",
  openGraph: {
    title: "Crypto Crush Confession",
    description:
      "Someone sent you an anonymous confession... Pay 0.1 USDC to send yours.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen bg-gradient-to-b from-[#1a0a1e] via-[#2d1133] to-[#1a0a1e] text-white`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
