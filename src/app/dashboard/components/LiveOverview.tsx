"use client";

import { useMemo } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import { TodaysRenders } from "@/types/scheduler";
import { OverviewDataWorkspace } from "./live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "./live-snapshot/OverviewRecordPanel";
import { RecentScrapeJobsTable } from "./live-snapshot/RecentScrapeJobsTable";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { getDataRefreshAttentionRuns } from "@/lib/account-health/globalRunAnalytics";
import { DataRefreshAttentionPanel } from "./account-health/DataRefreshAttentionPanel";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import { DashboardLinkButton } from "./live-snapshot/DashboardLinkButton";
import { StuckRenderingAttentionList } from "./live-snapshot/StuckRenderingAttentionList";
import { getStuckRenderingAttention } from "@/lib/scheduler/renderAttention";
import type { WorkspaceMetricTile } from "./live-snapshot/OverviewDataWorkspace";
import { cn } from "@/lib/utils";

const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";

function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.isRendering).length || 0;
}

function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.queued).length || 0;
}

function getCompletedTodayCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.render?.complete).length || 0;
}

function getScheduledTodayCount(data: TodaysRenders[]) {
  return data?.length || 0;
}

/**
 * Dashboard overview — alerts, today's ops, and recent scrapes.
 */
export default function LiveOverview() {
  const {
    data: todaysRenders,
    isLoading: rendersLoading,
    isError: rendersError,
    isFetching: rendersFetching,
    error: rendersQueryError,
    refetch: refetchRenders,
  } = useGetTodaysRenders({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: scrapeJobs,
    isLoading: scrapeLoading,
    error: scrapeError,
    refetch: refetchScrape,
    isFetching: scrapeFetching,
  } = useScraperLogs({
    page: 1,
    pageSize: 5,
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });

  const {
    data: healthGlobal,
    isLoading: healthLoading,
    isError: healthError,
    error: healthQueryError,
    refetch: refetchHealth,
    isFetching: healthFetching,
  } = useAccountHealthGlobalStatus();

  const attentionRuns = useMemo(
    () => getDataRefreshAttentionRuns(healthGlobal?.data?.latestRuns ?? []),
    [healthGlobal?.data?.latestRuns]
  );

  const stuckRenderingItems = useMemo(
    () => getStuckRenderingAttention(todaysRenders ?? []),
    [todaysRenders]
  );

  const stuckRenderingCount = stuckRenderingItems.length;

  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const errorSyncCount = attentionRuns.filter(
    (run) => run.severity === "error"
  ).length;
  const issueSyncCount = attentionRuns.filter(
    (run) => run.severity === "issue"
  ).length;

  const isRefreshing =
    (rendersFetching && !rendersLoading) ||
    (scrapeFetching && !scrapeLoading) ||
    (healthFetching && !healthLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const operationsMetrics = useMemo((): WorkspaceMetricTile[] => {
    const scheduledToday = getScheduledTodayCount(todaysRenders ?? []);
    const completedToday = getCompletedTodayCount(todaysRenders ?? []);

    return [
      {
        id: "rendering",
        label: "Rendering",
        value: rendersError
          ? UNAVAILABLE
          : String(getRenderingCount(todaysRenders ?? [])),
        meta: rendersError
          ? UNAVAILABLE_META
          : stuckRenderingCount > 0
            ? `${stuckRenderingCount} stuck · active today`
            : "Active today",
        isLoading: rendersLoading,
      },
      {
        id: "queued",
        label: "Queued",
        value: rendersError
          ? UNAVAILABLE
          : String(getQueuedCount(todaysRenders ?? [])),
        meta: rendersError ? UNAVAILABLE_META : "Waiting today",
        isLoading: rendersLoading,
      },
      {
        id: "completed",
        label: "Completed",
        value: rendersError ? UNAVAILABLE : String(completedToday),
        meta: rendersError
          ? UNAVAILABLE_META
          : `${scheduledToday} scheduled today`,
        isLoading: rendersLoading,
      },
      {
        id: "data-sync",
        label: "Data sync",
        value: healthError ? UNAVAILABLE : String(activeSyncCount),
        meta: healthError
          ? UNAVAILABLE_META
          : errorSyncCount > 0
            ? `${errorSyncCount} error · ${issueSyncCount} issue`
            : issueSyncCount > 0
              ? `${issueSyncCount} issue`
              : attentionRuns.length > 0
                ? `${attentionRuns.length} in attention list`
                : "All clear",
        isLoading: healthLoading,
      },
    ];
  }, [
    activeSyncCount,
    attentionRuns.length,
    errorSyncCount,
    healthError,
    healthLoading,
    issueSyncCount,
    rendersError,
    rendersLoading,
    stuckRenderingCount,
    todaysRenders,
  ]);

  const initialLoad = rendersLoading && scrapeLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading overview…"
        className="py-6"
      />
    );
  }

  const showStuckRenderingSection =
    rendersLoading || rendersError || stuckRenderingItems.length > 0;

  const showAttentionSection =
    healthLoading || healthError || attentionRuns.length > 0;

  const attentionSummaryParts = [
    errorSyncCount > 0 ? `${errorSyncCount} error` : null,
    issueSyncCount > 0 ? `${issueSyncCount} issue` : null,
  ].filter(Boolean);

  const overviewPanelCount =
    1 +
    (showStuckRenderingSection ? 1 : 0) +
    (showAttentionSection ? 1 : 0);

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Today's operations"
        description="Render queue and data sync across the fleet"
        icon={PlayCircle}
        badge={<Badge variant="secondary">Live</Badge>}
        metrics={operationsMetrics}
        columns={4}
        action={
          <DashboardLinkButton
            href="/dashboard?tab=renders"
            trailingIcon="external"
          >
            Asset Creation
          </DashboardLinkButton>
        }
        footer={
          <>
            <span className="text-muted-foreground">
              Refreshes every 2 minutes
            </span>
            <DashboardLinkButton
              href="/dashboard/renders"
              intent="highlight"
              trailingIcon="arrow"
            >
              Open render workspace
            </DashboardLinkButton>
          </>
        }
      />

      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          overviewPanelCount >= 3 && "xl:grid-cols-3",
          overviewPanelCount === 2 && "xl:grid-cols-2",
          overviewPanelCount === 1 && "max-w-xl"
        )}
      >
        {showStuckRenderingSection ? (
          <OverviewRecordPanel
            title="Stuck rendering"
            description="Accounts processing or rendering longer than 30 minutes today"
            badge={
              stuckRenderingItems.length > 0 ? (
                <Badge variant="outline" className="border-amber-300 bg-amber-50">
                  {stuckRenderingItems.length} account
                  {stuckRenderingItems.length === 1 ? "" : "s"}
                </Badge>
              ) : null
            }
            action={
              <DashboardLinkButton
                href="/dashboard?tab=renders"
                trailingIcon="external"
              >
                Asset Creation
              </DashboardLinkButton>
            }
          >
            <StuckRenderingAttentionList
              items={stuckRenderingItems}
              isLoading={rendersLoading}
              error={
                rendersError
                  ? rendersQueryError instanceof Error
                    ? rendersQueryError
                    : new Error(String(rendersQueryError))
                  : null
              }
              onRetry={() => refetchRenders()}
            />
          </OverviewRecordPanel>
        ) : null}

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
                href="/dashboard?tab=collection"
                trailingIcon="external"
              >
                Data Collection
              </DashboardLinkButton>
            }
          >
            <DataRefreshAttentionPanel
              runs={attentionRuns}
              activeCount={activeSyncCount}
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

        <OverviewRecordPanel
          title="Recent scrapes"
          description="Latest data collection jobs"
          action={
            <DashboardLinkButton href="/dashboard/data">View all</DashboardLinkButton>
          }
          footer={
            scrapeJobs && scrapeJobs.length > 0 ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {scrapeJobs.length} job{scrapeJobs.length === 1 ? "" : "s"}{" "}
                  shown
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
