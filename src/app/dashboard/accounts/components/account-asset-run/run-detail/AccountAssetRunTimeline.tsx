"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarCheck2,
  CalendarClock,
  Play,
  Timer,
  XCircle,
} from "lucide-react";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { formatAssetRunDuration } from "@/lib/account-asset-run/duration";
import { cn } from "@/lib/utils";
import {
  assetRunSectionTitleClass,
  assetRunTimelineGridClass,
  assetRunTimelineMetricClasses,
  type AssetRunTimelineAccent,
} from "./assetRunPageStyles";

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

function TimelineMetric({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: AssetRunTimelineAccent;
}) {
  const isEmpty = value === "—";
  const tone = assetRunTimelineMetricClasses(accent);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-r border-brandSecondary-100 px-4 py-3 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 text-sm font-semibold tabular-nums leading-snug",
            isEmpty ? tone.valueEmpty : tone.value,
          )}
        >
          {value}
        </p>
      </div>
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border",
          tone.icon,
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </div>
    </div>
  );
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
  const totalDuration = formatAssetRunDuration(
    { startedAt, completedAt, failedAt },
    { isLive, nowMs },
  );

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
      <div className={assetRunTimelineGridClass}>
        <TimelineMetric
          label="Started"
          value={formatHealthTimestamp(startedAt)}
          icon={Play}
          accent="secondary"
        />
        <TimelineMetric
          label="Scheduled for"
          value={formatHealthTimestamp(scheduledFor)}
          icon={CalendarClock}
          accent="info"
        />
        <TimelineMetric
          label="Completed"
          value={formatHealthTimestamp(completedAt)}
          icon={CalendarCheck2}
          accent="success"
        />
        <TimelineMetric
          label="Failed"
          value={formatHealthTimestamp(failedAt)}
          icon={XCircle}
          accent="error"
        />
        <TimelineMetric
          label="Total time"
          value={totalDuration}
          icon={Timer}
          accent="secondary"
        />
      </div>
    </div>
  );
}
