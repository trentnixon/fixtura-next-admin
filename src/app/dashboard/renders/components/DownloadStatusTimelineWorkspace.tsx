"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import { useDownloadStatusTimeline } from "@/hooks/downloads/useDownloadStatusTimeline";
import {
  countDownloadStatusOnPage,
  downloadStatusLabel,
  filterDownloadsOnPageByStatus,
  type DownloadStatusFilter,
} from "@/lib/downloads/downloadStatusTimeline";
import type { DownloadStatusTimelineWindowPreset } from "@/types/downloadStatusTimeline";
import { DownloadStatusTimelineTable } from "./DownloadStatusTimelineTable";

const WINDOW_PRESETS: Array<{
  value: DownloadStatusTimelineWindowPreset;
  label: string;
}> = [
  { value: "24h", label: "24h" },
  { value: "48h", label: "48h" },
  { value: "7d", label: "7d" },
];

const STATUS_FILTERS: Array<{
  value: DownloadStatusFilter;
  label: string;
}> = [
  { value: "all", label: "All" },
  { value: "failed", label: "Failed" },
  { value: "in_progress", label: "In progress" },
  { value: "ok", label: "Done" },
  { value: "unknown", label: "Unknown" },
];

const PANEL_TITLE = "Download status timeline";

export function DownloadStatusTimelineWorkspace() {
  const [windowPreset, setWindowPreset] =
    useState<DownloadStatusTimelineWindowPreset>("48h");
  const [statusFilter, setStatusFilter] =
    useState<DownloadStatusFilter>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, refetch, isFetching } =
    useDownloadStatusTimeline({ windowPreset, page });

  const pageRows = useMemo(() => data?.data ?? [], [data?.data]);
  const pageCounts = useMemo(
    () => countDownloadStatusOnPage(pageRows),
    [pageRows],
  );
  const displayRows = useMemo(
    () => filterDownloadsOnPageByStatus(pageRows, statusFilter),
    [pageRows, statusFilter],
  );
  const nowMs = useLiveRunClock(pageRows.length > 0);

  const pagination = data?.meta.pagination;
  const pageCount = pagination?.pageCount ?? 0;
  const windowTotal = pagination?.total ?? 0;
  const canPrev = page > 1;
  const canNext = pageCount > 0 && page < pageCount;

  const handleWindowChange = (preset: DownloadStatusTimelineWindowPreset) => {
    setWindowPreset(preset);
    setPage(1);
  };

  const handleStatusChange = (next: DownloadStatusFilter) => {
    setStatusFilter(next);
  };

  if (isLoading) {
    return (
      <OverviewRecordPanel title={PANEL_TITLE}>
        <LoadingState variant="default" message="Loading downloads…" />
      </OverviewRecordPanel>
    );
  }

  if (isError && error) {
    const message =
      error instanceof Error ? error.message : String(error);

    return (
      <OverviewRecordPanel title={PANEL_TITLE}>
        <ErrorState
          error={error instanceof Error ? error : new Error(message)}
          title="Could not load downloads"
          variant="default"
        />
        <Button
          type="button"
          onClick={() => refetch()}
          className="mt-2"
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </OverviewRecordPanel>
    );
  }

  return (
    <OverviewRecordPanel
      title={PANEL_TITLE}
      badge={
        windowTotal > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {windowTotal} updated in window
          </span>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
            <LabeledSegmentedControl
              label="Window (updatedAt)"
              value={windowPreset}
              onValueChange={(value) =>
                handleWindowChange(value as DownloadStatusTimelineWindowPreset)
              }
              options={[...WINDOW_PRESETS]}
              className="shrink-0"
              shellClassName="h-auto shrink-0 rounded-full"
            />
            <LabeledSegmentedControl
              label="Status (this page)"
              value={statusFilter}
              onValueChange={(value) =>
                handleStatusChange(value as DownloadStatusFilter)
              }
              options={[...STATUS_FILTERS]}
              className="shrink-0"
              shellClassName="h-auto shrink-0 rounded-full"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="shrink-0">
              <Link href="/dashboard/renders/download-quality-control">
                Download attention
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="font-medium text-slate-700">This page:</span>
          <span>{pageRows.length} rows</span>
          <span aria-hidden>·</span>
          <span>Failed {pageCounts.failed}</span>
          <span aria-hidden>·</span>
          <span>In progress {pageCounts.in_progress}</span>
          <span aria-hidden>·</span>
          <span>
            {downloadStatusLabel("ok")} {pageCounts.ok}
          </span>
          <span aria-hidden>·</span>
          <span>Unknown {pageCounts.unknown}</span>
        </div>

        <p className="text-sm text-muted-foreground tabular-nums">
          Page {page}
          {pageCount > 0 ? ` of ${pageCount}` : ""}
          {windowTotal > 0
            ? ` · ${pageRows.length} on this page · ${windowTotal} in window`
            : ""}
        </p>

        {pageRows.length === 0 ? (
          <EmptyState
            variant="card"
            title="No downloads in this window"
            description="Nothing was updated in the selected time range. Try a longer window."
          />
        ) : displayRows.length === 0 ? (
          <EmptyState
            variant="card"
            title="No rows match this status on this page"
            description="Change the status filter or use Next to see another page of downloads from the window."
            action={
              canNext ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next page
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : undefined
            }
          />
        ) : (
          <DownloadStatusTimelineTable rows={displayRows} nowMs={nowMs} />
        )}
      </div>
    </OverviewRecordPanel>
  );
}
