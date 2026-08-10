"use client";

import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type LiveSnapshotMetricItem = {
  id: string;
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
  iconClassName?: string;
  isLoading?: boolean;
};

interface LiveSnapshotMetricStripProps {
  items: LiveSnapshotMetricItem[];
}

/**
 * Dense KPI grid for the dashboard operations overview (3 rows × 3 columns).
 */
export function LiveSnapshotMetricStrip({ items }: LiveSnapshotMetricStripProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white w-full min-w-0">
      <div className="grid w-full grid-cols-3 grid-rows-3">
        {items.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.id}
              className="flex items-center gap-3 border-b border-r border-slate-200 px-3 py-3 [&:nth-child(3n)]:border-r-0 [&:nth-child(n+7)]:border-b-0"
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600",
                  metric.iconClassName,
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </div>
                {metric.isLoading ? (
                  <Skeleton className="mt-1 h-6 w-16" />
                ) : (
                  <div className="mt-0.5 truncate text-lg font-semibold text-slate-950">
                    {metric.value}
                  </div>
                )}
                <div className="truncate text-xs text-muted-foreground">
                  {metric.meta}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
