"use client";

import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Fleet, FleetInput, FleetsPage } from "@/lib/fleet";

export const FALLBACK_SEED_FLEETS: Fleet[] = [
  {
    id: "seed-0",
    name: "Ceci est un titre long sur 2 lignes pour une flotte...",
    description: "Toutes les startups de l’incubateur HEC",
    color: "#AC31E3",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-1",
    name: "Ceci est un titre long sur 2 lignes pour une flotte...",
    description: "Toutes les startups de l’incubateur HEC qu’importe l’année de leur promotion et d...",
    color: "#56C8E7",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-2",
    name: "Incubateur HEC",
    description: "Toutes les startups de l’incubateur HEC qu’importe l’année de leur promotion et d...",
    color: "#3B9EF5",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-3",
    name: "Ceci est un titre long sur 2 lignes pour une flotte...",
    description: "Renseignez une description dans les paramètres de la flotte",
    color: "#8569A1",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-4",
    name: "Incubateur HEC",
    description: "Renseignez une description dans les paramètres de la flotte",
    color: "#53C87A",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-5",
    name: "Incubateur HEC",
    description: "Toutes les startups de l’incubateur HEC",
    color: "#53C87A",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-6",
    name: "Incubateur HEC",
    description: "Renseignez une description dans les paramètres de la flotte",
    color: "#FFD05B",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-7",
    name: "Incubateur HEC",
    description: "Renseignez une description dans les paramètres de la flotte",
    color: "#FF811E",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-8",
    name: "Incubateur HEC",
    description: "Toutes les startups de l’incubateur HEC",
    color: "#3B9EF5",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "seed-9",
    name: "Incubateur HEC",
    description: "Toutes les startups de l’incubateur HEC qu’importe l’année de leur promotion et d...",
    color: "#9D2457",
    companies: 128,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function fetchFleets({ pageParam }: { pageParam: string | null }): Promise<FleetsPage> {
  const url = pageParam ? `/api/fleets?cursor=${encodeURIComponent(pageParam)}&limit=12` : "/api/fleets?limit=12";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch fleets: ${res.statusText}`);
  }
  return res.json();
}

export function useFleetsQuery() {
  return useInfiniteQuery({
    queryKey: ["fleets"],
    queryFn: fetchFleets,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    staleTime: 10_000,
  });
}

export function useCreateFleetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newFleet: FleetInput): Promise<Fleet> => {
      const res = await fetch("/api/fleets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFleet),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create fleet");
      }

      return res.json();
    },
    onSuccess: (createdFleet) => {
      // Optimistically update query cache to prepend the created fleet immediately
      queryClient.setQueryData<{ pages: FleetsPage[]; pageParams: (string | null)[] }>(
        ["fleets"],
        (oldData) => {
          if (!oldData || !oldData.pages.length) {
            return {
              pages: [{ items: [createdFleet], nextCursor: null }],
              pageParams: [null],
            };
          }

          const firstPage = oldData.pages[0];
          const updatedFirstPage: FleetsPage = {
            ...firstPage,
            items: [createdFleet, ...firstPage.items],
          };

          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        },
      );

      // Invalidate to guarantee consistency with backend
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
    },
  });
}
