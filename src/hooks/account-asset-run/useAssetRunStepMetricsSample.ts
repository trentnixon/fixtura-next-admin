"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchAccountAssetRunStatus } from "@/lib/services/account-asset-run/fetchAccountAssetRunStatus";
import {
  aggregateStepDurationsFromRuns,
  pickRunsForStepMetricsSample,
} from "@/lib/account-asset-run/globalRunAnalytics";
import type { AccountAssetRunListRow } from "@/types/accountAssetRun";

const SAMPLE_LIMIT = 8;

/**
 * Fetches full run detail for the slowest completed runs in the window
 * to build fleet-wide step duration aggregates.
 */
export function useAssetRunStepMetricsSample(
  rows: AccountAssetRunListRow[],
  enabled = true
) {
  const sampleRunIds = useMemo(
    () => pickRunsForStepMetricsSample(rows, SAMPLE_LIMIT),
    [rows]
  );

  const queries = useQueries({
    queries: sampleRunIds.map((runId) => ({
      queryKey: ["accountAssetRun", "run", runId, "stepSample"] as const,
      queryFn: () => fetchAccountAssetRunStatus(runId),
      enabled: enabled && sampleRunIds.length > 0,
      staleTime: 120_000,
      retry: 1,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const stepAggregates = useMemo(() => {
    const runs = queries
      .map((q) => q.data?.data)
      .filter((run): run is NonNullable<typeof run> => run != null);
    return aggregateStepDurationsFromRuns(runs);
  }, [queries]);

  return {
    sampleRunIds,
    stepAggregates,
    isLoading,
    isError,
    sampleCount: sampleRunIds.length,
  };
}
