"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type LiveSnapshotMetricItem = {
  id: string;
  label: string;
  value: string;
  meta: string;
  icon: LucideIcon;
  /** Labs operations-strip surface tone, e.g. `border-emerald-200 bg-emerald-50 text-emerald-800`. */
  tone?: string;
  isLoading?: boolean;
};

interface LiveSnapshotMetricStripProps {
  items: LiveSnapshotMetricItem[];
  columns?: 2 | 3 | 4;
}

function MetricCardSkeleton() {
  return (
    <Card className="border border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-3 p-3.5">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

/**
 * Operations strip — tinted metric cards from labs data (`stat.operations`).
 */
export function LiveSnapshotMetricStrip({
  items,
  columns = 3,
}: LiveSnapshotMetricStripProps) {
  return (
    <div className={cn("grid gap-3", COLUMN_CLASS[columns])}>
      {items.map((metric) => {
        if (metric.isLoading) {
          return <MetricCardSkeleton key={metric.id} />;
        }

        const Icon = metric.icon;

        return (
          <Card
            key={metric.id}
            className={cn(
              "border shadow-sm",
              metric.tone ?? "border-slate-200 bg-white text-slate-900"
            )}
          >
            <CardContent className="flex items-center gap-3 p-3.5">
              <div className="rounded-md bg-white/70 p-2">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium opacity-75">{metric.label}</div>
                <div className="truncate text-lg font-bold leading-tight">
                  {metric.value}
                </div>
                <div className="truncate text-xs opacity-75">{metric.meta}</div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
