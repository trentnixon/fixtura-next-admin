"use client";

import { useMemo } from "react";
import { Activity, CalendarDays, Clock3, PauseCircle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { latestSchedulerRenders } from "@/lib/scheduler/schedulerRenderHistory";
import type { Scheduler } from "@/types/scheduler";

type SchedulerPageProps = {
  scheduler: Scheduler;
};

export default function SchedulerPage({ scheduler }: SchedulerPageProps) {
  const { attributes } = scheduler;
  const history = latestSchedulerRenders(attributes.renders?.data ?? []);
  const shown = history.rows.length;
  const total = history.total;

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    const tiles: WorkspaceMetricTile[] = [
      {
        id: "rendering",
        label: "Rendering",
        value: attributes.isRendering ? "Active" : "Idle",
        meta: attributes.isRendering
          ? "Currently processing a render"
          : "No active render job",
      },
      {
        id: "queued",
        label: "Queue",
        value: attributes.Queued ? "Queued" : "Ready",
        meta: attributes.Queued
          ? "Waiting for render capacity"
          : "Not waiting in queue",
      },
      {
        id: "active",
        label: "Scheduler state",
        value: attributes.isActive ? "Active" : "Inactive",
        meta: attributes.isActive
          ? "Included in operational runs"
          : "Disabled in CMS",
      },
      {
        id: "history",
        label: "Render history",
        value: String(shown),
        meta:
          total > shown
            ? `Latest ${shown} of ${total}`
            : total === 1
              ? "Recorded attempt"
              : `${total} recorded attempts`,
      },
    ];

    return tiles;
  }, [attributes.Queued, attributes.isActive, attributes.isRendering, shown, total]);

  const badge = !attributes.isActive ? (
    <Badge variant="outline" className="gap-1">
      <PauseCircle className="h-3 w-3" aria-hidden />
      Inactive
    </Badge>
  ) : attributes.isRendering ? (
    <Badge variant="secondary" className="gap-1">
      <PlayCircle className="h-3 w-3" aria-hidden />
      Rendering
    </Badge>
  ) : attributes.Queued ? (
    <Badge variant="outline" className="gap-1 border-amber-200 text-amber-800">
      <Clock3 className="h-3 w-3" aria-hidden />
      Queued
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1">
      <Activity className="h-3 w-3" aria-hidden />
      Idle
    </Badge>
  );

  return (
    <OverviewDataWorkspace
      title="Scheduler snapshot"
      description="Queue and activity for this scheduler"
      icon={CalendarDays}
      badge={badge}
      metrics={metrics}
      columns={4}
    />
  );
}
