"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  CalendarDays,
  Clapperboard,
  Clock,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useAccountAssetRunRenderActivity } from "@/hooks/account-asset-run/useAccountAssetRunRenderActivity";
import {
  buildRenderActivityWindow,
  renderActivityStatusParam,
  type RenderActivityStatusFilter,
  type RenderActivityWindowPreset,
} from "@/lib/account-asset-run/renderActivityParams";
import type { AccountAssetRunRenderActivityParams } from "@/types/accountAssetRun";
import type { TodaysRenders } from "@/types/scheduler";
import { OverviewDataWorkspace } from "./live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "./live-snapshot/OverviewRecordPanel";
import type { WorkspaceMetricTile } from "./live-snapshot/OverviewDataWorkspace";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import { DashboardLinkButton } from "./live-snapshot/DashboardLinkButton";
import { RenderActivityCharts } from "./account-asset-run/RenderActivityCharts";
import { RenderActivityCompactList } from "./asset-creation/RenderActivityCompactList";
import { AssetRunStatusChart } from "./asset-creation/AssetRunStatusChart";

const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";

const WINDOW_OPTIONS: Array<{ value: RenderActivityWindowPreset; label: string }> =
  [
    { value: "7d", label: "7 days" },
    { value: "60d", label: "60 days" },
    { value: "90d", label: "90 days" },
  ];

