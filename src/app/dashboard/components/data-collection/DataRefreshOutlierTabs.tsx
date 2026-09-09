"use client";

import { useMemo } from "react";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
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
 * Outlier filters for refresh runs — `form.segmented-control.default`.
 */
export function DataRefreshOutlierTabs({
  value,
  onValueChange,
  counts,
}: DataRefreshOutlierTabsProps) {
  const options = useMemo(
    () =>
      FILTER_TABS.map(({ value: filterValue, label, countKey }) => {
        const count = countKey ? counts[countKey] : undefined;
        const suffix = count != null && count > 0 ? ` (${count})` : "";

        return {
          value: filterValue,
          label: `${label}${suffix}`,
        };
      }),
    [counts],
  );

  return (
    <LabeledSegmentedControl
      label="Filter"
      value={value}
      onValueChange={(next) => onValueChange(next as OutlierFilter)}
      options={options}
      className="mb-4 w-full"
      shellClassName="flex h-auto flex-wrap justify-start"
    />
  );
}
