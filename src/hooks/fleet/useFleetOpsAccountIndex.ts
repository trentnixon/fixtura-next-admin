"use client";

import { useMemo } from "react";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import type { DataRefreshAttentionRun } from "@/lib/account-health/globalRunAnalytics";
import type { StuckRenderingAttentionItem } from "@/lib/scheduler/renderAttention";
import { getStuckRenderingAttention } from "@/lib/scheduler/renderAttention";

export type FleetOpsAccountFlags = {
  renderStuck?: StuckRenderingAttentionItem;
  syncAttention?: DataRefreshAttentionRun;
};

export function useFleetOpsAccountIndex(): Map<number, FleetOpsAccountFlags> {
  const { data: healthGlobal } = useAccountHealthGlobalStatus();
  const { data: todaysRenders } = useGetTodaysRenders();

  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const { policyRuns } = useDataRefreshAttentionState(
    healthGlobal?.data?.latestRuns,
    activeSyncCount
  );

  return useMemo(() => {
    const map = new Map<number, FleetOpsAccountFlags>();

    for (const item of getStuckRenderingAttention(todaysRenders ?? [])) {
      map.set(item.accountId, {
        ...map.get(item.accountId),
        renderStuck: item,
      });
    }

    for (const run of policyRuns) {
      map.set(run.accountId, {
        ...map.get(run.accountId),
        syncAttention: run,
      });
    }

    return map;
  }, [policyRuns, todaysRenders]);
}
