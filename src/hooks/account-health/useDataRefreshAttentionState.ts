"use client";

import { useMemo } from "react";
import { computeDataRefreshAttentionState } from "@/lib/account-health/globalRunAnalytics";
import type { AccountHealthGlobalLatestRunRow } from "@/types/accountHealth";

export function useDataRefreshAttentionState(
  latestRuns: AccountHealthGlobalLatestRunRow[] | undefined,
  activeCount: number
) {
  return useMemo(
    () => computeDataRefreshAttentionState(latestRuns ?? [], activeCount),
    [latestRuns, activeCount]
  );
}
