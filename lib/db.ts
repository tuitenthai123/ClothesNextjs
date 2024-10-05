import { PrismaClient } from "@prisma/client";

declare global {
  var dulieu: PrismaClient | undefined;
};

export const db = globalThis.dulieu || new PrismaClient();

globalThis.dulieu = db;
