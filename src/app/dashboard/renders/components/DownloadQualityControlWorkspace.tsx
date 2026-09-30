"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/type/titles";
import { useDownloadQualityQueue } from "@/hooks/downloads/useDownloadQualityQueue";
import {
  filterQueueRowsByAssetType,
  uniqueAssetTypesFromQueueRows,
} from "@/lib/downloads/filterDownloadQueueByAssetType";
import type {
  DownloadQcQueueScope,
  DownloadQcWindowPreset,
} from "@/lib/downloads/downloadQualityControlParams";
import { DownloadQualityQueueTable } from "./DownloadQualityQueueTable";
import {
  isDownloadQualityQueueAllScopeUnsupported,
  isDownloadQualityQueueUnavailable,
} from "@/types/downloadQualityControl";

const WINDOW_PRESETS: Array<{ value: DownloadQcWindowPreset; label: string }> =
  [
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7d", label: "7d" },
    { value: "14d", label: "14d" },
    { value: "21d", label: "21d" },
  ];

const SCOPE_OPTIONS: Array<{ value: DownloadQcQueueScope; label: string }> = [
  { value: "needs_attention", label: "Needs attention" },
  { value: "all", label: "All downloads" },
];

const PANEL_TITLE = "Fleet download queue";

export function DownloadQualityControlWorkspace() {
  const [windowPreset, setWindowPreset] = useState<DownloadQcWindowPreset>("7d");
  const [scope, setScope] = useState<DownloadQcQueueScope>("needs_attention");
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(
    null,
  );
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const { data, isLoading, isError, error, refetch, isFetching } =
    useDownloadQualityQueue({ windowPreset, page, pageSize, scope });

  const meta = data?.meta;
  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const allScope = scope === "all";
  const assetTypeOptions = useMemo(
    () => (allScope ? uniqueAssetTypesFromQueueRows(rows) : []),
    [allScope, rows],
  );

  useEffect(() => {
    if (!allScope) {
      setSelectedAssetType(null);
      return;
    }
    if (assetTypeOptions.length === 0) {
      setSelectedAssetType(null);
      return;
    }
    const stillValid = assetTypeOptions.some((o) => o.key === selectedAssetType);
    if (!stillValid) {
      setSelectedAssetType(assetTypeOptions[0].key);
    }
  }, [allScope, assetTypeOptions, selectedAssetType]);

  const displayRows = useMemo(() => {
    if (!allScope || !selectedAssetType) {
      return rows;
    }
    return filterQueueRowsByAssetType(rows, selectedAssetType);
  }, [rows, allScope, selectedAssetType]);

  const queueUnavailable = isDownloadQualityQueueUnavailable(meta);
  const allScopeUnsupported = isDownloadQualityQueueAllScopeUnsupported(meta);
  const pageCount = meta?.pageCount ?? 0;
  const total = meta?.total ?? 0;
  const returned = meta?.returned ?? rows.length;
  const canPrev = page > 1;
  const canNext = pageCount > 0 && page < pageCount;

  const panelDescription = allScope
    ? "All download rows in the selected updatedAt window (including processed OK). Separate from render integrity and pipeline failures."
    : "Download output failures across renders (Creator hasError / errorHandler). Separate from render integrity and pipeline failures.";

  const handleWindowChange = (preset: DownloadQcWindowPreset) => {
    setWindowPreset(preset);
    setPage(1);
  };

  const handleScopeChange = (next: DownloadQcQueueScope) => {
    setScope(next);
    setPage(1);
  };

  if (isLoading) {
    return (
      <OverviewRecordPanel title={PANEL_TITLE} description={panelDescription}>
        <LoadingState variant="default" message="Loading download QC queue…" />
      </OverviewRecordPanel>
    );
  }

  if (isError && error) {
    const message =
      error instanceof Error ? error.message : String(error);

    return (
      <OverviewRecordPanel title={PANEL_TITLE} description={panelDescription}>
        <ErrorState
          error={error instanceof Error ? error : new Error(message)}
          title="Could not load download QC queue"
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
      <OverviewRecordPanel title={PANEL_TITLE} description={panelDescription}>
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

  const totalLabel = allScope ? "downloads" : "need attention";
  const selectedAssetLabel = assetTypeOptions.find(
    (o) => o.key === selectedAssetType,
  )?.label;

  return (
    <OverviewRecordPanel
      title={PANEL_TITLE}
      description={panelDescription}
      badge={
        total > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {total} {totalLabel}
          </span>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
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
            <LabeledSegmentedControl
              label="Scope"
              value={scope}
              onValueChange={(value) =>
                handleScopeChange(value as DownloadQcQueueScope)
              }
              options={[...SCOPE_OPTIONS]}
              className="shrink-0"
              shellClassName="h-auto shrink-0 rounded-full"
            />
            {allScope && assetTypeOptions.length > 0 ? (
              <div className="space-y-1">
                <Label>Asset type</Label>
                <Select
                  value={selectedAssetType ?? undefined}
                  onValueChange={setSelectedAssetType}
                >
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypeOptions.map((opt) => (
                      <SelectItem key={opt.key} value={opt.key}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
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
          </div>
        </div>

        <p className="text-sm text-muted-foreground tabular-nums">
          Page {page}
          {pageCount > 0 ? ` of ${pageCount}` : ""}
          {total > 0 ? ` · ${returned} on page · ${total} ${totalLabel}` : ""}
          {allScope && selectedAssetLabel
            ? ` · Showing ${selectedAssetLabel} (${displayRows.length})`
            : ""}
          · Times in Australia/Sydney
          {allScope && assetTypeOptions.length > 0
            ? " · Asset types from current page"
            : ""}
        </p>

        {allScopeUnsupported ? (
          <EmptyState
            variant="card"
            title="All downloads is not enabled on CMS yet"
            description="This Strapi build only accepts needsAttention=true or omitted. Ask CMS to allow needsAttention=false for every download in the updatedAt window (with attention ok / unknown on those rows)."
            action={
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleScopeChange("needs_attention")}
              >
                Back to needs attention
              </Button>
            }
          />
        ) : rows.length === 0 ? (
          <EmptyState
            variant="card"
            title={
              allScope
                ? "No downloads in this window"
                : "No downloads need attention in this window"
            }
            description="Try a wider time range or switch scope to all downloads."
          />
        ) : displayRows.length === 0 ? (
          <EmptyState
            variant="card"
            title="No rows for this asset type on this page"
            description="Try another asset type or change page."
          />
        ) : (
          <div className="overflow-x-auto">
            <DownloadQualityQueueTable rows={displayRows} />
          </div>
        )}
      </div>
    </OverviewRecordPanel>
  );
}
