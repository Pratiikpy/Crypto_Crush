"use client";

import { useState } from "react";
import { THEMES, MAX_CONFESSION_LENGTH, type ThemeId } from "@/lib/constants";

interface ConfessionFormProps {
  onSubmit: (data: {
    message: string;
    recipientUsername: string;
    recipientAddress: string;
    theme: ThemeId;
  }) => void;
  disabled?: boolean;
}

export function ConfessionForm({ onSubmit, disabled }: ConfessionFormProps) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [theme, setTheme] = useState<ThemeId>("hearts");

  const isAddress = recipient.startsWith("0x") && recipient.length === 42;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !recipient.trim()) return;

    onSubmit({
      message: message.trim(),
      recipientUsername: isAddress ? "" : recipient.replace("@", ""),
      recipientAddress: isAddress ? recipient : "",
      theme,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Recipient */}
      <div>
        <label className="block text-sm text-pink-300 mb-2">
          To (username or wallet address)
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="@username or 0x..."
          className="w-full px-4 py-3 rounded-xl bg-pink-900/20 border border-pink-800/30 text-pink-100 placeholder-pink-300/30 focus:outline-none focus:border-pink-500/50 transition-colors"
          disabled={disabled}
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm text-pink-300 mb-2">
          Your confession
        </label>
        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value.slice(0, MAX_CONFESSION_LENGTH))
          }
          placeholder="Write your anonymous confession..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-pink-900/20 border border-pink-800/30 text-pink-100 placeholder-pink-300/30 focus:outline-none focus:border-pink-500/50 transition-colors resize-none"
          disabled={disabled}
        />
        <div className="text-xs text-pink-200/40 text-right mt-1">
          {message.length}/{MAX_CONFESSION_LENGTH}
        </div>
      </div>

      {/* Theme Picker */}
      <div>
        <label className="block text-sm text-pink-300 mb-2">Theme</label>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                theme === t.id
                  ? "border-pink-400 bg-pink-900/40"
                  : "border-pink-800/20 bg-pink-900/10 hover:border-pink-800/40"
              }`}
              disabled={disabled}
            >
              <span className="text-xl">{t.emoji}</span>
              <span className="text-[10px] text-pink-200/60">{t.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={disabled || !message.trim() || !recipient.trim()}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-500 font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-pink-500 hover:to-rose-400 transition-all pulse-glow"
      >
        Send Confession (0.1 USDC)
      </button>
    </form>
  );
}
