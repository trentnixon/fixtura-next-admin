import type { ReactNode } from "react";

export interface SnapshotMetricProps {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

/** KPI cell used on fixture and grade drilldown snapshot strips. */
export function SnapshotMetric({
  title,
  value,
  detail,
  icon,
}: SnapshotMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-lg font-semibold leading-none text-slate-900">
            {value}
          </p>
          <p className="truncate text-xs font-medium uppercase text-slate-500">
            {title}
          </p>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}
