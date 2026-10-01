"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderInProgress } from "@/lib/services/renders/fetchRenderInProgress";

export function useRenderInProgress(options?: {
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ["renders", "in-progress"] as const,
    queryFn: fetchRenderInProgress,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: options?.refetchInterval,
  });
}
