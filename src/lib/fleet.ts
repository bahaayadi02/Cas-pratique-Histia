import { z } from "zod";

/** The eight fleet accent colors offered in the Figma palette (first = default). */
export const FLEET_COLORS = [
  "#3B9EF5",
  "#56C8E7",
  "#53C87A",
  "#FFD05B",
  "#FF811E",
  "#F35358",
  "#D75AD5",
  "#AC31E3",
] as const;

export const DEFAULT_FLEET_COLOR = FLEET_COLORS[0];

/** A fleet as returned by the API (dates serialized to ISO strings). */
export type Fleet = {
  id: string;
  name: string;
  description: string;
  color: string;
  companies: number;
  createdAt: string;
  updatedAt: string;
};

/** Number of fleets returned per page by the list endpoint. */
export const FLEETS_PAGE_SIZE = 12;

/** One page of the cursor-paginated fleet list. */
export type FleetsPage = {
  items: Fleet[];
  nextCursor: string | null;
};

const hexColor = z
  .string()
  .trim()
  .regex(/^#[0-9a-fA-F]{6}$/, "invalid-color");

/** Validation for creating / updating a fleet. Shared by the form and the API. */
export const fleetInputSchema = z.object({
  name: z.string().trim().min(1, "name-required").max(80, "name-too-long"),
  description: z.string().trim().max(240, "description-too-long"),
  color: hexColor,
});

export type FleetInput = z.infer<typeof fleetInputSchema>;

/** Partial payload accepted by the update (PATCH) endpoint. */
export const fleetUpdateSchema = fleetInputSchema.partial();
export type FleetUpdate = z.infer<typeof fleetUpdateSchema>;

/** Shape of a Prisma `Fleet` row (dates as `Date`) before serialization. */
export type FleetRow = {
  id: string;
  name: string;
  description: string;
  color: string;
  companies: number;
  createdAt: Date;
  updatedAt: Date;
};

/** Serialize a DB row into the JSON-safe {@link Fleet} returned by the API. */
export function serializeFleet(row: FleetRow): Fleet {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    color: row.color,
    companies: row.companies,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
