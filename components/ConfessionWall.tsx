"use client";

import { useEffect, useState } from "react";
import { ConfessionCard } from "./ConfessionCard";
import type { Confession } from "@/lib/types";

export function ConfessionWall() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchConfessions = async (currentOffset: number) => {
    try {
      const res = await fetch(
        `/api/confessions?offset=${currentOffset}&limit=20`
      );
      const data = await res.json();

      if (currentOffset === 0) {
        setConfessions(data.confessions);
      } else {
        setConfessions((prev) => [...prev, ...data.confessions]);
      }

      setHasMore(data.confessions.length === 20);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfessions(0);
  }, []);

  const loadMore = () => {
    const nextOffset = offset + 20;
    setOffset(nextOffset);
    fetchConfessions(nextOffset);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-pink-900/20 animate-pulse h-32"
          />
        ))}
      </div>
    );
  }

  if (confessions.length === 0) {
    return (
      <div className="text-center py-12 text-pink-200/50">
        <p className="text-4xl mb-3">No confessions yet</p>
        <p className="text-sm">Be the first to confess your crush!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {confessions.map((confession) => (
        <ConfessionCard key={confession.id} confession={confession} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full py-3 text-sm text-pink-300 bg-pink-900/20 rounded-xl hover:bg-pink-900/30 transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
