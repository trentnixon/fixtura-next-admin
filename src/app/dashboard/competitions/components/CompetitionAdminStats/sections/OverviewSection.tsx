import type { ReactNode } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { CompetitionAdminStatsResponse } from "@/types/competitionAdminStats";
import {
  Activity,
  CalendarDays,
  CalendarRange,
  Clock,
  Trophy,
} from "lucide-react";
import { formatDuration, formatNumber } from "../helpers";

interface OverviewSectionProps {
  summary: CompetitionAdminStatsResponse["summary"];
  competitions: CompetitionAdminStatsResponse["tables"]["available"];
}

function getUpcomingCount(
  competitions: CompetitionAdminStatsResponse["tables"]["available"],
) {
  const now = Date.now();
  const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

  return competitions.filter((competition) => {
    if (!competition.startDate) {
      return false;
    }

    const start = new Date(competition.startDate).getTime();
    return !Number.isNaN(start) && start > now && start <= thirtyDaysFromNow;
  }).length;
}

export function OverviewSection({
  summary,
  competitions,
}: OverviewSectionProps) {
  const upcomingCount = getUpcomingCount(competitions);

  return (
    <SectionContainer
      title="Competition Snapshot"
      description="Current scope, status, and timing coverage for the active filters."
      action={
        <Badge variant="outline" className="w-fit bg-slate-50">
          CMS stats
        </Badge>
      }
      contentClassName="p-0"
    >
      <div className="grid overflow-hidden bg-white sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotMetric
          title="Competitions"
          value={formatNumber(summary.totals.competitions)}
          detail={`${formatNumber(summary.totals.active)} active`}
          supporting={`${formatNumber(summary.totals.inactive)} inactive`}
          detailLabel="status"
          supportingLabel="status"
          icon={<Activity className="h-4 w-4" />}
          tone="blue"
        />
        <SnapshotMetric
          title="Started"
          value={formatNumber(summary.timing.started)}
          detail={`${formatNumber(summary.timing.upcoming)} upcoming`}
          supporting={`${formatNumber(upcomingCount)} next 30 days`}
          detailLabel="schedule"
          supportingLabel="near term"
          icon={<Clock className="h-4 w-4" />}
          tone="emerald"
        />
        <SnapshotMetric
          title="Missing Dates"
          value={formatNumber(summary.timing.withoutStartDate)}
          detail="No start date"
          supporting={`${formatNumber(summary.timing.started)} dated`}
          detailLabel="gap"
          supportingLabel="coverage"
          icon={<CalendarDays className="h-4 w-4" />}
          tone="amber"
        />
        <SnapshotMetric
          title="Duration"
          value={formatDuration(summary.duration.averageDays)}
          detail={`${formatDuration(summary.duration.shortestDays)} shortest`}
          supporting={`${formatDuration(summary.duration.longestDays)} longest`}
          detailLabel="average"
          supportingLabel="range"
          icon={<Trophy className="h-4 w-4" />}
          tone="slate"
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {formatNumber(summary.totals.competitions)} competitions
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {formatNumber(summary.timing.upcoming)} upcoming
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {formatNumber(summary.timing.withoutStartDate)} missing dates
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
          <CalendarRange className="h-3.5 w-3.5" />
          Next 30 days: {formatNumber(upcomingCount)}
        </span>
      </div>
    </SectionContainer>
  );
}

function SnapshotMetric({
  title,
  value,
  detail,
  supporting,
  detailLabel,
  supportingLabel,
  icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  supporting: string;
  detailLabel: string;
  supportingLabel: string;
  icon: ReactNode;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const toneClassNames = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="min-w-0 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold leading-none text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${toneClassNames[tone]}`}
        >
          {icon}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2.5 py-2">
          <div className="font-semibold text-slate-800">{detail}</div>
          <div className="mt-0.5 text-slate-500">{detailLabel}</div>
        </div>
        <div className="rounded-md bg-slate-50 px-2.5 py-2">
          <div className="font-semibold text-slate-800">{supporting}</div>
          <div className="mt-0.5 text-slate-500">{supportingLabel}</div>
        </div>
      </div>
    </div>
  );
}
