"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import { useDownloadQualityQueue } from "@/hooks/downloads/useDownloadQualityQueue";
import type { DownloadQcWindowPreset } from "@/lib/downloads/downloadQualityControlParams";
import { DownloadQualityQueueTable } from "./DownloadQualityQueueTable";
import { isDownloadQualityQueueUnavailable } from "@/types/downloadQualityControl";

const WINDOW_PRESETS: Array<{ value: DownloadQcWindowPreset; label: string }> =
  [
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7d", label: "7d" },
    { value: "14d", label: "14d" },
    { value: "21d", label: "21d" },
  ];

const PANEL_TITLE = "Download attention queue";

const PANEL_DESCRIPTION =
  "Failed and in-progress download outputs (Creator hasError / errorHandler). For all statuses, use Downloads. Render integrity and pipeline failures use separate views.";

export function DownloadQualityControlWorkspace() {
  const [windowPreset, setWindowPreset] = useState<DownloadQcWindowPreset>("7d");
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data, isLoading, isError, error, refetch, isFetching } =
    useDownloadQualityQueue({ windowPreset, page, pageSize });

  const meta = data?.meta;
  const rows = data?.data ?? [];
  const queueUnavailable = isDownloadQualityQueueUnavailable(meta);
  const pageCount = meta?.pageCount ?? 0;
  const total = meta?.total ?? 0;
  const returned = meta?.returned ?? rows.length;
  const canPrev = page > 1;
  const canNext = pageCount > 0 && page < pageCount;

  const handleWindowChange = (preset: DownloadQcWindowPreset) => {
    setWindowPreset(preset);
    setPage(1);
  };

  if (isLoading) {
    return (
      <OverviewRecordPanel title={PANEL_TITLE} description={PANEL_DESCRIPTION}>
        <LoadingState variant="default" message="Loading download attention…" />
      </OverviewRecordPanel>
    );
  }

  if (isError && error) {
    const message =
      error instanceof Error ? error.message : String(error);

    return (
      <OverviewRecordPanel title={PANEL_TITLE} description={PANEL_DESCRIPTION}>
        <ErrorState
          error={error instanceof Error ? error : new Error(message)}
          title="Could not load download attention queue"
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

  if (queueUnavailable) {
    return (
      <OverviewRecordPanel title={PANEL_TITLE} description={PANEL_DESCRIPTION}>
        <EmptyState
          variant="card"
          title="Fleet queue not connected yet"
          description="CMS must deploy GET /downloads/admin/quality-queue. Until then, open a render → Downloads tab for per-render attention filters and force rerender."
          action={
            <Button variant="primary" size="sm" asChild>
              <Link href="/dashboard/renders">
                Open renders workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
      </OverviewRecordPanel>
    );
  }

  return (
    <OverviewRecordPanel
      title={PANEL_TITLE}
      description={PANEL_DESCRIPTION}
      badge={
        total > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {total} need attention
          </span>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-2 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
          <LabeledSegmentedControl
            label="Window (updatedAt)"
            value={windowPreset}
            onValueChange={(value) =>
              handleWindowChange(value as DownloadQcWindowPreset)
            }
            options={[...WINDOW_PRESETS]}
            className="shrink-0"
            shellClassName="h-auto shrink-0 rounded-full"
          />
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
              <Link href="/dashboard/renders/downloads">
                All download status
              </Link>
            </Button>
          </div>
        </div>

        <p className="text-sm text-muted-foreground tabular-nums">
          Page {page}
          {pageCount > 0 ? ` of ${pageCount}` : ""}
          {total > 0 ? ` · ${returned} on page · ${total} need attention` : ""}
          · Times in Australia/Sydney
        </p>

        {rows.length === 0 ? (
          <EmptyState
            variant="card"
            title="No downloads need attention in this window"
            description="Try a wider time range, or open Downloads for the full status timeline."
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/renders/downloads">
                  Open Downloads
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <DownloadQualityQueueTable rows={rows} />
          </div>
        )}
      </div>
    </OverviewRecordPanel>
  );
}
