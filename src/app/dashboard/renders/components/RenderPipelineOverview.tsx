"use client";

import { useMemo } from "react";
import { CalendarClock, Clock, PlayCircle } from "lucide-react";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useGetTomorrowsRenders } from "@/hooks/scheduler/useGetTomorrowsRenders";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";

function countRendering(
  data: Array<{ isRendering: boolean }> | undefined,
): number {
  return data?.filter((item) => item.isRendering).length ?? 0;
}

function countQueued(data: Array<{ queued: boolean }> | undefined): number {
  return data?.filter((item) => item.queued).length ?? 0;
}

export function RenderPipelineOverview() {
  const { data: today, isLoading: todayLoading } = useGetTodaysRenders();
  const { data: tomorrow, isLoading: tomorrowLoading } =
    useGetTomorrowsRenders();

  const isLoading = todayLoading || tomorrowLoading;
  const renderingToday = countRendering(today);
  const queuedToday = countQueued(today);
  const tomorrowTotal = tomorrow?.length ?? 0;
  const tomorrowQueued = countQueued(tomorrow);

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "rendering-today",
        label: "Rendering today",
        value: String(renderingToday),
        meta: "Schedulers with an active render",
        isLoading,
      },
      {
        id: "queued-today",
        label: "Queued today",
        value: String(queuedToday),
        meta: "Waiting in today's scheduler queue",
        isLoading,
      },
      {
        id: "tomorrow",
        label: "Tomorrow's forecast",
        value: String(tomorrowTotal),
        meta:
          tomorrowQueued > 0
            ? `${tomorrowQueued} still queued for tomorrow`
            : "Schedulers expected tomorrow",
        isLoading,
      },
    ];
  }, [isLoading, queuedToday, renderingToday, tomorrowQueued, tomorrowTotal]);

  return (
    <OverviewDataWorkspace
      title="Render pipeline"
      description="Who is processing now, what's in today's queue, and what's scheduled for tomorrow"
      icon={CalendarClock}
      metrics={metrics}
      columns={3}
      action={
        <DashboardLinkButton
          href="/dashboard/schedulers"
          trailingIcon="external"
        >
          Schedulers
        </DashboardLinkButton>
      }
      footer={
        <>
          <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <PlayCircle className="h-3.5 w-3.5" aria-hidden />
              Active today
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Queue depth
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              Tomorrow forecast
            </span>
          </span>
          <DashboardLinkButton
            href="/dashboard/schedulers"
            intent="highlight"
            trailingIcon="arrow"
          >
            Open scheduler workspace
          </DashboardLinkButton>
        </>
      }
    />
  );
}
