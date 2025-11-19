"use client";

import { useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SummaryPeriod = "current-month" | "last-month" | "current-year" | "all-time";
export type TrendGranularity = "daily" | "weekly" | "monthly";

export interface PeriodControlsProps {
  period: SummaryPeriod;
  onChangePeriod: (p: SummaryPeriod) => void;
  granularity: TrendGranularity;
  onChangeGranularity: (g: TrendGranularity) => void;
}

export default function PeriodControls({
  period,
  onChangePeriod,
  granularity,
  onChangeGranularity,
}: PeriodControlsProps) {
  const periodLabel = useMemo(() => {
    switch (period) {
      case "current-month":
        return "Current Month";
      case "last-month":
        return "Last Month";
      case "current-year":
        return "Current Year";
      case "all-time":
        return "All Time";
      default:
        return "Current Month";
    }
  }, [period]);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Period</span>
        <Select value={period} onValueChange={(v) => onChangePeriod(v as SummaryPeriod)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder={periodLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current-month">Current Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="current-year">Current Year</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Granularity</span>
        <Select value={granularity} onValueChange={(v) => onChangeGranularity(v as TrendGranularity)}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="daily" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}


