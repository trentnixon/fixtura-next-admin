"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarCheck2, CalendarClock, Flag, Play } from "lucide-react";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { cn } from "@/lib/utils";
import {
  healthRunSectionTitleClass,
  healthRunTimelineGridClass,
  healthRunTimelineMetricClasses,
  type HealthRunTimelineAccent,
} from "./healthRunPageStyles";

interface AccountHealthRunTimelineProps {
  startedAt: string | null;
  queuedAt: string | null;
  completedAt: string | null;
  finalizedAt: string | null;
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
  accent: HealthRunTimelineAccent;
}) {
  const isEmpty = value === "—";
  const tone = healthRunTimelineMetricClasses(accent);

  return (
    <div className="flex items-center justify-between gap-4 border-b border-r border-brandSecondary-100 px-4 py-3 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <div className="min-w-0">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-wide",
            tone.label,
          )}
        >
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

export function AccountHealthRunTimeline({
  startedAt,
  queuedAt,
  completedAt,
  finalizedAt,
}: AccountHealthRunTimelineProps) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-1 shrink-0 rounded-full bg-brandSecondary-500"
          aria-hidden
        />
        <div>
          <h2 className={healthRunSectionTitleClass}>Run timeline</h2>
          <p className="text-xs text-muted-foreground">
            Workflow milestones in your local timezone
          </p>
        </div>
      </div>
      <div className={healthRunTimelineGridClass}>
        <TimelineMetric
          label="Started"
          value={formatHealthTimestamp(startedAt)}
          icon={Play}
          accent="secondary"
        />
        <TimelineMetric
          label="Queued"
          value={formatHealthTimestamp(queuedAt)}
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
          label="Finalized"
          value={formatHealthTimestamp(finalizedAt)}
          icon={Flag}
          accent="accent"
        />
      </div>
    </div>
  );
}
