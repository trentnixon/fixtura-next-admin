"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardSubsectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Grouped block within the dashboard operations overview. */
export function DashboardSubsection({
  title,
  description,
  action,
  children,
  className,
}: DashboardSubsectionProps) {
  return (
    <section className={cn("flex min-w-0 flex-col space-y-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
