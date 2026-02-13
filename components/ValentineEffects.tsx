"use client";

import { useEffect, useState } from "react";

const HEART_EMOJIS = ["\u2764\ufe0f", "\ud83d\udc95", "\ud83d\udc96", "\ud83d\udc97", "\ud83d\udc9c", "\ud83e\ude77", "\u2763\ufe0f"];

interface Heart {
  id: number;
  emoji: string;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export function ValentineEffects() {
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    const generated: Heart[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      left: Math.random() * 100,
      size: 14 + Math.random() * 20,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    }));
    setHearts(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart-float"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: 0.15,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}
