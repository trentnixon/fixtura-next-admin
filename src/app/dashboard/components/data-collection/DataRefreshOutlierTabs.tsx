"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OutlierFilter } from "@/lib/account-health/globalRunAnalytics";
import type { OutlierCounts } from "../account-health/DataRefreshOutlierChips";

const FILTER_TABS: Array<{
  value: OutlierFilter;
  label: string;
  countKey?: keyof OutlierCounts;
}> = [
  { value: "all", label: "All" },
  { value: "failed", label: "Failed", countKey: "failed" },
  { value: "stuck", label: "Stuck active", countKey: "stuck" },
  { value: "slowest", label: "Slowest", countKey: "slowest" },
  { value: "empty", label: "Empty season", countKey: "empty" },
  {
    value: "repeat_failures",
    label: "Repeat failures",
    countKey: "repeat_failures",
  },
];

interface DataRefreshOutlierTabsProps {
  value: OutlierFilter;
  onValueChange: (filter: OutlierFilter) => void;
  counts: OutlierCounts;
}

/**
 * Outlier filters for refresh runs — navigation.pattern.section-tabs.
 */
export function DataRefreshOutlierTabs({
  value,
  onValueChange,
  counts,
}: DataRefreshOutlierTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(next) => onValueChange(next as OutlierFilter)}
      className="w-full"
    >
      <TabsList
        variant="primary"
        className="mb-4 flex h-auto flex-wrap justify-start gap-1"
        aria-label="Refresh run filters"
      >
        {FILTER_TABS.map(({ value: filterValue, label, countKey }) => {
          const count = countKey ? counts[countKey] : undefined;
          const suffix =
            count != null && count > 0 ? ` (${count})` : "";

          return (
            <TabsTrigger key={filterValue} value={filterValue}>
              {label}
              {suffix}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
