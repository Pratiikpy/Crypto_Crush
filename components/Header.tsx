"use client";

import Link from "next/link";

interface HeaderProps {
  username?: string;
}

export function Header({ username }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#1a0a1e]/80 border-b border-pink-900/30">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-pink-300">
          CCC
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/send"
            className="text-sm text-pink-200/70 hover:text-pink-200 transition-colors"
          >
            Send
          </Link>
          <Link
            href="/my"
            className="text-sm text-pink-200/70 hover:text-pink-200 transition-colors"
          >
            My Confessions
          </Link>
          {username && (
            <span className="text-xs bg-pink-900/40 text-pink-300 px-2 py-1 rounded-full">
              @{username}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
