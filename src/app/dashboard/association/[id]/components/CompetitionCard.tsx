"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Calendar,
  ExternalLink,
  Trophy,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CompetitionDetail } from "@/types/associationDetail";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * CompetitionCard Component
 *
 * Individual competition card displaying:
 * - Name, season, status, active badge
 * - Start/end dates (handle null)
 * - Timeline progress (status, daysTotal, daysElapsed, daysRemaining, progressPercent)
 * - Grade count, team count, club count
 * - PlayHQ URL link (if available)
 * - Nested grades list (GradeDetail[])
 * - Nested clubs list (CompetitionClubDetail[])
 */
interface CompetitionCardProps {
  competition: CompetitionDetail;
}

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

export default function CompetitionCard({
  competition,
}: CompetitionCardProps) {
  const [isGradesOpen, setIsGradesOpen] = useState(false);
  const [isClubsOpen, setIsClubsOpen] = useState(false);

  const {
    name,
    season,
    status,
    isActive,
    startDate,
    endDate,
    url,
    gradeCount,
    teamCount,
    clubCount,
    timeline,
    grades,
    clubs,
  } = competition;

  // Format dates (handle null and invalid dates)
  const formattedStartDate = useMemo(() => {
    if (!startDate) return null;
    try {
      const date = new Date(startDate);
      if (Number.isNaN(date.getTime())) return startDate; // Return original if invalid
      return new Intl.DateTimeFormat("en-AU", {
        dateStyle: "medium",
      }).format(date);
    } catch {
      return startDate; // Return original if parsing fails
    }
  }, [startDate]);

  const formattedEndDate = useMemo(() => {
    if (!endDate) return null;
    try {
      const date = new Date(endDate);
      if (Number.isNaN(date.getTime())) return endDate; // Return original if invalid
      return new Intl.DateTimeFormat("en-AU", {
        dateStyle: "medium",
      }).format(date);
    } catch {
      return endDate; // Return original if parsing fails
    }
  }, [endDate]);

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {name}
              </h3>
              <StatusBadge
                status={isActive}
                trueLabel="Active"
                falseLabel="Inactive"
              />
            </div>
            {season && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {season}
              </p>
            )}
            {status && (
              <Badge variant="outline" className="text-xs">
                {status}
              </Badge>
            )}
          </div>
          {url && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                PlayHQ
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-4">
        {/* Dates */}
        {(formattedStartDate || formattedEndDate) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {formattedStartDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formattedStartDate}</p>
                </div>
              </div>
            )}
            {formattedEndDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium">{formattedEndDate}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                className={`${getTimelineStatusBadge(
                  timeline.status
                )} text-white border-0`}
              >
                {formatTimelineStatus(timeline.status)}
              </Badge>
              {timeline.progressPercent !== null && (
                <span className="text-sm text-muted-foreground">
                  {Math.round(timeline.progressPercent)}%
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {timeline.daysElapsed !== null && (
                <span>{timeline.daysElapsed} days elapsed</span>
              )}
              {timeline.daysRemaining !== null && (
                <span>{timeline.daysRemaining} days remaining</span>
              )}
            </div>
          </div>
          {timeline.progressPercent !== null && (
            <Progress value={timeline.progressPercent} className="h-2" />
          )}
          {timeline.daysTotal !== null && (
            <p className="text-xs text-muted-foreground">
              Total duration: {timeline.daysTotal} days
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold">{gradeCount}</p>
            <p className="text-xs text-muted-foreground">Grades</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold">{teamCount}</p>
            <p className="text-xs text-muted-foreground">Teams</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
            </div>
            <p className="text-2xl font-semibold">{clubCount}</p>
            <p className="text-xs text-muted-foreground">Clubs</p>
          </div>
        </div>

        {/* Grades List (Collapsible) */}
        {grades.length > 0 && (
          <Collapsible open={isGradesOpen} onOpenChange={setIsGradesOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <span className="text-sm font-medium">
                  Grades ({grades.length})
                </span>
                {isGradesOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                {grades.map((grade) => (
                  <div
                    key={grade.id}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded text-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{grade.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {grade.gender && <span>{grade.gender}</span>}
                        {grade.ageGroup && (
                          <span>• {grade.ageGroup}</span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {grade.teamCount} teams
                    </Badge>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Clubs List (Collapsible) */}
        {clubs.length > 0 && (
          <Collapsible open={isClubsOpen} onOpenChange={setIsClubsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-2 h-auto"
              >
                <span className="text-sm font-medium">
                  Clubs ({clubs.length})
                </span>
                {isClubsOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                {clubs.map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded"
                  >
                    {club.logoUrl && (
                      <div className="relative w-8 h-8 rounded border bg-white p-1 flex-shrink-0">
                        <Image
                          src={club.logoUrl}
                          alt={`${club.name} logo`}
                          width={24}
                          height={24}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {club.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {club.teamCount} teams
                    </Badge>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
}
