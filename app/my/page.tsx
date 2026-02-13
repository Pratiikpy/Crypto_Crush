"use client";

import { useEffect, useState, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { Header } from "@/components/Header";
import { ConfessionCard } from "@/components/ConfessionCard";
import { RevealButton } from "@/components/RevealButton";
import { ValentineEffects } from "@/components/ValentineEffects";
import type { Confession } from "@/lib/types";
import Link from "next/link";

export default function MyPage() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFid, setUserFid] = useState<number>();
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (inMiniApp) {
          await sdk.actions.ready();
          const ctx = await sdk.context;
          setUserFid(ctx.user.fid);
          setUsername(ctx.user.username);
        }
      } catch {
        // not in mini app
      }
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!userFid) return;

    const fetchSent = async () => {
      try {
        // Fetch all confessions and filter client-side for sent ones
        const res = await fetch(`/api/confessions?offset=0&limit=100`);
        const data = await res.json();
        const sent = data.confessions.filter(
          (c: Confession) => c.senderFid === userFid
        );
        setConfessions(sent);
      } catch {
        // fail silently
      }
    };
    fetchSent();
  }, [userFid]);

  const handleRevealed = useCallback((confessionId: string) => {
    setConfessions((prev) =>
      prev.map((c) =>
        c.id === confessionId ? { ...c, revealed: true } : c
      )
    );
  }, []);

  if (loading) {
    return (
      <main className="relative min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl animate-pulse text-pink-300">Loading...</div>
        </div>
      </main>
    );
  }

  if (!userFid) {
    return (
      <main className="relative min-h-screen">
        <ValentineEffects />
        <div className="relative z-10">
          <Header />
          <div className="max-w-lg mx-auto px-4 pt-6 text-center">
            <p className="text-pink-200/50">
              Open this app in Warpcast or Base App to see your confessions.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <ValentineEffects />
      <div className="relative z-10">
        <Header username={username} />

        <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
          <h1 className="text-2xl font-bold text-pink-300 mb-1">
            My Confessions
          </h1>
          <p className="text-pink-200/50 text-sm mb-6">
            Confessions you&apos;ve sent. Reveal your identity anytime.
          </p>

          {confessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-pink-200/40 mb-4">
                You haven&apos;t sent any confessions yet.
              </p>
              <Link
                href="/send"
                className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 font-semibold text-sm"
              >
                Send Your First Confession
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {confessions.map((confession) => (
                <div key={confession.id}>
                  <ConfessionCard confession={confession} />
                  <div className="mt-2 flex justify-end">
                    <RevealButton
                      confessionId={confession.id}
                      revealed={confession.revealed}
                      onRevealed={() => handleRevealed(confession.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
