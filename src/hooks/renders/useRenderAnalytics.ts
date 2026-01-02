"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchRenderAnalytics } from "@/lib/services/renders/fetchRenderAnalytics";
import { RenderAnalyticsResponse, AnalyticsPeriod } from "@/types/render";

/**
 * Hook for fetching and managing render analytics data for charts.
 * Supports different time periods (day, week, month).
 */
export function useRenderAnalytics(period: AnalyticsPeriod = "day") {
  return useQuery<RenderAnalyticsResponse, Error>({
    queryKey: ["render-analytics", period],
    queryFn: () => fetchRenderAnalytics(period),
    staleTime: 60000 * 5, // 5 minutes (analytics don't change that fast)
    refetchOnWindowFocus: false,
  });
}
