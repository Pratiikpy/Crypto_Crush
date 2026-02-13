import type { ThemeId } from "./constants";

export interface Confession {
  id: string;
  senderFid: number;
  senderUsername?: string;
  senderPfp?: string;
  recipientUsername?: string;
  recipientAddress?: string;
  recipientFid?: number;
  message: string;
  theme: ThemeId;
  txHash: string;
  timestamp: number;
  revealed: boolean;
  likes: number;
}

export interface NotificationDetails {
  url: string;
  token: string;
}

export interface RevealRecord {
  senderFid: number;
  token: string;
}
