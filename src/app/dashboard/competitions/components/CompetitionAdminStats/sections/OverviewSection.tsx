import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Activity, CalendarDays, Clock, Trophy } from "lucide-react";

import { CompetitionAdminStatsResponse } from "@/types/competitionAdminStats";
import { ReactNode } from "react";
import { formatDuration, formatNumber } from "../helpers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OverviewSectionProps {
  summary: CompetitionAdminStatsResponse["summary"];
  filters: ReactNode;
  competitions: CompetitionAdminStatsResponse["tables"]["available"];
}

function getUpcomingCompetitions(
  competitions: CompetitionAdminStatsResponse["tables"]["available"]
) {
  const now = Date.now();
  const thirtyDaysFromNow = now + 30 * 24 * 60 * 60 * 1000;

  return competitions
    .filter((competition) => {
      if (!competition.startDate) {
        return false;
      }
      const start = new Date(competition.startDate);
      if (Number.isNaN(start.getTime())) {
        return false;
      }
      const time = start.getTime();
      return time > now && time <= thirtyDaysFromNow;
    })
    .sort((a, b) => {
      const sportA = (a.sport ?? "").toLowerCase();
      const sportB = (b.sport ?? "").toLowerCase();

      if (sportA !== sportB) {
        if (sportA === "") return 1;
        if (sportB === "") return -1;
        return sportA.localeCompare(sportB);
      }

      const dateA = new Date(a.startDate ?? 0).getTime();
      const dateB = new Date(b.startDate ?? 0).getTime();
      return dateA - dateB;
    });
}

export function OverviewSection({
  summary,
  filters,
  competitions,
}: OverviewSectionProps) {
  return (
    <SectionContainer
      title="Competition Overview"
      description="Summary statistics for competitions currently visible through the CMS admin endpoint."
      action={filters}
    >
      <MetricGrid columns={4} gap="lg">
        <StatCard
          title="Total Competitions"
          value={formatNumber(summary.totals.competitions)}
          description={`${formatNumber(
            summary.totals.active
          )} active • ${formatNumber(summary.totals.inactive)} inactive`}
          icon={<Activity className="h-5 w-5" />}
          variant="primary"
        />
        <StatCard
          title="Started"
          value={formatNumber(summary.timing.started)}
          description={`${formatNumber(summary.timing.upcoming)} upcoming`}
          icon={<Clock className="h-5 w-5" />}
          variant="accent"
        />
        <StatCard
          title="No Start Date"
          value={formatNumber(summary.timing.withoutStartDate)}
          description="Competitions awaiting kickoff scheduling"
          icon={<CalendarDays className="h-5 w-5" />}
          variant="secondary"
        />
        <StatCard
          title="Average Duration"
          value={formatDuration(summary.duration.averageDays)}
          description={`Shortest: ${formatDuration(
            summary.duration.shortestDays
          )} • Longest: ${formatDuration(summary.duration.longestDays)}`}
          icon={<Trophy className="h-5 w-5" />}
          variant="light"
        />
      </MetricGrid>
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-semibold text-slate-900">
            Upcoming Competitions
          </h4>
          <span className="text-sm text-muted-foreground">
            Showing next 5 start dates
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Competition</TableHead>
                <TableHead className="min-w-[160px]">Association</TableHead>
                <TableHead className="min-w-[160px]">Sport</TableHead>
                <TableHead className="text-right">Start Date</TableHead>
                <TableHead className="text-right">Grades</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getUpcomingCompetitions(competitions).map((competition) => {
                const start = competition.startDate
                  ? new Date(competition.startDate)
                  : null;
                return (
                  <TableRow key={competition.id}>
                    <TableCell className="font-medium">
                      {competition.name}
                    </TableCell>
                    <TableCell>{competition.associationName ?? "—"}</TableCell>
                    <TableCell>{competition.sport ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      {start
                        ? start.toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatNumber(competition.gradeCount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="accent">
                        <Link
                          href={`/dashboard/competitions/${competition.id}`}
                        >
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </SectionContainer>
  );
}
