"use client";

import { useState, useEffect, useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";
import { ConfessionForm } from "./ConfessionForm";
import {
  USDC_CAIP19,
  CONFESSION_PRICE,
  CONFESSION_PRICE_DISPLAY,
  TREASURY_ADDRESS,
} from "@/lib/constants";
import type { ThemeId } from "@/lib/constants";
import Link from "next/link";

type Step = "form" | "paying" | "saving" | "success" | "error";

interface ConfessionData {
  message: string;
  recipientUsername: string;
  recipientAddress: string;
  theme: ThemeId;
}

export function SendConfessionFlow() {
  const [step, setStep] = useState<Step>("form");
  const [error, setError] = useState("");
  const [confessionId, setConfessionId] = useState<string>();
  const [revealToken, setRevealToken] = useState<string>();
  const [userFid, setUserFid] = useState<number>();
  const [username, setUsername] = useState<string>();
  const [pfpUrl, setPfpUrl] = useState<string>();

  useEffect(() => {
    const loadContext = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (inMiniApp) {
          const ctx = await sdk.context;
          setUserFid(ctx.user.fid);
          setUsername(ctx.user.username);
          setPfpUrl(ctx.user.pfpUrl);
        }
      } catch {
        // not in mini app
      }
    };
    loadContext();
  }, []);

  const handleSubmit = useCallback(
    async (data: ConfessionData) => {
      setStep("paying");
      setError("");

      try {
        // Step 1: Payment via sendToken
        const result = await sdk.actions.sendToken({
          token: USDC_CAIP19,
          amount: CONFESSION_PRICE,
          recipientAddress: TREASURY_ADDRESS,
        });

        if (!result.success) {
          const reason =
            result.reason === "rejected_by_user"
              ? "Payment was cancelled"
              : "Payment failed. Please try again.";
          setError(reason);
          setStep("error");
          return;
        }

        // Step 2: Save confession
        setStep("saving");

        const { token: authToken } = await sdk.quickAuth.getToken();

        const response = await fetch("/api/confessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ...data,
            senderFid: userFid,
            senderUsername: username,
            senderPfp: pfpUrl,
            txHash: result.send.transaction,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save confession");
        }

        const savedData = await response.json();
        setConfessionId(savedData.confession.id);
        setRevealToken(savedData.revealToken);

        // Store reveal token in localStorage
        const stored = JSON.parse(
          localStorage.getItem("revealTokens") ?? "{}"
        );
        stored[savedData.confession.id] = savedData.revealToken;
        localStorage.setItem("revealTokens", JSON.stringify(stored));

        setStep("success");

        // Haptic feedback
        try {
          await sdk.haptics.notificationOccurred("success");
        } catch {
          // haptics not available
        }
      } catch (err) {
        console.error("Confession flow error:", err);
        setError("Something went wrong. Please try again.");
        setStep("error");
      }
    },
    [userFid, username, pfpUrl]
  );

  const handleShare = async () => {
    try {
      await sdk.actions.composeCast({
        text: `I just sent an anonymous Valentine's confession on Crypto Crush Confession! Who's your crypto crush?`,
        embeds: [`${window.location.origin}/confession/${confessionId}`],
      });
    } catch {
      // fallback: just copy link
      navigator.clipboard.writeText(
        `${window.location.origin}/confession/${confessionId}`
      );
    }
  };

  if (step === "paying") {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 animate-bounce">Paying...</div>
        <p className="text-pink-200/70">
          Confirm {CONFESSION_PRICE_DISPLAY} payment...
        </p>
      </div>
    );
  }

  if (step === "saving") {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 animate-pulse">Saving your confession...</div>
        <p className="text-pink-200/70">Almost there...</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="text-center py-12 animate-slide-up">
        <div className="text-6xl mb-4">Sent!</div>
        <h2 className="text-2xl font-bold text-pink-300 mb-2">
          Confession Sent!
        </h2>
        <p className="text-pink-200/70 mb-6 text-sm">
          Your anonymous confession has been delivered.
          <br />
          You can reveal your identity anytime from &quot;My Confessions&quot;.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 font-semibold"
          >
            Share on Farcaster
          </button>

          <Link
            href={`/confession/${confessionId}`}
            className="block w-full py-3 rounded-xl border border-pink-800/30 text-pink-300 font-semibold hover:bg-pink-900/20 transition-colors"
          >
            View Confession
          </Link>

          <Link
            href="/my"
            className="block w-full py-3 rounded-xl text-pink-200/50 text-sm hover:text-pink-200/70 transition-colors"
          >
            My Confessions
          </Link>
        </div>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">Oops</div>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={() => setStep("form")}
          className="px-6 py-3 rounded-xl bg-pink-900/30 text-pink-300 hover:bg-pink-900/40 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      {!userFid && (
        <div className="mb-4 p-3 rounded-xl bg-amber-900/20 border border-amber-800/30 text-amber-200 text-sm">
          Open this app in Warpcast or Base App to send confessions.
        </div>
      )}
      <ConfessionForm onSubmit={handleSubmit} disabled={!userFid} />
    </div>
  );
}
