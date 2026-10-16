"use client";

import { useQuery } from "@tanstack/react-query";
import { buildDownloadQcWindow } from "@/lib/downloads/downloadQualityControlParams";
import { fetchDownloadStatusTimeline } from "@/lib/services/downloads/fetchDownloadStatusTimeline";
import { LIVE_OVERVIEW_REFETCH_MS } from "@/app/dashboard/components/live-snapshot/liveOverviewConfig";

const STALE_MS = 60_000;
export const RECENT_DOWNLOADS_DASHBOARD_LIMIT = 10;

export function useRecentDownloadsDashboard(options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: [
      "downloads",
      "statusTimeline",
      "dashboard",
      "48h",
      RECENT_DOWNLOADS_DASHBOARD_LIMIT,
    ] as const,
    queryFn: () => {
      const { from, to } = buildDownloadQcWindow("48h");
      return fetchDownloadStatusTimeline({
        from,
        to,
        page: 1,
        pageSize: RECENT_DOWNLOADS_DASHBOARD_LIMIT,
      });
    },
    enabled,
    staleTime: STALE_MS,
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
    retry: 2,
  });
}
