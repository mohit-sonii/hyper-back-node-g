import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_DB || "redis://127.0.0.1:6379");