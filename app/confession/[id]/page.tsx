"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sdk } from "@farcaster/miniapp-sdk";
import { ConfessionCard } from "@/components/ConfessionCard";
import { Header } from "@/components/Header";
import { ValentineEffects } from "@/components/ValentineEffects";
import type { Confession } from "@/lib/types";
import Link from "next/link";

export default function ConfessionPage() {
  const params = useParams();
  const id = params.id as string;
  const [confession, setConfession] = useState<Confession | null>(null);
  const [loading, setLoading] = useState(true);
  const [userFid, setUserFid] = useState<number>();

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (inMiniApp) {
          await sdk.actions.ready();
          const ctx = await sdk.context;
          setUserFid(ctx.user.fid);
        }
      } catch {
        // not in mini app
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchConfession = async () => {
      try {
        const res = await fetch(`/api/confessions?offset=0&limit=100`);
        const data = await res.json();
        const found = data.confessions.find(
          (c: Confession) => c.id === id
        );
        setConfession(found || null);
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    fetchConfession();
  }, [id]);

  const isRecipient =
    confession?.recipientFid && confession.recipientFid === userFid;

  const handleShare = async () => {
    try {
      await sdk.actions.composeCast({
        text: isRecipient
          ? "Someone sent me an anonymous Valentine's confession on Crypto Crush Confession!"
          : "Check out this anonymous confession on Crypto Crush Confession!",
        embeds: [window.location.href],
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <main className="relative min-h-screen">
      <ValentineEffects />
      <div className="relative z-10">
        <Header />

        <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
          {loading ? (
            <div className="rounded-2xl bg-pink-900/20 animate-pulse h-48" />
          ) : confession ? (
            <>
              {isRecipient && (
                <div className="text-center mb-6 animate-slide-up">
                  <p className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-rose-300 bg-clip-text text-transparent">
                    Someone has a crush on you
                  </p>
                </div>
              )}

              <ConfessionCard confession={confession} full />

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 font-semibold text-sm"
                >
                  Share on Farcaster
                </button>

                <Link
                  href="/send"
                  className="block w-full text-center py-3 rounded-xl border border-pink-800/30 text-pink-300 text-sm hover:bg-pink-900/20 transition-colors"
                >
                  Send Your Own Confession
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-pink-200/50">Confession not found</p>
              <Link
                href="/"
                className="text-pink-400 text-sm mt-4 inline-block"
              >
                Back to wall
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
