"use client";

import { useQuery } from "@tanstack/react-query";
import type { NotificationByRunResponse } from "@/types/notificationByRun";
import { fetchNotificationByJobRun } from "@/lib/services/data-collection/fetchNotificationByJobRun";

const DEFAULT_STALE_TIME = 30 * 1000;

export interface UseNotificationByJobRunResult {
  data: NotificationByRunResponse | null | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isError: boolean;
  isFetching: boolean;
}

/**
 * React Query hook for GET fixtura-scraper/notifications/by-run/:jobId/:runId.
 * `data` is `null` when the API returns 404 (no notification for that run).
 */
export function useNotificationByJobRun(
  jobId: string | undefined,
  runId: string | undefined
): UseNotificationByJobRunResult {
  const j = jobId?.trim() ?? "";
  const r = runId?.trim() ?? "";
  const enabled = j.length > 0 && r.length > 0;

  const queryResult = useQuery({
    queryKey: ["notificationByRun", j, r],
    queryFn: () => fetchNotificationByJobRun(j, r),
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
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
