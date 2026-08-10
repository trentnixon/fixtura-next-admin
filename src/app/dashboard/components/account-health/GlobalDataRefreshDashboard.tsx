"use client";

import { useMemo, useState } from "react";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  filterRunsByOutlier,
  getOutlierCounts,
  partitionOutliers,
  runsByDay,
  type OutlierFilter,
} from "@/lib/account-health/globalRunAnalytics";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertCircle, Database } from "lucide-react";
import DataRefreshOutlierChips from "./DataRefreshOutlierChips";
import DataRefreshOutcomesByDayChart from "./DataRefreshOutcomesByDayChart";
import DataRefreshRunsTable from "./DataRefreshRunsTable";

const summaryStats = [
  {
    key: "active" as const,
    label: "Active runs",
    icon: Activity,
    tone: "border-slate-200 bg-slate-50 text-slate-900",
  },
  {
    key: "failed" as const,
    label: "Failed runs",
    icon: AlertCircle,
    tone: "border-red-200 bg-red-50 text-red-900",
  },
  {
    key: "empty" as const,
    label: "Completed (no season data)",
    icon: Database,
    tone: "border-sky-200 bg-sky-50 text-sky-900",
  },
];

/**
 * Fleet-wide data refresh monitoring: pulse, outliers, short-window trends, latest runs.
 */
export default function GlobalDataRefreshDashboard() {
  const { data, isLoading, error, refetch, isError } =
    useAccountHealthGlobalStatus();
  const [filter, setFilter] = useState<OutlierFilter>("all");

  const partitioned = useMemo(
    () => partitionOutliers(data?.data?.latestRuns ?? []),
    [data?.data?.latestRuns]
  );

  const outlierCounts = useMemo(
    () => getOutlierCounts(partitioned),
    [partitioned]
  );

  const filteredRuns = useMemo(
    () =>
      filterRunsByOutlier(
        data?.data?.latestRuns ?? [],
        filter,
        partitioned
      ),
    [data?.data?.latestRuns, filter, partitioned]
  );

  const chartData = useMemo(
    () => runsByDay(data?.data?.latestRuns ?? []),
    [data?.data?.latestRuns]
  );

  if (isLoading) {
    return (
      <SectionContainer
        title="Data refresh — fleet"
        description="Season data refresh runs across all accounts"
        variant="compact"
      >
        <LoadingState variant="default" message="Loading data refresh status…" />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Data refresh — fleet"
        description="Season data refresh runs across all accounts"
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load data refresh"
          variant="default"
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
        title="Data refresh — fleet"
        description="Season data refresh runs across all accounts"
        variant="compact"
      >
        <p className="text-sm text-muted-foreground">No data available.</p>
      </SectionContainer>
    );
  }

  const { activeCount, failedCount, completedEmptyCount } = data.data;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Data refresh — fleet"
        description="Pulse, outliers, and recent refresh activity across accounts"
        variant="compact"
      >
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {summaryStats.map(({ key, label, icon: Icon, tone }) => {
            const value =
              key === "active"
                ? activeCount
                : key === "failed"
                  ? failedCount
                  : completedEmptyCount;

            return (
              <Card className={`border shadow-sm ${tone}`} key={key}>
                <CardContent className="flex items-center gap-3 p-3.5">
                  <div className="rounded-md bg-white/70 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium opacity-75">
                      {label}
                    </div>
                    <div className="truncate text-lg font-bold leading-tight tabular-nums">
                      {value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <p className="mb-4 text-xs text-muted-foreground">
          Based on the 20 most recent refresh runs system-wide. Use filters to
          spot failures, stuck jobs, and slow runs in this window.
        </p>

        <div className="mb-4">
          <DataRefreshOutlierChips
            filter={filter}
            onFilterChange={setFilter}
            counts={outlierCounts}
          />
        </div>

        {chartData.length >= 1 && (
          <div className="mb-6">
            <DataRefreshOutcomesByDayChart data={chartData} />
          </div>
        )}

        <h3 className="mb-2 text-sm font-semibold">Latest refresh runs</h3>
        <DataRefreshRunsTable runs={filteredRuns} />
      </SectionContainer>
    </div>
  );
}
