"use client";

import { useQuery } from "@tanstack/react-query";
import {
  buildDownloadQcWindow,
  type DownloadQcWindowPreset,
} from "@/lib/downloads/downloadQualityControlParams";
import { fetchDownloadQualityQueue } from "@/lib/services/downloads/fetchDownloadQualityQueue";
import type { DownloadQualityQueueResponse } from "@/types/downloadQualityControl";

const STALE_MS = 60_000;

export type UseDownloadQualityQueueInput = {
  windowPreset: DownloadQcWindowPreset;
  page: number;
  pageSize?: number;
};

export function useDownloadQualityQueue(
  input: UseDownloadQualityQueueInput,
  options?: { enabled?: boolean },
) {
  const enabled = options?.enabled ?? true;
  const { windowPreset, page, pageSize = 25 } = input;

  return useQuery({
    queryKey: [
      "downloads",
      "qualityQueue",
      windowPreset,
      page,
      pageSize,
    ] as const,
    queryFn: () => {
      const { from, to } = buildDownloadQcWindow(windowPreset);
      return fetchDownloadQualityQueue({
        from,
        to,
        page,
        pageSize,
        needsAttention: true,
      });
    },
    enabled,
    staleTime: STALE_MS,
    retry: (failureCount, error) => {
      const message =
        error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("not found") || message.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });
}

export type { DownloadQualityQueueResponse };
