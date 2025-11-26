"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Calendar,
  ExternalLink,
  Trophy,
  Users,
  Building2,
  Eye,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import EmptyState from "@/components/ui-library/states/EmptyState";

/**
 * CompetitionsList Component
 *
 * Main competitions list component displaying:
 * - Competitions sorted by timeline status (upcoming → in_progress → completed → unknown)
 * - Table format with progress bars and expandable rows for grades/clubs
 * - Consider virtualization for large lists (100-500KB response size)
 */
interface CompetitionsListProps {
  competitions: CompetitionDetail[];
}

// Timeline status order for sorting
const TIMELINE_STATUS_ORDER: Record<string, number> = {
  upcoming: 0,
  in_progress: 1,
  completed: 2,
  unknown: 3,
};

// Timeline status badge colors
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

// Format timeline status label
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

// Format date helper
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
  // Sort competitions by timeline status, then by start date
  const sortedCompetitions = useMemo(() => {
    return [...competitions].sort((a, b) => {
      // First sort by timeline status
      const statusOrderA = TIMELINE_STATUS_ORDER[a.timeline.status] ?? 999;
      const statusOrderB = TIMELINE_STATUS_ORDER[b.timeline.status] ?? 999;

      if (statusOrderA !== statusOrderB) {
        return statusOrderA - statusOrderB;
      }

      // If same status, sort by start date (earliest first)
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Competition</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Timeline</TableHead>
          <TableHead>Remaining</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead className="text-center">Grades</TableHead>
          <TableHead className="text-center">Teams</TableHead>
          <TableHead className="text-center">Clubs</TableHead>
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

import { calculateCompetitionTimeline } from "@/lib/utils";

// ... existing imports

// ... existing code

// Individual competition table row component
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

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  // Calculate timeline on client side as fallback/correction
  const calculatedTimeline = calculateCompetitionTimeline(startDate, endDate);

  // Merge API timeline with calculated timeline, preferring calculated if API is missing/invalid
  const timeline = {
    status:
      apiTimeline.status === "unknown" && calculatedTimeline.status !== "unknown"
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
      apiTimeline.daysRemaining == null || Number.isNaN(apiTimeline.daysRemaining)
        ? calculatedTimeline.daysRemaining
        : apiTimeline.daysRemaining,
    progressPercent:
      apiTimeline.progressPercent == null || Number.isNaN(apiTimeline.progressPercent)
        ? calculatedTimeline.progressPercent
        : apiTimeline.progressPercent,
  };

  return (
    <TableRow className="hover:bg-muted/50">
      {/* Competition Name */}
      <TableCell className="font-medium">
        <div className="space-y-1">
          <span className="font-semibold">{name}</span>
          {season && <p className="text-xs text-muted-foreground">{season}</p>}
        </div>
      </TableCell>

      {/* Start Date */}
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

      {/* End Date */}
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

      {/* Timeline Status */}
      <TableCell>
        <Badge
          className={`${getTimelineStatusBadge(
            timeline.status
          )} text-white border-0`}
        >
          {formatTimelineStatus(timeline.status)}
        </Badge>
      </TableCell>

      {/* Timeline Info */}
      <TableCell>
        <div className="space-y-1">
          {timeline.daysElapsed != null && !Number.isNaN(timeline.daysElapsed) && (
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

      {/* Days Remaining */}
      <TableCell>
        {timeline.daysRemaining != null && !Number.isNaN(timeline.daysRemaining) ? (
          <div className="text-sm font-medium">
            {timeline.daysRemaining} remaining
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Progress Bar */}
      <TableCell>
        {timeline.progressPercent != null && !Number.isNaN(timeline.progressPercent) ? (
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

      {/* Grades Count */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{gradeCount}</span>
        </div>
      </TableCell>

      {/* Teams Count */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{teamCount}</span>
        </div>
      </TableCell>

      {/* Clubs Count */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{clubCount}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {url && (
            <Button variant="primary" size="sm" asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">PlayHQ</span>
              </a>
            </Button>
          )}
          <Button variant="accent" size="sm" asChild>
            <Link href={`/dashboard/competitions/${id}`}>
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">View</span>
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
