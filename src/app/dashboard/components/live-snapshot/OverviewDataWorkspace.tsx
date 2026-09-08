"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type WorkspaceMetricTile = {
  id: string;
  label: string;
  value: string;
  meta: string;
  isLoading?: boolean;
};

interface OverviewDataWorkspaceProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  metrics: WorkspaceMetricTile[];
  columns?: 2 | 3 | 4;
}

const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

/**
 * Data workspace container from labs containers (`pattern.dataWorkspace`).
 */
export function OverviewDataWorkspace({
  title,
  description,
  icon: Icon,
  badge,
  action,
  footer,
  metrics,
  columns = 4,
}: OverviewDataWorkspaceProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-md bg-blue-50 p-1.5 text-blue-700">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {badge}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>

      <div
        className={cn(
          "grid grid-cols-1 divide-y divide-slate-200",
          COLUMN_CLASS[columns],
          "md:divide-x md:divide-y-0"
        )}
      >
        {metrics.map((tile) => (
          <div className="px-4 py-4" key={tile.id}>
            <div className="text-xs font-medium text-muted-foreground">
              {tile.label}
            </div>
            {tile.isLoading ? (
              <Skeleton className="mt-2 h-8 w-16" />
            ) : (
              <div className="mt-1 text-2xl font-bold leading-none text-slate-950">
                {tile.value}
              </div>
            )}
            <div className="mt-2 text-xs text-slate-500">{tile.meta}</div>
          </div>
        ))}
      </div>

      {footer ? (
        <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
