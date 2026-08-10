"use client";

import { cn } from "@/lib/utils";
import type { OutlierFilter } from "@/lib/account-health/globalRunAnalytics";

export type OutlierCounts = {
  failed: number;
  stuck: number;
  slowest: number;
  empty: number;
  repeat_failures: number;
};

const FILTERS: Array<{
  id: OutlierFilter;
  label: string;
  countKey?: keyof OutlierCounts;
}> = [
  { id: "all", label: "All" },
  { id: "failed", label: "Failed", countKey: "failed" },
  { id: "stuck", label: "Stuck active", countKey: "stuck" },
  { id: "slowest", label: "Slowest", countKey: "slowest" },
  { id: "empty", label: "Empty season", countKey: "empty" },
  { id: "repeat_failures", label: "Repeat failures", countKey: "repeat_failures" },
];

interface DataRefreshOutlierChipsProps {
  filter: OutlierFilter;
  onFilterChange: (filter: OutlierFilter) => void;
  counts: OutlierCounts;
}

export default function DataRefreshOutlierChips({
  filter,
  onFilterChange,
  counts,
}: DataRefreshOutlierChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map(({ id, label, countKey }) => {
        const count = countKey ? counts[countKey] : undefined;
        const active = filter === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onFilterChange(id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {label}
            {count != null && count > 0 ? ` (${count})` : ""}
          </button>
        );
      })}
    </div>
  );
}
