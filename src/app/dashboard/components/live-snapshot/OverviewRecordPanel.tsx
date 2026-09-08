"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OverviewRecordPanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  badge?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Record panel container from labs containers (`pattern.recordPanel`).
 */
export function OverviewRecordPanel({
  title,
  description,
  action,
  badge,
  footer,
  children,
  className,
}: OverviewRecordPanelProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            {badge}
          </div>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </div>

      <div className="p-4">{children}</div>

      {footer ? (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
