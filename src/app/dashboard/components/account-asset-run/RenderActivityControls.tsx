"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RenderActivityStatusFilter } from "@/lib/account-asset-run/renderActivityParams";
import type { RenderActivityWindowPreset } from "@/lib/account-asset-run/renderActivityParams";
import type { AccountAssetRunRenderActivityMeta } from "@/types/accountAssetRun";

const WINDOW_PRESETS: Array<{ id: RenderActivityWindowPreset; label: string }> =
  [
    { id: "24h", label: "24h" },
    { id: "48h", label: "48h" },
    { id: "7d", label: "7d" },
  ];

const STATUS_FILTERS: Array<{ id: RenderActivityStatusFilter; label: string }> =
  [
    { id: "all", label: "All" },
    { id: "running", label: "Running" },
    { id: "completed", label: "Completed" },
    { id: "failed", label: "Failed" },
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <FilterSelect
            label="Window"
            value={windowPreset}
            onValueChange={(value) =>
              onWindowPresetChange(value as RenderActivityWindowPreset)
            }
            options={WINDOW_PRESETS}
          />
          <FilterSelect
            label="Status"
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as RenderActivityStatusFilter)
            }
            options={STATUS_FILTERS}
          />
          <FilterSelect
            label="Page size"
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
            options={pageSizeOptions.map((size) => ({
              id: String(size),
              label: String(size),
            }))}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
          <span className="tabular-nums">
            Page {page}
            {pageCount > 0 ? ` of ${pageCount}` : ""}
            {total > 0 ? ` · ${totalLabel} runs` : ""}
          </span>
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

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ id: string; label: string }>;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-8 w-[132px] bg-white text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(({ id, label: optionLabel }) => (
            <SelectItem key={id} value={id}>
              {optionLabel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
