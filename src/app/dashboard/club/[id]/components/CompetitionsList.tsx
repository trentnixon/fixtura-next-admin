"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ClubCompetitionDetail } from "@/types/clubAdminDetail";
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
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  ExternalLink,
  Trophy,
  Users,
  Building2,
  Eye,
} from "lucide-react";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { calculateCompetitionTimeline } from "@/lib/utils";

interface CompetitionsListProps {
  competitions: ClubCompetitionDetail[];
}

const TIMELINE_STATUS_ORDER: Record<string, number> = {
  upcoming: 0,
  in_progress: 1,
  completed: 2,
  unknown: 3,
};

function getTimelineStatusBadge(status: string) {
  switch (status) {
    case "upcoming":
      return "bg-blue-500 hover:bg-blue-600";
    case "in_progress":
      return "bg-green-500 hover:bg-green-600";
    case "completed":
      return "bg-slate-500 hover:bg-slate-600";
    case "unknown":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}

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

function formatDate(dateString: string | null): string | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("en-AU", {
      dateStyle: "medium",
    }).format(date);
  } catch {
    return dateString;
  }
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

      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      if (Number.isNaN(dateA.getTime()) && Number.isNaN(dateB.getTime()))
        return 0;
      if (Number.isNaN(dateA.getTime())) return 1;
      if (Number.isNaN(dateB.getTime())) return -1;

      return dateA.getTime() - dateB.getTime();
    });
  }, [competitions]);

  if (sortedCompetitions.length === 0) {
    return (
      <EmptyState
        title="No Competitions"
        description="No competitions found for this club."
        variant="minimal"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Competition</TableHead>
          <TableHead>Association</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-center">Grades</TableHead>
          <TableHead className="text-center">Teams</TableHead>
          <TableHead className="text-right">PlayHQ</TableHead>
          <TableHead className="text-center">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedCompetitions.map((competition) => (
          <CompetitionRow key={competition.id} competition={competition} />
        ))}
      </TableBody>
    </Table>
  );
}

function CompetitionRow({
  competition,
}: {
  competition: ClubCompetitionDetail;
}) {
  const {
    id,
    name,
    association,
    startDate,
    endDate,
    gradeCount,
    teamCount,
    timeline: apiTimeline,
    competitionUrl,
  } = competition;

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // Calculate timeline on client side as fallback/correction
  const calculatedTimeline = calculateCompetitionTimeline(startDate, endDate);

  // Merge API timeline with calculated timeline, preferring calculated if API is missing/invalid
  const timeline = {
    status:
      apiTimeline.status === "unknown" &&
      calculatedTimeline.status !== "unknown"
        ? calculatedTimeline.status
        : apiTimeline.status,
    daysElapsed:
      apiTimeline.daysElapsed == null || Number.isNaN(apiTimeline.daysElapsed)
        ? calculatedTimeline.daysElapsed
        : apiTimeline.daysElapsed,
    daysTotal:
      apiTimeline.daysTotal == null || Number.isNaN(apiTimeline.daysTotal)
        ? calculatedTimeline.daysTotal
        : apiTimeline.daysTotal,
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

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{name}</span>
        </div>
      </TableCell>
      <TableCell>
        {association ? (
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{association.name}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        {formattedStartDate ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedStartDate}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        {formattedEndDate ? (
          <div className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formattedEndDate}</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <Badge
          className={`${getTimelineStatusBadge(
            timeline.status
          )} text-white border-0`}
        >
          {formatTimelineStatus(timeline.status)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          {timeline.daysElapsed != null &&
            !Number.isNaN(timeline.daysElapsed) && (
              <div className="text-xs text-muted-foreground">
                {timeline.daysElapsed} elapsed
              </div>
            )}
          {timeline.daysTotal != null && !Number.isNaN(timeline.daysTotal) && (
            <div className="text-xs text-muted-foreground">
              Total: {timeline.daysTotal} days
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {timeline.daysRemaining != null &&
        !Number.isNaN(timeline.daysRemaining) ? (
          <div className="text-sm font-medium">
            {timeline.daysRemaining} remaining
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        {timeline.progressPercent != null &&
        !Number.isNaN(timeline.progressPercent) ? (
          <div className="space-y-1">
            <Progress value={timeline.progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {Math.round(timeline.progressPercent)}%
            </p>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{gradeCount}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{teamCount}</span>
        </div>
      </TableCell>
      <TableCell className="text-center">
        {competitionUrl && (
          <Button variant="primary" size="sm" asChild>
            <a
              href={competitionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View</span>
            </a>
          </Button>
        )}
      </TableCell>
      <TableCell className="text-center">
        <Button variant="accent" size="sm" asChild>
          <Link
            href={`/dashboard/competitions/${id}`}
            className="flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View</span>
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}
