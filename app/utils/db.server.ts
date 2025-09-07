import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const db =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV !== "production" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = db;
}
