"use client";

import { THEMES } from "@/lib/constants";
import type { Confession } from "@/lib/types";
import Link from "next/link";

interface ConfessionCardProps {
  confession: Confession;
  full?: boolean;
}

export function ConfessionCard({ confession, full = false }: ConfessionCardProps) {
  const theme = THEMES.find((t) => t.id === confession.theme) ?? THEMES[0];

  const timeAgo = getTimeAgo(confession.timestamp);

  return (
    <div className="animate-slide-up">
      <div
        className={`rounded-2xl p-[1px] bg-gradient-to-br ${theme.bg}`}
      >
        <div className="rounded-2xl bg-[#1a0a1e]/90 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{theme.emoji}</span>
              {confession.revealed && confession.senderUsername ? (
                <span className="text-sm text-pink-300 font-medium">
                  @{confession.senderUsername}
                </span>
              ) : (
                <span className="text-sm text-purple-300/70 italic">
                  Anonymous
                </span>
              )}
            </div>
            <span className="text-xs text-pink-200/40">{timeAgo}</span>
          </div>

          <p
            className={`text-pink-100 leading-relaxed mb-3 ${
              full ? "" : "line-clamp-4"
            }`}
          >
            {confession.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-pink-200/50">
              To:{" "}
              {confession.recipientUsername
                ? `@${confession.recipientUsername}`
                : confession.recipientAddress
                ? `${confession.recipientAddress.slice(0, 6)}...${confession.recipientAddress.slice(-4)}`
                : "Someone special"}
            </div>

            {!full && (
              <Link
                href={`/confession/${confession.id}`}
                className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
              >
                View
              </Link>
            )}
          </div>

          {confession.revealed && (
            <div className="mt-2 text-xs text-emerald-400/80 flex items-center gap-1">
              <span>Revealed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
