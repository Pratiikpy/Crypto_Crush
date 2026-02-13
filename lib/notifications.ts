import { nanoid } from "nanoid";
import { getNotificationToken } from "./db";
import { APP_URL } from "./constants";

const APP_FID = 1; // Replace with actual app FID after registration

export async function sendConfessionNotification(
  recipientFid: number,
  confessionId: string
) {
  const details = await getNotificationToken(recipientFid, APP_FID);
  if (!details) return { state: "no_token" as const };

  try {
    const response = await fetch(details.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: nanoid(),
        title: "Secret Valentine",
        body: "Someone sent you an anonymous confession...",
        targetUrl: `${APP_URL}/confession/${confessionId}`,
        tokens: [details.token],
      }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.result?.invalidTokens?.length > 0) {
        return { state: "invalid_token" as const };
      }
      if (data.result?.rateLimitedTokens?.length > 0) {
        return { state: "rate_limited" as const };
      }
      return { state: "success" as const };
    }

    return { state: "error" as const };
  } catch {
    return { state: "error" as const };
  }
}

export async function sendRevealNotification(
  recipientFid: number,
  confessionId: string,
  senderUsername: string
) {
  const details = await getNotificationToken(recipientFid, APP_FID);
  if (!details) return { state: "no_token" as const };

  try {
    const response = await fetch(details.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: nanoid(),
        title: "Identity Revealed!",
        body: `${senderUsername} revealed themselves as your secret admirer!`,
        targetUrl: `${APP_URL}/confession/${confessionId}`,
        tokens: [details.token],
      }),
    });

    return response.ok
      ? { state: "success" as const }
      : { state: "error" as const };
  } catch {
    return { state: "error" as const };
  }
}
