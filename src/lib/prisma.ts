import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";

// Prisma 7's `prisma-client` engine has no built-in driver — it connects
// through the `pg` driver adapter, pointed at the local Prisma Postgres server.
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Reuse a single client across hot reloads in dev to avoid exhausting connections.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
