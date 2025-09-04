import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __db__: PrismaClient;
}

let db: PrismaClient;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new PrismaClient();
  }
  db = global.__db__;
}

// Clean Prisma-only setup - no legacy compatibility

export { db };
