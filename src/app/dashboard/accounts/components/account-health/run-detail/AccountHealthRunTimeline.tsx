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

const TIMELINE_TONES = {
  started: "border-slate-200 bg-slate-50 text-slate-900",
  queued: "border-sky-200 bg-sky-50 text-sky-950",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-950",
  finalized: "border-violet-200 bg-violet-50 text-violet-950",
  duration: "border-amber-200 bg-amber-50 text-amber-950",
} as const;

function timelineMetric(
  id: string,
  label: string,
  iso: string | null,
  icon: LiveSnapshotMetricItem["icon"],
  tone: string,
  emptyMeta: string,
): LiveSnapshotMetricItem {
  const parts = splitHealthTimestamp(iso);

  return {
    id,
    label,
    value: parts?.time ?? "—",
    meta: parts?.date ?? emptyMeta,
    icon,
    tone,
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
    timelineMetric("started", "Started", startedAt, Play, TIMELINE_TONES.started, "Not recorded"),
    timelineMetric("queued", "Queued", queuedAt, CalendarClock, TIMELINE_TONES.queued, "Not recorded"),
    timelineMetric("completed", "Completed", completedAt, CalendarCheck2, TIMELINE_TONES.completed, "Not recorded"),
    timelineMetric("finalized", "Finalized", finalizedAt, Flag, TIMELINE_TONES.finalized, "Pending"),
    {
      id: "duration",
      label: "Total time taken",
      value: formatDurationMs(durationMs),
      meta: durationMeta,
      icon: Timer,
      tone: TIMELINE_TONES.duration,
    },
  ];

  return (
    <div className="mb-6">
      <LiveSnapshotMetricStrip items={items} columns={5} />
    </div>
  );
}
