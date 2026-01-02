"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderTelemetry } from "@/lib/services/renders/fetchRenderTelemetry";
import { RenderTelemetryResponse } from "@/types/render";

/**
 * Hook for fetching and managing real-time render telemetry.
 * Polls every 30 seconds to keep stats fresh.
 */
export function useRenderTelemetry() {
  return useQuery<RenderTelemetryResponse, Error>({
    queryKey: ["render-telemetry"],
    queryFn: () => fetchRenderTelemetry(),
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
