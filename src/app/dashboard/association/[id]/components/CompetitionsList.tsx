"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, ExternalLink } from "lucide-react";

import { CompetitionDetail } from "@/types/associationDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { calculateCompetitionTimeline } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface CompetitionsListProps {
  competitions: CompetitionDetail[];
}

const TIMELINE_STATUS_ORDER: Record<string, number> = {
  upcoming: 0,
  in_progress: 1,
  completed: 2,
  unknown: 3,
};

function formatTimelineStatus(status: string): string {
  switch (status) {
    case "upcoming":
      return "Upcoming";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "unknown":
      return "Unknown";
    default:
      return status;
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(date);
}

export default function CompetitionsList({
  competitions,
}: CompetitionsListProps) {
  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort((a, b) => {
      const statusOrderA = TIMELINE_STATUS_ORDER[a.timeline.status] ?? 999;
      const statusOrderB = TIMELINE_STATUS_ORDER[b.timeline.status] ?? 999;

      if (statusOrderA !== statusOrderB) {
        return statusOrderA - statusOrderB;
      }

      if (!a.startDate && !b.startDate) return 0;
      if (!a.startDate) return 1;
      if (!b.startDate) return -1;

      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [competitions]);

  if (competitions.length === 0) {
    return (
      <EmptyState
        title="No Competitions"
        description="No competitions found for this association."
        variant="minimal"
      />
    );
  }

  return (
    <Table className="min-w-[860px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[280px]">Competition</TableHead>
          <TableHead className="min-w-[180px]">Dates</TableHead>
          <TableHead className="text-right">Grades</TableHead>
          <TableHead className="text-right">Teams</TableHead>
          <TableHead className="text-right">Clubs</TableHead>
          <TableHead className="min-w-[190px]">Timeline</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCompetitions.map((competition) => (
          <CompetitionTableRow key={competition.id} competition={competition} />
        ))}
      </TableBody>
    </Table>
  );
}

function CompetitionTableRow({
  competition,
}: {
  competition: CompetitionDetail;
}) {
  const {
    id,
    name,
    season,
    startDate,
    endDate,
    url,
    gradeCount,
    teamCount,
    clubCount,
    timeline: apiTimeline,
  } = competition;

  const calculatedTimeline = calculateCompetitionTimeline(startDate, endDate);
  const timeline = {
    status:
      apiTimeline.status === "unknown" &&
      calculatedTimeline.status !== "unknown"
        ? calculatedTimeline.status
        : apiTimeline.status,
    daysRemaining:
      apiTimeline.daysRemaining == null ||
      Number.isNaN(apiTimeline.daysRemaining)
        ? calculatedTimeline.daysRemaining
        : apiTimeline.daysRemaining,
    progressPercent:
      apiTimeline.progressPercent == null ||
      Number.isNaN(apiTimeline.progressPercent)
        ? calculatedTimeline.progressPercent
        : apiTimeline.progressPercent,
  };
  const progressPercent = timeline.progressPercent ?? 0;

  return (
    <TableRow>
      <TableCell>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-900">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {season ?? `Competition #${id}`}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(startDate)}</span>
          </div>
          <div className="pl-5">{formatDate(endDate)}</div>
        </div>
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {gradeCount}
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {teamCount}
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {clubCount}
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <TimelineBadge status={timeline.status} />
            <span className="text-xs text-muted-foreground">
              {timeline.daysRemaining != null
                ? `${timeline.daysRemaining} days left`
                : "-"}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brandPrimary-500"
              style={{
                width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
              }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {url && (
            <Button variant="primary" size="sm" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                PlayHQ
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="accent" size="sm" asChild>
            <Link href={`/dashboard/competitions/${id}`}>
              View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function TimelineBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "w-fit border text-xs",
        status === "upcoming" && "border-blue-200 bg-blue-50 text-blue-700",
        status === "in_progress" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700",
        status === "completed" && "border-slate-200 bg-slate-50 text-slate-700",
        status === "unknown" && "border-slate-200 bg-white text-slate-500",
      )}
    >
      {formatTimelineStatus(status)}
    </Badge>
  );
}
