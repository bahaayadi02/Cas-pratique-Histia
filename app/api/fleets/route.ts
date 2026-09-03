import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  FLEETS_PAGE_SIZE,
  fleetInputSchema,
  serializeFleet,
} from "@/lib/fleet";

// Always run at request time: results depend on the cursor query param + DB state.
export const dynamic = "force-dynamic";

/** GET /api/fleets?cursor=<id>&limit=<n> — cursor-paginated, newest first. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limitParam = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50
      ? Math.floor(limitParam)
      : FLEETS_PAGE_SIZE;

  const rows = await prisma.fleet.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });

  const hasMore = rows.length > limit;
  const items = (hasMore ? rows.slice(0, limit) : rows).map(serializeFleet);
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return Response.json({ items, nextCursor });
}

/** POST /api/fleets — create a fleet. */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const parsed = fleetInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const created = await prisma.fleet.create({ data: parsed.data });
  return Response.json(serializeFleet(created), { status: 201 });
}
