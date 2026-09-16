import type { LucideIcon } from "lucide-react";

export type OrgContactMetricItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
};

type OrgContactMetricGridProps = {
  metrics: OrgContactMetricItem[];
};

export function OrgContactMetricGrid({ metrics }: OrgContactMetricGridProps) {
  return (
    <div className="mb-4 grid overflow-hidden rounded-md border border-slate-200 bg-white md:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="flex items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" aria-hidden />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>
              <p className="text-lg font-semibold text-slate-900">{metric.value}</p>
              <p className="truncate text-xs text-muted-foreground">
                {metric.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
