"use client";

import {
  Activity,
  CalendarCheck2,
  CalendarClock,
  XCircle,
} from "lucide-react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";
import { splitHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import {
  accountHealthStatusLabel,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import TriggerAccountHealthRunButton from "./TriggerAccountHealthRunButton";
import AbortAccountHealthRunButton from "./AbortAccountHealthRunButton";

interface AccountHealthPanelProps {
  accountId: number;
}

const METRIC_ICON_CLASS = "bg-slate-100 text-slate-600";

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
  );
}

function timestampMetric(
  id: string,
  label: string,
  iso: string | null,
  icon: LiveSnapshotMetricItem["icon"],
): LiveSnapshotMetricItem {
  const parts = splitHealthTimestamp(iso);

  return {
    id,
    label,
    value: parts?.time ?? "—",
    meta: parts?.date ?? "Not recorded",
    icon,
    iconClassName: METRIC_ICON_CLASS,
  };
}

export default function AccountHealthPanel({
  accountId,
}: AccountHealthPanelProps) {
  const { data, isLoading, error, isError, refetch } =
    useAccountHealthAccountStatus(accountId);

  if (isLoading) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <LoadingState variant="default" message="Loading data refresh…" />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load data refresh"
          variant="card"
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-sm text-primary underline"
        >
          Retry
        </button>
      </SectionContainer>
    );
  }

  if (!data?.data) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <p className="text-sm text-muted-foreground">No data available.</p>
      </SectionContainer>
    );
  }

  const { account, latestRun } = data.data;
  const liveRun = latestRun != null && isHealthRunActive(latestRun.status);
  const showAbort = liveRun && latestRun != null;

  const statusMetrics: LiveSnapshotMetricItem[] = [
    {
      id: "status",
      label: "Account status",
      value: accountHealthStatusLabel(account.accountHealthStatus),
      meta: liveRun ? "Refresh in progress" : "Season data refresh",
      icon: Activity,
      iconClassName: METRIC_ICON_CLASS,
    },
    timestampMetric(
      "queued",
      "Last queued",
      account.accountHealthLastQueuedAt,
      CalendarClock,
    ),
    timestampMetric(
      "started",
      "Last started",
      account.accountHealthLastStartedAt,
      Activity,
    ),
    timestampMetric(
      "completed",
      "Last completed",
      account.accountHealthLastCompletedAt,
      CalendarCheck2,
    ),
    timestampMetric(
      "failed",
      "Last failed",
      account.accountHealthLastFailedAt,
      XCircle,
    ),
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-slate-900">
            Data refresh
          </h2>
          <p className="text-sm text-muted-foreground">
            Season data refresh status and recent runs
          </p>
        </div>
        <div className={siteNavigationGroupShellClass}>
          {showAbort && latestRun && (
            <AbortAccountHealthRunButton
              runId={latestRun.id}
              accountId={account.id}
              grouped
              className={groupedItemClass(true)}
            />
          )}
          <TriggerAccountHealthRunButton
            accountId={account.id}
            liveRun={Boolean(liveRun)}
            activeRunId={latestRun?.id}
            grouped
            triggerClassName={groupedItemClass(false)}
          />
        </div>
      </div>

      <LiveSnapshotMetricStrip items={statusMetrics} columns={5} />
    </div>
  );
}
