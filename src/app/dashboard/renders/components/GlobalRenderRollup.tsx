"use client";

import { PlayCircle, Activity, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRenderTelemetry } from "@/hooks/renders/useRenderTelemetry";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export function GlobalRenderRollup() {
  const { data: telemetry, isLoading, isError, error } = useRenderTelemetry();

  if (isLoading) return <LoadingState />;
  if (isError) {
    return (
      <SectionContainer
        title="Render Snapshot"
        description="Current production health and activity at a glance."
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : error ? String(error) : null}
          title="Unable to load render telemetry"
          variant="default"
        />
      </SectionContainer>
    );
  }
  if (!telemetry) return null;

  const metrics = [
    {
      label: "Active Renders",
      value: telemetry.activeCount.toString(),
      detail: "render.Processing === true",
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Success Rate",
      value: `${telemetry.successRate24h}%`,
      detail: "Complete / published last 24h (in-progress in denominator)",
      icon: <Activity className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: "Failed Today",
      value: telemetry.failedToday.toString(),
      detail: "Published today, not complete, not processing",
      icon: (
        <AlertCircle
          className={`h-4 w-4 ${
            telemetry.failedToday > 0 ? "text-amber-500" : "text-slate-300"
          }`}
        />
      ),
    },
    {
      label: "System Status",
      value: telemetry.systemStatus,
      detail:
        "<80% degraded; <90% or >20 failed today -> warning; else nominal",
      icon:
        telemetry.systemStatus === "nominal" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        ) : telemetry.systemStatus === "warning" ? (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        ) : telemetry.systemStatus === "degraded" ? (
          <AlertCircle className="h-4 w-4 text-red-500" />
        ) : (
          <Activity className="h-4 w-4 text-slate-400" />
        ),
    },
  ];

  return (
    <SectionContainer
      title="Render Snapshot"
      description="Current production health and activity at a glance."
      variant="compact"
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 truncate text-lg font-semibold capitalize text-slate-900">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.detail}</p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              {metric.icon}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
