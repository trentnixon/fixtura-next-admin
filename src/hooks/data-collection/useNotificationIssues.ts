"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  FetchNotificationIssuesParams,
  NotificationIssuesData,
  NotificationIssuesMeta,
} from "@/types/notificationIssues";
import { fetchNotificationIssues } from "@/lib/services/data-collection/fetchNotificationIssues";

const DEFAULT_STALE_TIME = 60 * 1000; // 1 minute

export interface UseNotificationIssuesResult {
  data: NotificationIssuesData | undefined;
  meta: NotificationIssuesMeta | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}

export interface UseNotificationIssuesOptions {
  params: FetchNotificationIssuesParams;
  /** When false, the query does not run (e.g. custom range missing dates). */
  enabled?: boolean;
}

/**
 * React Query hook for GET fixtura-scraper/notifications/issues.
 */
export function useNotificationIssues(
  options: UseNotificationIssuesOptions
): UseNotificationIssuesResult {
  const { params, enabled = true } = options;

  const queryResult = useQuery({
    queryKey: ["notificationIssues", params] as const,
    queryFn: () => fetchNotificationIssues(params),
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  const err = queryResult.error;
  const error: Error | null =
    err == null
      ? null
      : err instanceof Error
        ? err
        : new Error(typeof err === "string" ? err : "Request failed");

  return {
    data: queryResult.data?.data,
    meta: queryResult.data?.meta,
    isLoading: queryResult.isLoading,
    error,
    refetch: queryResult.refetch,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isFetching: queryResult.isFetching,
  };
}
