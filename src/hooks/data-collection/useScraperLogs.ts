"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  FetchScraperLogsParams,
  JobSummary,
  ListLogsMeta,
} from "@/types/scraperLogs";
import { fetchScraperLogs } from "@/lib/services/data-collection/fetchScraperLogs";

/** Scope values for scraper logs API filter (response format) */
const SCOPES = [
  "clients_list",
  "association_to_competition",
  "club_to_competition",
  "grades_comps",
  "grades_lookup_teams",
  "club_active_check",
] as const;
const DEFAULT_STALE_TIME = 60 * 1000; // 1 minute

export interface UseScraperLogsParams {
  scope?: string; // optional: omit for all scopes
  page?: number;
  pageSize?: number;
  timestamp_gte?: string;
  timestamp_lte?: string;
  include?: "entries";
  enabled?: boolean;
  /** When set, overrides the default in-progress polling interval. */
  refetchInterval?: number | false;
}

export interface UseScraperLogsResult {
  data: JobSummary[] | undefined;
  meta: ListLogsMeta | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isError: boolean;
  isSuccess: boolean;
  isFetching: boolean;
}

/**
 * React Query hook for fetching scraper logs by scope.
 *
 * @param params - scope (required), optional page, pageSize, timestamp_gte, timestamp_lte, include
 * @returns Flattened { data, meta, isLoading, error, refetch } plus query flags
 */
export function useScraperLogs(
  params: UseScraperLogsParams
): UseScraperLogsResult {
  const scope =
    params.scope && typeof params.scope === "string"
      ? params.scope.trim()
      : undefined;
  const isValidScope =
    !scope || (scope.length > 0 && SCOPES.includes(scope as (typeof SCOPES)[number]));
  const enabled = params.enabled !== false && isValidScope;

  const queryResult = useQuery({
    queryKey: ["scraperLogs", params],
    refetchInterval: (query) => {
      if (params.refetchInterval !== undefined) {
        return params.refetchInterval;
      }

      const data = query.state.data as { meta?: { summary?: { byStatus?: { in_progress?: number } } } } | undefined;
      const inProgress = data?.meta?.summary?.byStatus?.in_progress ?? 0;
      return inProgress > 0 ? 10_000 : false; // Poll every 10s when jobs in progress
    },
    queryFn: () => {
      const fetchParams: FetchScraperLogsParams = {
        timestamp_gte: params.timestamp_gte,
        timestamp_lte: params.timestamp_lte,
        include: params.include,
      };
      if (scope && scope.length > 0) {
        fetchParams.scope = scope;
      }
      if (params.page !== undefined || params.pageSize !== undefined) {
        fetchParams.pagination = {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 25,
        };
      }
      return fetchScraperLogs(fetchParams);
    },
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
  });

  return {
    data: queryResult.data?.data,
    meta: queryResult.data?.meta,
    isLoading: queryResult.isLoading,
    error: queryResult.error ?? null,
    refetch: queryResult.refetch,
    isError: queryResult.isError,
    isSuccess: queryResult.isSuccess,
    isFetching: queryResult.isFetching,
  };
}
