"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import type { RenderActivityStatusFilter } from "@/lib/account-asset-run/renderActivityParams";
import type { RenderActivityWindowPreset } from "@/lib/account-asset-run/renderActivityParams";
import type { AccountAssetRunRenderActivityMeta } from "@/types/accountAssetRun";

const WINDOW_PRESETS: Array<{ value: RenderActivityWindowPreset; label: string }> =
  [
    { value: "24h", label: "24h" },
    { value: "48h", label: "48h" },
    { value: "7d", label: "7d" },
  ];

const STATUS_FILTERS: Array<{ value: RenderActivityStatusFilter; label: string }> =
  [
    { value: "all", label: "All" },
    { value: "running", label: "Running" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
  ];

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;

interface RenderActivityControlsProps {
  windowPreset: RenderActivityWindowPreset;
  onWindowPresetChange: (preset: RenderActivityWindowPreset) => void;
  statusFilter: RenderActivityStatusFilter;
  onStatusFilterChange: (filter: RenderActivityStatusFilter) => void;
  page: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  meta?: AccountAssetRunRenderActivityMeta;
  pageSizeOptions?: readonly number[];
}

export function RenderActivityControls({
  windowPreset,
  onWindowPresetChange,
  statusFilter,
  onStatusFilterChange,
  page,
  onPageChange,
  pageSize,
  onPageSizeChange,
  meta,
  pageSizeOptions = PAGE_SIZE_OPTIONS,
}: RenderActivityControlsProps) {
  const pageCount = meta?.pageCount ?? 0;
  const total = meta?.total ?? 0;
  const totalLabel = meta?.totalIsEstimated ? `~${total}` : String(total);
  const canPrev = page > 1;
  const canNext = pageCount > 0 && page < pageCount;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 lg:flex-row lg:flex-wrap lg:items-center">
        <LabeledSegmentedControl
          label="Window"
          value={windowPreset}
          onValueChange={(value) =>
            onWindowPresetChange(value as RenderActivityWindowPreset)
          }
          options={[...WINDOW_PRESETS]}
          className="shrink-0"
          shellClassName="h-auto shrink-0 rounded-full"
        />

        <LabeledSegmentedControl
          label="Status"
          value={statusFilter}
          onValueChange={(value) =>
            onStatusFilterChange(value as RenderActivityStatusFilter)
          }
          options={[...STATUS_FILTERS]}
          className="shrink-0"
          shellClassName="h-auto shrink-0 rounded-full"
        />

        <LabeledSegmentedControl
          label="Page size"
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
          options={pageSizeOptions.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          className="shrink-0"
          shellClassName="h-auto shrink-0 rounded-full"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm text-muted-foreground">
        <span className="tabular-nums">
          Page {page}
          {pageCount > 0 ? ` of ${pageCount}` : ""}
          {total > 0 ? ` · ${totalLabel} runs` : ""}
        </span>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canPrev}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!canNext}
            onClick={() => onPageChange(page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
