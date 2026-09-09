"use client";

import { useMemo } from "react";
import { Activity, CalendarDays, Clock3, PlayCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import type { Scheduler } from "@/types/scheduler";

type SchedulerPageProps = {
  scheduler: Scheduler;
};

export default function SchedulerPage({ scheduler }: SchedulerPageProps) {
  const { attributes } = scheduler;
  const account = attributes.account?.data;
  const accountLabel = account
    ? [account.attributes.FirstName, account.attributes.LastName]
        .filter(Boolean)
        .join(" ")
    : "No linked account";
  const accountType =
    account?.attributes.account_type?.data?.attributes?.Name ?? "Unknown";
  const scheduleDay =
    attributes.days_of_the_week?.data?.attributes?.Name ?? "Not set";
  const scheduleTime = attributes.Time?.slice(0, 5) ?? "--:--";
  const renderCount = attributes.renders?.data?.length ?? 0;

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    const tiles: WorkspaceMetricTile[] = [
      {
        id: "account",
        label: "Account",
        value: accountLabel,
        meta: account
          ? `${account.attributes.Sport} · ${accountType}`
          : "Scheduler has no parent account",
      },
      {
        id: "schedule",
        label: "Schedule",
        value: scheduleTime,
        meta: `Runs on ${scheduleDay}`,
      },
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
        value: String(renderCount),
        meta:
          renderCount === 1
            ? "Recorded attempt"
            : `${renderCount} recorded attempts`,
      },
    ];

    return tiles;
  }, [
    account,
    accountLabel,
    accountType,
    attributes.Queued,
    attributes.isActive,
    attributes.isRendering,
    renderCount,
    scheduleDay,
    scheduleTime,
  ]);

  return (
    <OverviewDataWorkspace
      title="Scheduler snapshot"
      description="Configuration, queue state, and recent render volume for this scheduler"
      icon={CalendarDays}
      badge={
        attributes.isRendering ? (
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
        )
      }
      metrics={metrics}
      columns={3}
      footer={
        <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <User className="h-3.5 w-3.5" aria-hidden />
            Account context
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden />
            Weekly schedule
          </span>
          <span className="inline-flex items-center gap-1">
            <PlayCircle className="h-3.5 w-3.5" aria-hidden />
            Pipeline state
          </span>
        </span>
      }
    />
  );
}
