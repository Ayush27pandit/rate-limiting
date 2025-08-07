import { Redis } from "@upstash/redis";
import dotenv from "dotenv";
dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function isRateLimit(
  ip: string,
  limit = 10,
  windowInSeconds = 10
): Promise<boolean> {
  const key = "rate-limit:" + ip;
  const now = Math.floor(Date.now() / 1000);
  const results = await redis
    .pipeline()
    .zremrangebyscore(key, 0, now - windowInSeconds) //remove old tokens
    .zadd(key, { score: now, member: `${now}=${Math.random()}` }) //add new token
    .zcard(key) //get count
    .expire(key, windowInSeconds)
    .exec();
  const count = results[2] as number; // zcard is the third command in the pipeline
  return count > limit;
}
