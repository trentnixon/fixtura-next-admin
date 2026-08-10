"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, Clock, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useGetTomorrowsRenders } from "@/hooks/scheduler/useGetTomorrowsRenders";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";

function countRendering(
  data: Array<{ isRendering: boolean }> | undefined
): number {
  return data?.filter((item) => item.isRendering).length ?? 0;
}

function countQueued(
  data: Array<{ queued: boolean }> | undefined
): number {
  return data?.filter((item) => item.queued).length ?? 0;
}

export function RenderPipelineOverview() {
  const { data: today, isLoading: todayLoading } = useGetTodaysRenders();
  const { data: tomorrow, isLoading: tomorrowLoading } =
    useGetTomorrowsRenders();

  if (todayLoading || tomorrowLoading) {
    return (
      <SectionContainer
        title="Render pipeline"
        description="Today's queue and tomorrow's forecast"
        variant="compact"
      >
        <LoadingState variant="minimal" message="Loading pipeline…" />
      </SectionContainer>
    );
  }

  const renderingToday = countRendering(today);
  const queuedToday = countQueued(today);
  const tomorrowTotal = tomorrow?.length ?? 0;
  const tomorrowQueued = countQueued(tomorrow);

  const metrics = [
    {
      label: "Rendering today",
      value: renderingToday,
      detail: "Schedulers with an active render",
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Queued today",
      value: queuedToday,
      detail: "Waiting in today's scheduler queue",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      label: "Tomorrow's forecast",
      value: tomorrowTotal,
      detail:
        tomorrowQueued > 0
          ? `${tomorrowQueued} still queued for tomorrow`
          : "Schedulers expected tomorrow",
      icon: <CalendarClock className="h-4 w-4 text-violet-500" />,
    },
  ];

  return (
    <SectionContainer
      title="Render pipeline"
      description="Who is processing now, what's in today's queue, and what's scheduled for tomorrow"
      variant="compact"
      action={
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/schedulers">
            Full scheduler view
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      }
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 truncate text-lg font-semibold text-slate-900">
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
