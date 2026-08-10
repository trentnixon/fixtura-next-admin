"use client";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock3,
  PlayCircle,
  Timer,
} from "lucide-react";

export function SchedulerRollupData() {
  const { data, isError, isLoading } = useSchedulerRollup();
  const successRate = data
    ? (
        (data.yesterdaySuccessCount /
          (data.yesterdaySuccessCount + data.yesterdayFailureCount || 1)) *
        100
      ).toFixed(0)
    : "0";

  const metrics = [
    {
      label: "Total Configs",
      value: data?.numberOfSchedulers ?? 0,
      meta: "Active scheduler records",
      icon: Calendar,
      tone: "text-slate-600 bg-slate-100",
    },
    {
      label: "Active Renders",
      value: data?.numberOfSchedulersRendering ?? 0,
      meta: "Currently processing",
      icon: PlayCircle,
      tone: "text-blue-600 bg-blue-50",
    },
    {
      label: "Queued",
      value: data?.numberOfSchedulersQueued ?? 0,
      meta: "Waiting for capacity",
      icon: Clock3,
      tone: "text-amber-600 bg-amber-50",
    },
    {
      label: "Avg Duration",
      value: data?.avgRenderTimeMinutes
        ? `${data.avgRenderTimeMinutes.toFixed(1)}m`
        : "0m",
      meta: "Recent render time",
      icon: Timer,
      tone: "text-slate-600 bg-slate-100",
    },
    {
      label: "Success Rate",
      value: `${successRate}%`,
      meta: "Previous 24 hours",
      icon: CheckCircle2,
      tone: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <SectionContainer
      title="Performance Snapshot"
      description="Real-time rendering status and operational health"
      icon={<Activity className="h-5 w-5 text-brandPrimary-500" />}
      variant="compact"
      action={
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 md:flex">
          <Activity className="h-3.5 w-3.5 animate-pulse text-brandPrimary-500" />
          <span className="text-[10px] font-semibold uppercase text-slate-600">
            Live monitor active
          </span>
        </div>
      }
    >
      {isError ? (
        <div className="flex items-start gap-3 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <div className="font-semibold">Scheduler rollup unavailable</div>
            <div className="text-xs">
              Refresh the dashboard or check the scheduler rollup endpoint.
            </div>
          </div>
        </div>
      ) : (
        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 xl:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0"
                >
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-6 w-14" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            : metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.label}
                    className="flex items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${metric.tone}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                        {metric.label}
                      </div>
                      <div className="text-xl font-semibold tabular-nums text-slate-900">
                        {metric.value}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {metric.meta}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}
    </SectionContainer>
  );
}
