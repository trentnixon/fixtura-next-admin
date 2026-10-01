"use client";

import { useMemo } from "react";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { useRenderInProgress } from "@/hooks/renders/useRenderInProgress";
import type { DataRefreshAttentionRun } from "@/lib/account-health/globalRunAnalytics";
import type { StuckRenderingAttentionItem } from "@/lib/scheduler/renderAttention";
import { getStuckRenderingAttentionFromInProgress } from "@/lib/scheduler/renderAttention";

export type FleetOpsAccountFlags = {
  renderStuck?: StuckRenderingAttentionItem;
  syncAttention?: DataRefreshAttentionRun;
};

export function useFleetOpsAccountIndex(): Map<number, FleetOpsAccountFlags> {
  const { data: healthGlobal } = useAccountHealthGlobalStatus();
  const { data: inProgressRenders } = useRenderInProgress();

  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const { policyRuns } = useDataRefreshAttentionState({
    activeRuns: healthGlobal?.data?.activeRuns,
    latestRuns: healthGlobal?.data?.latestRuns,
    activeCount: activeSyncCount,
  });

  return useMemo(() => {
    const map = new Map<number, FleetOpsAccountFlags>();

    for (const item of getStuckRenderingAttentionFromInProgress(
      inProgressRenders ?? []
    )) {
      if (item.accountId == null) continue;
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
  }, [inProgressRenders, policyRuns]);
}
