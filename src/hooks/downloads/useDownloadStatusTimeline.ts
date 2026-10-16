"use client";

import { useQuery } from "@tanstack/react-query";
import {
  buildDownloadQcWindow,
  type DownloadQcWindowPreset,
} from "@/lib/downloads/downloadQualityControlParams";
import { fetchDownloadStatusTimeline } from "@/lib/services/downloads/fetchDownloadStatusTimeline";
import type { DownloadStatusTimelineWindowPreset } from "@/types/downloadStatusTimeline";

const STALE_MS = 60_000;
const PAGE_SIZE = 100;

export type UseDownloadStatusTimelineInput = {
  windowPreset: DownloadStatusTimelineWindowPreset;
  page: number;
};

function isTimelinePreset(
  preset: DownloadQcWindowPreset,
): preset is DownloadStatusTimelineWindowPreset {
  return preset === "24h" || preset === "48h" || preset === "7d";
}

export function useDownloadStatusTimeline(input: UseDownloadStatusTimelineInput) {
  const { windowPreset, page } = input;

  return useQuery({
    queryKey: ["downloads", "statusTimeline", windowPreset, page] as const,
    queryFn: () => {
      const { from, to } = buildDownloadQcWindow(windowPreset);
      return fetchDownloadStatusTimeline({
        from,
        to,
        page,
        pageSize: PAGE_SIZE,
      });
    },
    enabled: isTimelinePreset(windowPreset),
    staleTime: STALE_MS,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export { PAGE_SIZE as DOWNLOAD_STATUS_TIMELINE_PAGE_SIZE };
