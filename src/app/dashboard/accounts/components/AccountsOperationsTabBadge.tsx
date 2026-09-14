"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { getStuckRenderingAttention } from "@/lib/scheduler/renderAttention";

export function AccountsOperationsTabBadge() {
  const { data: healthGlobal } = useAccountHealthGlobalStatus();
  const { data: todaysRenders } = useGetTodaysRenders();
  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const { policyRuns, hiddenActiveCount } = useDataRefreshAttentionState(
    healthGlobal?.data?.latestRuns,
    activeSyncCount
  );

  const count = useMemo(() => {
    const stuck = getStuckRenderingAttention(todaysRenders ?? []).length;
    const sync =
      policyRuns.length + (hiddenActiveCount > 0 ? hiddenActiveCount : 0);
    return stuck + sync;
  }, [hiddenActiveCount, policyRuns.length, todaysRenders]);

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
