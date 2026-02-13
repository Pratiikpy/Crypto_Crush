"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "@/components/Header";
import { ConfessionWall } from "@/components/ConfessionWall";
import { ValentineEffects } from "@/components/ValentineEffects";
import Link from "next/link";

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (inMiniApp) {
          await sdk.actions.ready();
          const ctx = await sdk.context;
          setUsername(ctx.user.username);
        }
      } catch {
        // Running outside mini app context
      }
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl animate-pulse text-pink-300">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <ValentineEffects />
      <div className="relative z-10">
        <Header username={username} />

        <div className="max-w-lg mx-auto px-4 pt-4 pb-24">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
              Crypto Crush Confession
            </h1>
            <p className="text-pink-200/70 text-sm">
              Send anonymous confessions for 0.1 USDC
            </p>
          </div>

          <Link
            href="/send"
            className="block w-full text-center py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 font-bold text-lg mb-8 pulse-glow hover:from-pink-500 hover:to-rose-400 transition-all"
          >
            Write a Confession
          </Link>

          <h2 className="text-lg font-semibold text-pink-300 mb-4">
            Recent Confessions
          </h2>
          <ConfessionWall />
        </div>
      </div>
    </main>
  );
}
