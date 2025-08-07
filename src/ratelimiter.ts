import { NextFunction, Request, Response } from "express";
import { isRateLimit } from "./rate-limit";

export async function ratelimiter(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const isLimited = await isRateLimit(ip as string, 5, 60);
  if (isLimited) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }
  next(); // pass to next middleware
}