const STATUS_OPTIONS: Array<{ value: RenderActivityStatusFilter; label: string }> =
  [
    { value: "all", label: "All" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

function getRenderingCount(data: TodaysRenders[] | undefined): number {
  return data?.filter((item) => item.isRendering).length ?? 0;
}

function getQueuedCount(data: TodaysRenders[] | undefined): number {
  return data?.filter((item) => item.queued).length ?? 0;
}

function getCompletedCount(data: TodaysRenders[] | undefined): number {
  return data?.filter((item) => item.render?.complete).length ?? 0;
}

/**
 * Dashboard Asset Creation tab — pipeline workspace, charts, and compact run lists.
 */
export default function DashboardAssetCreation() {
  const [windowPreset, setWindowPreset] =
    useState<RenderActivityWindowPreset>("7d");
  const [statusFilter, setStatusFilter] =
    useState<RenderActivityStatusFilter>("all");

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayOfWeekName = today.toLocaleDateString("en-US", { weekday: "long" });
  const tomorrowDayName = tomorrow.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const {
    data: rollup,
    isLoading: rollupLoading,
    isError: rollupError,
    isFetching: rollupFetching,
    refetch: refetchRollup,
    error: rollupQueryError,
  } = useSchedulerRollup({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: todaysRenders,
    isLoading: rendersLoading,
    isError: rendersError,
    isFetching: rendersFetching,
  } = useGetTodaysRenders({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const activityParams = useMemo((): AccountAssetRunRenderActivityParams => {
    const window = buildRenderActivityWindow(windowPreset);
    const status = renderActivityStatusParam(statusFilter);

    return {
      from: window.from,
      to: window.to,
      page: 1,
      pageSize: 12,
      ...(status ? { status } : {}),
      includeItems: false,
    };
  }, [windowPreset, statusFilter]);

  const {
    data: activity,
    isLoading: activityLoading,
    isError: activityError,
    error: activityQueryError,
    isFetching: activityFetching,
    refetch: refetchActivity,
  } = useAccountAssetRunRenderActivity(activityParams);

  const isRefreshing =
    (rollupFetching && !rollupLoading) ||
    (rendersFetching && !rendersLoading) ||
    (activityFetching && !activityLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const workspaceMetrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "expected-today",
        label: "Expected today",
        value: rollupError
          ? UNAVAILABLE
          : String(rollup?.DaysOfTheWeekGroupedByCount[dayOfWeekName] ?? 0),
        meta: rollupError ? UNAVAILABLE_META : dayOfWeekName,
        isLoading: rollupLoading,
      },
      {
        id: "expected-tomorrow",
        label: "Expected tomorrow",
        value: rollupError
          ? UNAVAILABLE
          : String(rollup?.DaysOfTheWeekGroupedByCount[tomorrowDayName] ?? 0),
        meta: rollupError ? UNAVAILABLE_META : tomorrowDayName,
        isLoading: rollupLoading,
      },
      {
        id: "rendering",
        label: "Rendering",
        value: rendersError
          ? UNAVAILABLE
          : String(getRenderingCount(todaysRenders)),
        meta: rendersError ? UNAVAILABLE_META : "Active today",
        isLoading: rendersLoading,
      },
      {
        id: "queued",
        label: "Queued",
        value: rendersError ? UNAVAILABLE : String(getQueuedCount(todaysRenders)),
        meta: rendersError ? UNAVAILABLE_META : "Waiting today",
        isLoading: rendersLoading,
      },
      {
        id: "completed",
        label: "Completed",
        value: rendersError
          ? UNAVAILABLE
          : String(getCompletedCount(todaysRenders)),
        meta: rendersError
          ? UNAVAILABLE_META
          : `${todaysRenders?.length ?? 0} scheduled today`,
        isLoading: rendersLoading,
      },
      {
        id: "schedulers-active",
        label: "Schedulers active",
        value: rollupError
          ? UNAVAILABLE
          : String(rollup?.numberOfSchedulersRendering ?? 0),
        meta: rollupError
          ? UNAVAILABLE_META
          : `${rollup?.numberOfSchedulersQueued ?? 0} queued`,
        isLoading: rollupLoading,
      },
    ];
  }, [
    dayOfWeekName,
    rendersError,
    rendersLoading,
    rollup?.DaysOfTheWeekGroupedByCount,
    rollup?.numberOfSchedulersQueued,
    rollup?.numberOfSchedulersRendering,
    rollupError,
    rollupLoading,
    tomorrowDayName,
    todaysRenders,
  ]);

  const activityRows = activity?.data ?? [];
  const activityMeta = activity?.meta;
  const windowLabel =
    WINDOW_OPTIONS.find((option) => option.value === windowPreset)?.label ??
    windowPreset;

  const initialLoad = rollupLoading && rendersLoading && activityLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading asset creation…"
        className="py-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
        <LabeledSegmentedControl
          label="Window"
          value={windowPreset}
          onValueChange={(value) =>
            setWindowPreset(value as RenderActivityWindowPreset)
          }
          options={[...WINDOW_OPTIONS]}
        />

        <LabeledSegmentedControl
          label="Status"
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as RenderActivityStatusFilter)
          }
          options={[...STATUS_OPTIONS]}
        />
      </div>

      {rollupError ? (
        <ErrorState
          variant="default"
          title="Could not load scheduler rollup"
          error={
            rollupQueryError instanceof Error
              ? rollupQueryError
              : new Error(String(rollupQueryError))
          }
          onRetry={() => refetchRollup()}
        />
      ) : (
        <OverviewDataWorkspace
          title="Render pipeline"
          description="Expected renders, queue state, and today's completion progress"
          icon={PlayCircle}
          badge={<Badge variant="secondary">Live</Badge>}
          metrics={workspaceMetrics}
          columns={3}
          action={
            <DashboardLinkButton href="/dashboard/schedulers" trailingIcon="external">
              Schedulers
            </DashboardLinkButton>
          }
          footer={
            <>
              <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Today
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Tomorrow forecast
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Queue depth
                </span>
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
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OverviewRecordPanel
          title="Recent runs"
          description={`Asset runs in the last ${windowLabel.toLowerCase()}`}
          badge={
            activityMeta?.total ? (
              <Badge variant="outline">
                {activityMeta.totalIsEstimated ? "~" : ""}
                {activityMeta.total} total
              </Badge>
            ) : null
          }
          action={
            <DashboardLinkButton href="/dashboard/renders">View all</DashboardLinkButton>
          }
          footer={
            activityRows.length > 0 ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Showing {Math.min(activityRows.length, 8)} runs
                </span>
                <DashboardLinkButton
                  href="/dashboard/renders"
                  intent="highlight"
                  trailingIcon="arrow"
                >
                  Full activity
                </DashboardLinkButton>
              </>
            ) : undefined
          }
        >
          {activityLoading ? (
            <LoadingState variant="minimal" message="Loading runs…" />
          ) : activityError ? (
            <ErrorState
              variant="default"
              title="Could not load render activity"
              error={
                activityQueryError instanceof Error
                  ? activityQueryError
                  : new Error(String(activityQueryError))
              }
              onRetry={() => refetchActivity()}
            />
          ) : (
            <RenderActivityCompactList rows={activityRows} limit={8} />
          )}
        </OverviewRecordPanel>

        {!activityLoading && !activityError && activityRows.length > 0 ? (
          <AssetRunStatusChart rows={activityRows} />
        ) : (
          <OverviewRecordPanel
            title="Run status mix"
            description="Status distribution appears when runs are loaded"
          >
            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-muted-foreground">
              No runs to chart for this filter.
            </div>
          </OverviewRecordPanel>
        )}
      </div>

      {!activityLoading && !activityError && activityRows.length > 0 ? (
        <OverviewRecordPanel
          title="Timing analysis"
          description="Slowest runs, processing span, and overlap for the current view"
          action={
            <DashboardLinkButton href="/dashboard/renders" icon={Clapperboard}>
              Renders workspace
            </DashboardLinkButton>
          }
        >
          <RenderActivityCharts rows={activityRows} meta={activityMeta} />
        </OverviewRecordPanel>
      ) : null}
    </div>
  );
}
