import { baseSepolia, base } from "wagmi/chains";

export const IS_TESTNET = process.env.NEXT_PUBLIC_CHAIN_ID === "84532";

export const CHAIN = IS_TESTNET ? baseSepolia : base;
export const CHAIN_ID = IS_TESTNET ? 84532 : 8453;

export const USDC_ADDRESS = IS_TESTNET
  ? "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
  : "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export const USDC_CAIP19 = `eip155:${CHAIN_ID}/erc20:${USDC_ADDRESS}`;

// 0.1 USDC in smallest unit (6 decimals)
export const CONFESSION_PRICE = "100000";
export const CONFESSION_PRICE_DISPLAY = "0.1 USDC";

export const TREASURY_ADDRESS =
  (process.env.NEXT_PUBLIC_TREASURY_ADDRESS as `0x${string}`) ??
  "0x0000000000000000000000000000000000000000";

export const APP_URL =
  (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const MAX_CONFESSION_LENGTH = 500;

export const THEMES = [
  { id: "hearts", label: "Classic Hearts", emoji: "💕", bg: "from-pink-500 to-rose-400" },
  { id: "roses", label: "Red Roses", emoji: "🌹", bg: "from-red-700 to-rose-600" },
  { id: "spicy", label: "Spicy", emoji: "🔥", bg: "from-orange-600 to-red-700" },
  { id: "secret", label: "Secret", emoji: "🤫", bg: "from-purple-800 to-indigo-900" },
  { id: "letter", label: "Love Letter", emoji: "💌", bg: "from-amber-200 to-orange-300" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
