"use client";

import { useEffect, useState } from "react";
import { CalendarCheck2, CalendarClock, Flag, Play, Timer } from "lucide-react";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";
import { isHealthRunActive } from "@/lib/account-health/displayRules";
import {
  formatDurationMs,
  resolveRunDurationMs,
} from "@/lib/account-health/globalRunAnalytics";
import { splitHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import type { AccountHealthRunStatus } from "@/types/accountHealth";

interface AccountHealthRunTimelineProps {
  status: AccountHealthRunStatus;
  startedAt: string | null;
  queuedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  finalizedAt: string | null;
}

const TIMELINE_ICON_CLASS = "bg-slate-100 text-slate-600";

function timelineMetric(
  id: string,
  label: string,
  iso: string | null,
  icon: LiveSnapshotMetricItem["icon"],
  emptyMeta: string,
): LiveSnapshotMetricItem {
  const parts = splitHealthTimestamp(iso);

  return {
    id,
    label,
    value: parts?.time ?? "—",
    meta: parts?.date ?? emptyMeta,
    icon,
    iconClassName: TIMELINE_ICON_CLASS,
  };
}

export function AccountHealthRunTimeline({
  status,
  startedAt,
  queuedAt,
  completedAt,
  failedAt,
  finalizedAt,
}: AccountHealthRunTimelineProps) {
  const liveRun = isHealthRunActive(status);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!liveRun) return;
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [liveRun]);

  const durationMs = resolveRunDurationMs(
    {
      status,
      startedAt,
      queuedAt,
      completedAt,
      failedAt,
      finalizedAt,
    },
    nowMs,
  );

  const durationMeta = liveRun
    ? "Still running"
    : durationMs != null
      ? "Started → end"
      : "Not enough data";

  const items: LiveSnapshotMetricItem[] = [
    timelineMetric("started", "Started", startedAt, Play, "Not recorded"),
    timelineMetric("queued", "Queued", queuedAt, CalendarClock, "Not recorded"),
    timelineMetric(
      "completed",
      "Completed",
      completedAt,
      CalendarCheck2,
      "Not recorded",
    ),
    timelineMetric(
      "finalized",
      "Finalized",
      finalizedAt,
      Flag,
      "Pending",
    ),
    {
      id: "duration",
      label: "Total time taken",
      value: formatDurationMs(durationMs),
      meta: durationMeta,
      icon: Timer,
      iconClassName: TIMELINE_ICON_CLASS,
    },
  ];

  return <LiveSnapshotMetricStrip items={items} columns={5} />;
}
