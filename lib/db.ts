import { Redis } from "@upstash/redis";
import type { Confession, NotificationDetails, RevealRecord } from "./types";

let _redis: Redis | null = null;

function getRedis(): Redis {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return _redis;
}

const redis = new Proxy({} as Redis, {
  get(_, prop) {
    return (getRedis() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// ─── Confessions ─────────────────────────────────────────────

export async function saveConfession(confession: Confession) {
  await Promise.all([
    redis.set(`confession:${confession.id}`, JSON.stringify(confession)),
    redis.zadd("confessions:all", {
      score: confession.timestamp,
      member: confession.id,
    }),
    redis.lpush(`sent:${confession.senderFid}`, confession.id),
    confession.recipientFid
      ? redis.lpush(`inbox:${confession.recipientFid}`, confession.id)
      : Promise.resolve(),
  ]);
}

export async function getConfession(id: string): Promise<Confession | null> {
  const data = await redis.get<string>(`confession:${id}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function getRecentConfessions(
  offset = 0,
  limit = 20
): Promise<Confession[]> {
  const ids = await redis.zrange("confessions:all", offset, offset + limit - 1, {
    rev: true,
  });
  if (!ids.length) return [];

  const confessions = await Promise.all(
    ids.map((id) => getConfession(id as string))
  );
  return confessions.filter(Boolean) as Confession[];
}

export async function getSentConfessions(fid: number): Promise<Confession[]> {
  const ids = await redis.lrange(`sent:${fid}`, 0, 49);
  if (!ids.length) return [];

  const confessions = await Promise.all(
    ids.map((id) => getConfession(id as string))
  );
  return confessions.filter(Boolean) as Confession[];
}

export async function getInboxConfessions(fid: number): Promise<Confession[]> {
  const ids = await redis.lrange(`inbox:${fid}`, 0, 49);
  if (!ids.length) return [];

  const confessions = await Promise.all(
    ids.map((id) => getConfession(id as string))
  );
  return confessions.filter(Boolean) as Confession[];
}

export async function updateConfession(id: string, updates: Partial<Confession>) {
  const confession = await getConfession(id);
  if (!confession) return null;
  const updated = { ...confession, ...updates };
  await redis.set(`confession:${id}`, JSON.stringify(updated));
  return updated;
}

// ─── Reveal Tokens ───────────────────────────────────────────

export async function saveRevealToken(
  confessionId: string,
  record: RevealRecord
) {
  await redis.set(`reveal:${confessionId}`, JSON.stringify(record));
}

export async function getRevealToken(
  confessionId: string
): Promise<RevealRecord | null> {
  const data = await redis.get<string>(`reveal:${confessionId}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

// ─── Notification Tokens ─────────────────────────────────────

export async function saveNotificationToken(
  fid: number,
  appFid: number,
  details: NotificationDetails
) {
  await redis.set(`notif:${fid}:${appFid}`, JSON.stringify(details));
}

export async function getNotificationToken(
  fid: number,
  appFid: number
): Promise<NotificationDetails | null> {
  const data = await redis.get<string>(`notif:${fid}:${appFid}`);
  if (!data) return null;
  return typeof data === "string" ? JSON.parse(data) : data;
}

export async function deleteNotificationToken(fid: number, appFid: number) {
  await redis.del(`notif:${fid}:${appFid}`);
}
