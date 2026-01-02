"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderAudit } from "@/lib/services/renders/fetchRenderAudit";
import { RenderAuditResponse } from "@/types/render";

/**
 * Hook for fetching and managing the render audit data.
 * Supports pagination by passing the page number.
 */
export function useRenderAudit(page: number = 1) {
  return useQuery<RenderAuditResponse, Error>({
    queryKey: ["render-audit", page],
    queryFn: () => fetchRenderAudit(page),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
