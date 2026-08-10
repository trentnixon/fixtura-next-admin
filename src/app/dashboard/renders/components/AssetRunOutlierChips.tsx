"use client";

import { cn } from "@/lib/utils";
import type { AssetRunOutlierFilter } from "@/lib/account-asset-run/globalRunAnalytics";

export type AssetRunOutlierCounts = {
  active: number;
  failed: number;
  stuck: number;
  slowest: number;
  repeat_failures: number;
};

const FILTERS: Array<{
  id: AssetRunOutlierFilter;
  label: string;
  countKey?: keyof AssetRunOutlierCounts;
}> = [
  { id: "all", label: "All" },
  { id: "active", label: "In flight", countKey: "active" },
  { id: "failed", label: "Failed", countKey: "failed" },
  { id: "stuck", label: "Stuck", countKey: "stuck" },
  { id: "slowest", label: "Slowest", countKey: "slowest" },
  {
    id: "repeat_failures",
    label: "Repeat failures",
    countKey: "repeat_failures",
  },
];

interface AssetRunOutlierChipsProps {
  filter: AssetRunOutlierFilter;
  onFilterChange: (filter: AssetRunOutlierFilter) => void;
  counts: AssetRunOutlierCounts;
}

export function AssetRunOutlierChips({
  filter,
  onFilterChange,
  counts,
}: AssetRunOutlierChipsProps) {
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
