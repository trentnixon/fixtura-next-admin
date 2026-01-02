"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderLineage } from "@/lib/services/renders/fetchRenderLineage";
import { RenderLineageResponse } from "@/types/render";

/**
 * Hook for fetching and managing a single render's deep lineage/DNA.
 *
 * @param id - The ID of the render to fetch
 * @param checkIntegrity - Whether to trigger the server-side integrity check
 */
export function useRenderLineage(id: number | string, checkIntegrity: boolean = false) {
  return useQuery<RenderLineageResponse, Error>({
    queryKey: ["render-lineage", id, checkIntegrity],
    queryFn: () => fetchRenderLineage(id, checkIntegrity),
    enabled: !!id,
    staleTime: 60000 * 60, // 1 hour (lineage for historical renders doesn't change)
    refetchOnWindowFocus: false,
  });
}
