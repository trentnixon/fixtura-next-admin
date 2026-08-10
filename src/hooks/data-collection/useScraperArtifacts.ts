"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchScraperArtifacts } from "@/lib/services/data-collection/fetchScraperArtifacts";
import type { ScraperArtifact } from "@/types/scraperArtifact";

const DEFAULT_STALE_TIME = 60 * 1000;

export interface UseScraperArtifactsOptions {
  jobId: string | undefined;
  /** When set, prefer artifacts for this run but still show others for the job. */
  highlightRunId?: string | null;
  enabled?: boolean;
}

export interface UseScraperArtifactsResult {
  artifacts: ScraperArtifact[];
  highlightRunId?: string;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
}

export function useScraperArtifacts(
  options: UseScraperArtifactsOptions,
): UseScraperArtifactsResult {
  const jobId = options.jobId?.trim() ?? "";
  const highlightRunId = options.highlightRunId?.trim() || undefined;
  const enabled = (options.enabled ?? true) && jobId.length > 0;

  const queryResult = useQuery({
    queryKey: ["scraperArtifacts", jobId] as const,
    queryFn: () => fetchScraperArtifacts({ jobId }),
    enabled,
    staleTime: DEFAULT_STALE_TIME,
    retry: 1,
  });

  const err = queryResult.error;
  const error: Error | null =
    err == null
      ? null
      : err instanceof Error
        ? err
        : new Error(typeof err === "string" ? err : "Request failed");

  return {
    artifacts: queryResult.data?.data ?? [],
    highlightRunId,
    isLoading: queryResult.isLoading,
    error,
    refetch: queryResult.refetch,
    isFetching: queryResult.isFetching,
  };
}
