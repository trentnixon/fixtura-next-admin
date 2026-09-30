"use client";

import { useMemo } from "react";
import {
  computeDataRefreshAttentionState,
  mergeAttentionRunSources,
} from "@/lib/account-health/globalRunAnalytics";
import type { AccountHealthGlobalLatestRunRow } from "@/types/accountHealth";

export type UseDataRefreshAttentionStateInput = {
  activeRuns?: AccountHealthGlobalLatestRunRow[];
  latestRuns?: AccountHealthGlobalLatestRunRow[];
  activeCount: number;
};

export function useDataRefreshAttentionState({
  activeRuns,
  latestRuns,
  activeCount,
}: UseDataRefreshAttentionStateInput) {
  return useMemo(() => {
    const rows = mergeAttentionRunSources(activeRuns, latestRuns);
    const lockListComplete = activeRuns != null;

    return computeDataRefreshAttentionState(rows, activeCount, Date.now(), {
      lockListComplete,
    });
  }, [activeRuns, latestRuns, activeCount]);
}
