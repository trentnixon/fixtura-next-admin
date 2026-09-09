"use client";

import { useMemo } from "react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
} from "@/lib/account-health/displayRules";
import { EmptyState } from "@/components/ui-library";
import { AccountHealthRunTimeline } from "./run-detail/AccountHealthRunTimeline";
import { AccountHealthRunBlockingCard } from "./run-detail/AccountHealthRunBlockingCard";
import { AccountHealthRunStepsTable } from "./run-detail/AccountHealthRunStepsTable";

interface DataRefreshLatestRunSectionProps {
  accountId: number;
}

export default function DataRefreshLatestRunSection({
  accountId,
}: DataRefreshLatestRunSectionProps) {
  const { data } = useAccountHealthAccountStatus(accountId);
  const { strapiLocation } = useGlobalContext();

  const latestRun = data?.data?.latestRun;

  const sortedItems = useMemo(() => {
    if (!latestRun?.items) return [];
    return [...latestRun.items].sort(
      (a, b) => a.stepIndex - b.stepIndex || a.id - b.id,
    );
  }, [latestRun?.items]);

  if (!latestRun) {
    return (
      <EmptyState
        title="No workflow to show"
        description="Queue a data refresh from Overview to start a run."
        variant="minimal"
      />
    );
  }

  const emptyMeta = getSummaryEmptyReason(latestRun.summary);

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">
          Workflow steps
        </h2>
        <p className="text-sm text-muted-foreground">
          Step-by-step detail for the current or most recent refresh run
        </p>
      </div>

      {latestRun.failureReason && (
        <div className="rounded-md border border-brandError-200 bg-brandError-50 px-4 py-3 text-sm text-brandError-900">
          <strong>Run failure:</strong> {latestRun.failureReason}
        </div>
      )}
      {emptyMeta.isEmptyResult && (
        <div className="rounded-md border border-brandInfo-200 bg-brandInfo-50 px-4 py-3 text-sm text-brandInfo-950">
          {EMPTY_RUN_RESULT_LABEL}
          {emptyMeta.reasonDisplay ? `: ${emptyMeta.reasonDisplay}` : ""}
        </div>
      )}

      <AccountHealthRunTimeline
        status={latestRun.status}
        startedAt={latestRun.startedAt}
        queuedAt={latestRun.queuedAt}
        completedAt={latestRun.completedAt}
        failedAt={latestRun.failedAt}
        finalizedAt={latestRun.finalizedAt}
      />

      {latestRun.blockingItem && (
        <AccountHealthRunBlockingCard
          item={latestRun.blockingItem}
          runFailed={latestRun.status === "failed"}
          itemStrapiBase={strapiLocation.accountHealthItem}
        />
      )}

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Steps</h3>
        <AccountHealthRunStepsTable
          items={sortedItems}
          runFailed={latestRun.status === "failed"}
          itemStrapiBase={strapiLocation.accountHealthItem}
        />
      </div>
    </div>
  );
}
