import { prisma } from "@/lib/prisma";
import { FLEETS_PAGE_SIZE, serializeFleet, type FleetsPage } from "@/lib/fleet";

/**
 * Read one cursor-paginated page of fleets, newest first. Shared by the GET
 * route handler and the server-side prefetch so both return the same shape.
 */
export async function getFleetsPage({
  cursor,
  limit = FLEETS_PAGE_SIZE,
}: {
  cursor?: string | null;
  limit?: number;
}): Promise<FleetsPage> {
  const rows = await prisma.fleet.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const hasMore = rows.length > limit;
  const items = (hasMore ? rows.slice(0, limit) : rows).map(serializeFleet);
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor };
}
