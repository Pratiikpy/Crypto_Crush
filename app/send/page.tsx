"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "@/components/Header";
import { SendConfessionFlow } from "@/components/SendConfessionFlow";
import { ValentineEffects } from "@/components/ValentineEffects";

export default function SendPage() {
  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (inMiniApp) {
          await sdk.actions.ready();
        }
      } catch {
        // not in mini app
      }
    };
    init();
  }, []);

  return (
    <main className="relative min-h-screen">
      <ValentineEffects />
      <div className="relative z-10">
        <Header />

        <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-pink-300 mb-1">
              Write a Confession
            </h1>
            <p className="text-pink-200/50 text-sm">
              Anonymous. Onchain. Unforgettable.
            </p>
          </div>

          <SendConfessionFlow />
        </div>
      </div>
    </main>
  );
}
