"use client";

import { useState } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

interface RevealButtonProps {
  confessionId: string;
  revealed: boolean;
  onRevealed: () => void;
}

export function RevealButton({
  confessionId,
  revealed,
  onRevealed,
}: RevealButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  if (revealed) {
    return (
      <span className="text-xs text-emerald-400/70 px-3 py-1.5 rounded-lg bg-emerald-900/20">
        Identity Revealed
      </span>
    );
  }

  const handleReveal = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    try {
      const stored = JSON.parse(
        localStorage.getItem("revealTokens") ?? "{}"
      );
      const revealToken = stored[confessionId];
      if (!revealToken) {
        alert("Reveal token not found. Did you send this confession from this device?");
        setLoading(false);
        setConfirming(false);
        return;
      }

      const { token: authToken } = await sdk.quickAuth.getToken();
      const ctx = await sdk.context;

      const response = await fetch("/api/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          confessionId,
          revealToken,
          senderUsername: ctx.user.username,
          senderPfp: ctx.user.pfpUrl,
        }),
      });

      if (response.ok) {
        onRevealed();
        try {
          await sdk.haptics.notificationOccurred("success");
        } catch {
          // haptics not available
        }
      } else {
        const data = await response.json();
        alert(data.error || "Failed to reveal");
      }
    } catch (err) {
      console.error("Reveal error:", err);
      alert("Failed to reveal identity");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <button
      onClick={handleReveal}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-lg transition-all ${
        confirming
          ? "bg-red-600/80 text-white hover:bg-red-600"
          : "bg-pink-900/30 text-pink-300 hover:bg-pink-900/40"
      } disabled:opacity-50`}
    >
      {loading
        ? "Revealing..."
        : confirming
        ? "Tap again to confirm"
        : "Reveal Identity"}
    </button>
  );
}
