"use client";

import { useMemo, useState } from "react";
import { Activity, Database, ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import {
  filterRunsByOutlier,
  getDataRefreshAttentionRuns,
  getOutlierCounts,
  partitionOutliers,
  runsByDay,
  type OutlierFilter,
} from "@/lib/account-health/globalRunAnalytics";
import { OverviewDataWorkspace } from "./live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "./live-snapshot/OverviewRecordPanel";
import type { WorkspaceMetricTile } from "./live-snapshot/OverviewDataWorkspace";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import { DashboardLinkButton } from "./live-snapshot/DashboardLinkButton";
import { RecentScrapeJobsTable } from "./live-snapshot/RecentScrapeJobsTable";
import { DataRefreshAttentionPanel } from "./account-health/DataRefreshAttentionPanel";
import DataRefreshOutcomesByDayChart from "./account-health/DataRefreshOutcomesByDayChart";
import { DataRefreshOutlierTabs } from "./data-collection/DataRefreshOutlierTabs";
import { DataRefreshRunsCompactList } from "./data-collection/DataRefreshRunsCompactList";
import { cn } from "@/lib/utils";

const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";

function formatScraperDurationMs(ms: number | null | undefined): string {
  if (ms == null || ms < 0) return UNAVAILABLE;
  if (ms < 1000) return `${ms}ms`;

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`);

  return parts.join(" ");
}

/**
 * Dashboard Data Collection tab — fleet refresh pulse, scraper activity, and run lists.
 */
export default function DashboardDataCollection() {
  const [outlierFilter, setOutlierFilter] = useState<OutlierFilter>("all");

  const {
    data: healthGlobal,
    isLoading: healthLoading,
    isError: healthError,
    error: healthQueryError,
    refetch: refetchHealth,
    isFetching: healthFetching,
  } = useAccountHealthGlobalStatus();

  const {
    data: scrapeJobs,
    meta: scraperMeta,
    isLoading: scrapeLoading,
    error: scrapeError,
    refetch: refetchScrape,
    isFetching: scrapeFetching,
  } = useScraperLogs({
    page: 1,
    pageSize: 8,
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });

  const latestRuns = useMemo(
    () => healthGlobal?.data?.latestRuns ?? [],
    [healthGlobal?.data?.latestRuns]
  );

  const partitioned = useMemo(
    () => partitionOutliers(latestRuns),
    [latestRuns]
  );

  const outlierCounts = useMemo(
    () => getOutlierCounts(partitioned),
    [partitioned]
  );

  const filteredRuns = useMemo(
    () => filterRunsByOutlier(latestRuns, outlierFilter, partitioned),
    [latestRuns, outlierFilter, partitioned]
  );

  const chartData = useMemo(() => runsByDay(latestRuns), [latestRuns]);

  const attentionRuns = useMemo(
    () => getDataRefreshAttentionRuns(latestRuns),
    [latestRuns]
  );

  const activeCount = healthGlobal?.data?.activeCount ?? 0;
  const failedCount = healthGlobal?.data?.failedCount ?? 0;
  const completedEmptyCount = healthGlobal?.data?.completedEmptyCount ?? 0;

  const errorSyncCount = attentionRuns.filter(
    (run) => run.severity === "error"
  ).length;
  const issueSyncCount = attentionRuns.filter(
    (run) => run.severity === "issue"
  ).length;

  const scraperByStatus = scraperMeta?.summary.byStatus;
  const scraperInProgress = scraperByStatus?.in_progress ?? 0;
  const scraperRetry = scraperByStatus?.retry_later ?? 0;
  const scraperCompleted = scraperByStatus?.completed ?? 0;

  const isRefreshing =
    (healthFetching && !healthLoading) ||
    (scrapeFetching && !scrapeLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const workspaceMetrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "active-refresh",
        label: "Active refresh runs",
        value: healthError ? UNAVAILABLE : String(activeCount),
        meta: healthError
          ? UNAVAILABLE_META
          : "Season data sync in progress",
        isLoading: healthLoading,
      },
      {
        id: "failed-refresh",
        label: "Failed runs",
        value: healthError ? UNAVAILABLE : String(failedCount),
        meta: healthError
          ? UNAVAILABLE_META
          : "In the 20-run recent window",
        isLoading: healthLoading,
      },
      {
        id: "empty-season",
        label: "Empty season",
        value: healthError ? UNAVAILABLE : String(completedEmptyCount),
        meta: healthError
          ? UNAVAILABLE_META
          : "Completed with no season data",
        isLoading: healthLoading,
      },
      {
        id: "attention",
        label: "Needs attention",
        value: healthError ? UNAVAILABLE : String(attentionRuns.length),
        meta: healthError
          ? UNAVAILABLE_META
          : errorSyncCount > 0
            ? `${errorSyncCount} error · ${issueSyncCount} issue`
            : issueSyncCount > 0
              ? `${issueSyncCount} issue`
              : attentionRuns.length > 0
                ? "Active, stuck, or unreconciled"
                : "All clear",
        isLoading: healthLoading,
      },
      {
        id: "scraper-pipeline",
        label: "Scraper pipeline",
        value: scrapeError
          ? UNAVAILABLE
          : scraperInProgress > 0
            ? "Running"
            : "Idle",
        meta: scrapeError
          ? UNAVAILABLE_META
          : `${scraperInProgress} active · ${scraperRetry} retry`,
        isLoading: scrapeLoading,
      },
      {
        id: "scraper-jobs",
        label: "Scraper jobs",
        value: scrapeError
          ? UNAVAILABLE
          : String(scraperMeta?.summary.totalJobs ?? 0),
        meta: scrapeError
          ? UNAVAILABLE_META
          : `${scraperCompleted} completed · avg ${formatScraperDurationMs(scraperMeta?.summary.avgDurationMs)}`,
        isLoading: scrapeLoading,
      },
    ];
  }, [
    activeCount,
    attentionRuns.length,
    completedEmptyCount,
    errorSyncCount,
    failedCount,
    healthError,
    healthLoading,
    issueSyncCount,
    scrapeError,
    scrapeLoading,
    scraperCompleted,
    scraperInProgress,
    scraperMeta?.summary.avgDurationMs,
    scraperMeta?.summary.totalJobs,
    scraperRetry,
  ]);

  const initialLoad = healthLoading && scrapeLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading data collection…"
        className="py-6"
      />
    );
  }

  const attentionSummaryParts = [
    errorSyncCount > 0 ? `${errorSyncCount} error` : null,
    issueSyncCount > 0 ? `${issueSyncCount} issue` : null,
  ].filter(Boolean);

  const showAttentionSection =
    healthLoading || healthError || attentionRuns.length > 0;

  return (
    <div className="space-y-6">
      {healthError ? (
        <ErrorState
          variant="default"
          title="Could not load data refresh status"
          error={
            healthQueryError instanceof Error
              ? healthQueryError
              : new Error(String(healthQueryError))
          }
          onRetry={() => refetchHealth()}
        />
      ) : (
        <OverviewDataWorkspace
          title="Data collection — fleet"
          description="Season data refresh and scraper pipeline across all accounts"
          icon={Database}
          badge={<Badge variant="secondary">Live</Badge>}
          metrics={workspaceMetrics}
          columns={3}
          action={
            <DashboardLinkButton href="/dashboard/data" icon={ListTodo}>
              Data route
            </DashboardLinkButton>
          }
          footer={
            <>
              <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5" />
                  20 most recent refresh runs
                </span>
                <span className="inline-flex items-center gap-1">
                  <Database className="h-3.5 w-3.5" />
                  Scraper log window
                </span>
              </span>
              <DashboardLinkButton
                href="/dashboard/data"
                intent="highlight"
                trailingIcon="arrow"
              >
                Open data workspace
              </DashboardLinkButton>
            </>
          }
        />
      )}

      {(showAttentionSection || chartData.length >= 1) ? (
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            showAttentionSection &&
              chartData.length >= 1 &&
              "xl:grid-cols-2"
          )}
        >
          {showAttentionSection ? (
            <OverviewRecordPanel
              title="Needs attention"
              description="Account sync runs that are active, stuck, or waiting to finalize"
              badge={
                attentionRuns.length > 0 ? (
                  <Badge variant="outline">
                    {attentionRuns.length} run
                    {attentionRuns.length === 1 ? "" : "s"}
                    {attentionSummaryParts.length > 0
                      ? ` · ${attentionSummaryParts.join(" · ")}`
                      : ""}
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton
                  href="/dashboard/notifications/issues"
                  trailingIcon="external"
                >
                  Notification issues
                </DashboardLinkButton>
              }
            >
              <DataRefreshAttentionPanel
                runs={attentionRuns}
                activeCount={activeCount}
                isLoading={healthLoading}
                error={
                  healthError
                    ? healthQueryError instanceof Error
                      ? healthQueryError
                      : new Error(String(healthQueryError))
                    : null
                }
                onRetry={() => refetchHealth()}
                embedded
                layout="rows"
              />
            </OverviewRecordPanel>
          ) : null}

          {chartData.length >= 1 ? (
            <OverviewRecordPanel
              title="Refresh outcomes by day"
              description="From the latest refresh runs in this window (not full history)"
            >
              <DataRefreshOutcomesByDayChart data={chartData} embedded />
            </OverviewRecordPanel>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OverviewRecordPanel
          title="Latest refresh runs"
          description="Recent season data refresh activity — use filters to spot outliers"
          badge={
            filteredRuns.length > 0 ? (
              <Badge variant="outline">
                {filteredRuns.length} shown
              </Badge>
            ) : null
          }
        >
          <DataRefreshOutlierTabs
            value={outlierFilter}
            onValueChange={setOutlierFilter}
            counts={outlierCounts}
          />
          {healthLoading ? (
            <LoadingState variant="minimal" message="Loading runs…" />
          ) : (
            <DataRefreshRunsCompactList runs={filteredRuns} limit={10} />
          )}
        </OverviewRecordPanel>

        <OverviewRecordPanel
          title="Recent scrapes"
          description="Latest data collection jobs from the scraper log"
          action={
            <DashboardLinkButton href="/dashboard/data">View all</DashboardLinkButton>
          }
          footer={
            scrapeJobs && scrapeJobs.length > 0 ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Showing {scrapeJobs.length} job
                  {scrapeJobs.length === 1 ? "" : "s"}
                </span>
                <DashboardLinkButton
                  href="/dashboard/data"
                  intent="highlight"
                  trailingIcon="arrow"
                >
                  Open data route
                </DashboardLinkButton>
              </>
            ) : undefined
          }
        >
          <RecentScrapeJobsTable
            jobs={scrapeJobs}
            isLoading={scrapeLoading}
            error={scrapeError}
            onRetry={() => refetchScrape()}
            embedded
          />
        </OverviewRecordPanel>
      </div>
    </div>
  );
}
