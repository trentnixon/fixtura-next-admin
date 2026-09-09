"use client";

import {
  CalendarCheck2,
  CalendarClock,
  Play,
  Timer,
  XCircle,
} from "lucide-react";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";
import { assetRunDurationMs } from "@/lib/account-asset-run/duration";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import { splitHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { cn } from "@/lib/utils";
import { assetRunSectionTitleClass } from "./assetRunPageStyles";

interface AccountAssetRunTimelineProps {
  startedAt: string | null;
  scheduledFor: string | null;
  completedAt: string | null;
  failedAt: string | null;
  isLive?: boolean;
  nowMs?: number;
  showHeading?: boolean;
  className?: string;
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

export function AccountAssetRunTimeline({
  startedAt,
  scheduledFor,
  completedAt,
  failedAt,
  isLive = false,
  nowMs,
  showHeading = true,
  className,
}: AccountAssetRunTimelineProps) {
  const durationMs = assetRunDurationMs(
    { startedAt, completedAt, failedAt },
    { isLive, nowMs },
  );

  const durationMeta = isLive
    ? "Still running"
    : durationMs != null
      ? "Started → end"
      : "Not enough data";

  const items: LiveSnapshotMetricItem[] = [
    timelineMetric("started", "Started", startedAt, Play, "Not recorded"),
    timelineMetric(
      "scheduled",
      "Scheduled for",
      scheduledFor,
      CalendarClock,
      "Not recorded",
    ),
    timelineMetric(
      "completed",
      "Completed",
      completedAt,
      CalendarCheck2,
      "Not recorded",
    ),
    timelineMetric("failed", "Failed", failedAt, XCircle, "Not recorded"),
    {
      id: "duration",
      label: "Total time",
      value: formatDurationMs(durationMs),
      meta: durationMeta,
      icon: Timer,
      iconClassName: TIMELINE_ICON_CLASS,
    },
  ];

  return (
    <div
      className={cn(showHeading ? "mb-6 space-y-3" : "space-y-3", className)}
    >
      {showHeading && (
        <div className="flex items-center gap-2">
          <span
            className="h-4 w-1 shrink-0 rounded-full bg-brandAccent-500"
            aria-hidden
          />
          <div>
            <h2 className={assetRunSectionTitleClass}>Run timeline</h2>
            <p className="text-xs text-muted-foreground">
              Workflow milestones in your local timezone
            </p>
          </div>
        </div>
      )}
      <LiveSnapshotMetricStrip items={items} columns={5} />
    </div>
  );
}
