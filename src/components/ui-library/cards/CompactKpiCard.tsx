"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CompactKpiCardProps = {
  value: string;
  label: string;
  icon: ReactNode;
  badge?: string;
  /** 0–100; renders a progress bar when set */
  progressPercent?: number;
  iconClassName?: string;
  progressClassName?: string;
  className?: string;
};

/** `card.base.compact-kpi` — compact metric with optional badge and progress bar */
export default function CompactKpiCard({
  value,
  label,
  icon,
  badge,
  progressPercent,
  iconClassName = "bg-indigo-50 text-indigo-700",
  progressClassName = "bg-indigo-500",
  className,
}: CompactKpiCardProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className={cn("rounded-md p-2", iconClassName)}>{icon}</div>
          {badge ? <Badge variant="secondary">{badge}</Badge> : null}
        </div>
        <div className="text-2xl font-bold leading-none text-slate-900">
          {value}
        </div>
        <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
        {progressPercent != null ? (
          <div className="mt-3 h-1.5 rounded-full bg-slate-100">
            <div
              className={cn(
                "h-1.5 rounded-full transition-all",
                progressClassName,
              )}
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
