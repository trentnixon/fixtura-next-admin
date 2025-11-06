"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChartSummaryStat {
  icon?: LucideIcon;
  label: string;
  value: React.ReactNode;
  className?: string;
}

export interface ChartSummaryStatsProps {
  stats: ChartSummaryStat[];
  columns?: 2 | 3 | 4;
  showBorder?: boolean;
  className?: string;
}

/**
 * ChartSummaryStats Component
 *
 * A reusable component for displaying summary statistics in a grid layout.
 * Supports icons, labels, values, and configurable column layouts.
 *
 * @example
 * ```tsx
 * <ChartSummaryStats
 *   stats={[
 *     { icon: Clock, label: "Avg Time", value: "2.5s" },
 *     { icon: MemoryStick, label: "Avg Memory", value: "128MB" },
 *   ]}
 *   columns={4}
 *   showBorder={true}
 * />
 * ```
 */
export default function ChartSummaryStats({
  stats,
  columns = 4,
  showBorder = true,
  className,
}: ChartSummaryStatsProps) {
  if (stats.length === 0) return null;

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };

  return (
    <div
      className={cn(
        "grid gap-4",
        gridCols[columns],
        showBorder && "pb-4 border-b",
        className
      )}
    >
      {stats.map((stat, index) => {
        const StatIcon = stat.icon;
        return (
          <div key={index} className={cn("space-y-1", stat.className)}>
            {StatIcon && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <StatIcon className="w-3 h-3" />
                {stat.label}
              </div>
            )}
            {!StatIcon && (
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            )}
            <div className="text-lg font-semibold">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}

