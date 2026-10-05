"use client";

import { useMemo } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useGetRendersForDateRange } from "@/hooks/scheduler/useGetRendersForDateRange";
import { useDownloadQualityQueue } from "@/hooks/downloads/useDownloadQualityQueue";
import { isDownloadQualityQueueUnavailable } from "@/types/downloadQualityControl";
import {
  dueRenderAttentionRows,
  dueRendersByDay,
  formatSydneyRangeLabel,
  lastSydneyDays,
  scoreDueRenders,
  sydneyCalendarDate,
} from "@/lib/scheduler/dueRenderAccuracy";
import { buildContentProductionSummary } from "@/lib/content-production/contentProductionSummary";
import type { TodaysRenders } from "@/types/scheduler";
import { OverviewDataWorkspace } from "../live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "../live-snapshot/OverviewRecordPanel";
import type { WorkspaceMetricTile } from "../live-snapshot/OverviewDataWorkspace";
import { LIVE_OVERVIEW_REFETCH_MS } from "../live-snapshot/liveOverviewConfig";
import { useLiveOverviewRefreshToast } from "../live-snapshot/useLiveOverviewRefreshToast";
import { DashboardLinkButton } from "../live-snapshot/DashboardLinkButton";
import { DueRenderAccuracyChart } from "./DueRenderAccuracyChart";
import { DueRenderAttentionList } from "./DueRenderAttentionList";

function renderingCount(rows: TodaysRenders[] | undefined): number {
  return rows?.filter((row) => row.isRendering).length ?? 0;
}

function queuedCount(rows: TodaysRenders[] | undefined): number {
  return rows?.filter((row) => row.queued).length ?? 0;
}

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

/**
 * Dashboard Content production tab — due-render accuracy, today's queue, download attention.
 */
export default function DashboardContentProduction() {
  const sydneyToday = sydneyCalendarDate(new Date());
  const range = lastSydneyDays(sydneyToday, 7);
  const rangeLabel = formatSydneyRangeLabel(range.from, range.to);

  const dueQuery = useGetRendersForDateRange(range, {
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });
  const rendersQuery = useGetTodaysRenders({
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });
  const downloadQuery = useDownloadQualityQueue({
    windowPreset: "7d",
    page: 1,
    pageSize: 1,
    scope: "needs_attention",
  });

  const breakdown = useMemo(() => {
    const nowMs = Date.now();
    const slots = dueQuery.data ?? [];
    return {
      score: scoreDueRenders(slots, nowMs),
      days: dueRendersByDay(slots, nowMs),
      attention: dueRenderAttentionRows(slots, nowMs),
    };
  }, [dueQuery.data]);

  const summary = buildContentProductionSummary({
    accuracy: dueQuery.isError || dueQuery.isLoading ? null : breakdown.score,
    renderingCount: rendersQuery.isError || rendersQuery.isLoading
      ? null
      : renderingCount(rendersQuery.data),
    queuedCount: rendersQuery.isError || rendersQuery.isLoading
      ? null
      : queuedCount(rendersQuery.data),
    downloadAttentionTotal:
      downloadQuery.isError ||
      downloadQuery.isLoading ||
      isDownloadQualityQueueUnavailable(downloadQuery.data?.meta)
        ? null
        : (downloadQuery.data?.meta.total ?? null),
    attentionCount: breakdown.attention.length,
  });

  const isRefreshing =
    (dueQuery.isFetching && !dueQuery.isLoading) ||
    (rendersQuery.isFetching && !rendersQuery.isLoading) ||
    (downloadQuery.isFetching && !downloadQuery.isLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const metrics: WorkspaceMetricTile[] = summary.tiles.map((tile) => {
    const isLoading =
      tile.id === "accuracy"
        ? dueQuery.isLoading
        : tile.id === "download-attention"
          ? downloadQuery.isLoading
          : rendersQuery.isLoading;

    return {
      ...tile,
      isLoading,
      meta: isLoading ? "" : tile.meta,
    };
  });

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title={summary.title}
        description={summary.description}
        icon={PlayCircle}
        badge={<Badge variant="secondary">Live</Badge>}
        metrics={metrics}
        columns={4}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {dueQuery.isLoading ? (
          <LoadingState variant="minimal" message="Loading accuracy…" />
        ) : dueQuery.isError ? (
          <ErrorState
            variant="default"
            title="Could not load due-render accuracy"
            error={asError(dueQuery.error)}
            onRetry={() => dueQuery.refetch()}
          />
        ) : (
          <DueRenderAccuracyChart
            days={breakdown.days}
            rangeLabel={rangeLabel}
            headerHref={summary.chartHeaderHref}
          />
        )}

        <OverviewRecordPanel
          title="Needs a look"
          description="Missed, failed, and still running in these 7 Sydney days"
          badge={
            dueQuery.isSuccess && summary.attentionCount > 0 ? (
              <Badge variant="outline">{summary.attentionCount}</Badge>
            ) : null
          }
          action={
            <DashboardLinkButton href={summary.needsALookHref} trailingIcon="external">
              Schedulers
            </DashboardLinkButton>
          }
        >
          {dueQuery.isLoading ? (
            <LoadingState variant="minimal" message="Loading due renders…" />
          ) : dueQuery.isError ? (
            <ErrorState
              variant="default"
              title="Could not load due renders"
              error={asError(dueQuery.error)}
              onRetry={() => dueQuery.refetch()}
            />
          ) : summary.emptyAttentionMessage ? (
            <p className="text-sm text-muted-foreground">
              {summary.emptyAttentionMessage}
            </p>
          ) : (
            <DueRenderAttentionList rows={breakdown.attention} />
          )}
        </OverviewRecordPanel>
      </div>
    </div>
  );
}
