"use client";

import { useQuery } from "@tanstack/react-query";
import type { ScraperLogByJobIdResponse } from "@/types/scraperLogs";
import { fetchScraperLogByJobId } from "@/lib/services/data-collection/fetchScraperLogByJobId";

const DEFAULT_STALE_TIME = 30 * 1000;

export interface UseScraperLogByJobIdResult {
  data: ScraperLogByJobIdResponse | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isError: boolean;
  isFetching: boolean;
}

/**
 * Fetches a single scraper job with full event entries for the job detail route.
 */
export function useScraperLogByJobId(
  jobId: string | undefined
): UseScraperLogByJobIdResult {
  const enabled = !!jobId && jobId.trim().length > 0;

  const queryResult = useQuery({
    queryKey: ["scraperLog", jobId],
    queryFn: () => fetchScraperLogByJobId(jobId!),
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    refetchInterval: (query) => {
      const status = query.state.data?.job?.status;
      return status === "in_progress" ? 10_000 : false;
    },
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    error: queryResult.error ?? null,
    refetch: queryResult.refetch,
    isError: queryResult.isError,
    isFetching: queryResult.isFetching,
  };
}
