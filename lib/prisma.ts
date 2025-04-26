// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// disable the “no-var” rule just for our global cache declaration
declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient | undefined;
}

export const db =
  global.__db ||
  new PrismaClient({
    log: ['query'], // optional: logs SQL to your console
  });

if (process.env.NODE_ENV !== 'production') {
  global.__db = db;
}
