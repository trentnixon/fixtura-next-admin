"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderDistribution } from "@/lib/services/renders/fetchRenderDistribution";
import { RenderDistributionResponse } from "@/types/render";

/**
 * Hook for fetching and managing render distribution data (leaderboards).
 * Used for resource allocation and ROI analysis.
 */
export function useRenderDistribution() {
  return useQuery<RenderDistributionResponse, Error>({
    queryKey: ["render-distribution"],
    queryFn: () => fetchRenderDistribution(),
    staleTime: 60000 * 15, // 15 minutes (leaderboards are slow-moving)
    refetchOnWindowFocus: false,
  });
}
