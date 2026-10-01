"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { useRenderInProgress } from "@/hooks/renders/useRenderInProgress";
import { getStuckRenderingAttentionFromInProgress } from "@/lib/scheduler/renderAttention";

export function AccountsOperationsTabBadge() {
  const { data: healthGlobal } = useAccountHealthGlobalStatus();
  const { data: inProgressRenders } = useRenderInProgress();
  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const { policyRuns, hiddenActiveCount } = useDataRefreshAttentionState({
    activeRuns: healthGlobal?.data?.activeRuns,
    latestRuns: healthGlobal?.data?.latestRuns,
    activeCount: activeSyncCount,
  });

  const count = useMemo(() => {
    const stuck = getStuckRenderingAttentionFromInProgress(
      inProgressRenders ?? []
    ).length;
    const sync =
      policyRuns.length + (hiddenActiveCount > 0 ? hiddenActiveCount : 0);
    return stuck + sync;
  }, [hiddenActiveCount, inProgressRenders, policyRuns.length]);

  if (count === 0) return null;

  return (
    <Badge
      variant="outline"
      className="ml-1.5 border-amber-300 bg-amber-50 px-1.5 py-0 text-[10px] font-semibold"
    >
      {count}
    </Badge>
  );
}
