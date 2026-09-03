import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { fleetUpdateSchema, serializeFleet } from "@/lib/fleet";

type Params = { params: Promise<{ id: string }> };

// Prisma throws this code when an update/delete targets a missing row.
function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}

/** PATCH /api/fleets/:id — update fleet settings (name, description, color). */
export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  const parsed = fleetUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.fleet.update({
      where: { id },
      data: parsed.data,
    });
    return Response.json(serializeFleet(updated));
  } catch (error) {
    if (isNotFound(error)) {
      return Response.json({ error: "not-found" }, { status: 404 });
    }
    throw error;
  }
}

/** DELETE /api/fleets/:id — remove a fleet. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.fleet.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    if (isNotFound(error)) {
      return Response.json({ error: "not-found" }, { status: 404 });
    }
    throw error;
  }
}
