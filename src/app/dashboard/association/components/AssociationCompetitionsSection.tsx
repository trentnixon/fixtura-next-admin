"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AssociationInsightsCompetitions } from "@/types/associationInsights";
import CompetitionStatsCard from "./CompetitionStatsCard";
import CompetitionDatePatternsCard from "./CompetitionDatePatternsCard";

interface AssociationCompetitionsSectionProps {
  competitions: AssociationInsightsCompetitions;
}

export default function AssociationCompetitionsSection({
  competitions,
}: AssociationCompetitionsSectionProps) {
  const { datePatterns } = competitions;
  const activePercent =
    competitions.totalCompetitions > 0
      ? Math.round(
          (competitions.activeCompetitions / competitions.totalCompetitions) *
            100,
        )
      : 0;
  const startingSoon =
    datePatterns.competitionsStartingThisMonth +
    datePatterns.competitionsStartingNextMonth;
  const endingSoon =
    datePatterns.competitionsEndingThisMonth +
    datePatterns.competitionsEndingNextMonth;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Competitions at a glance"
        description="Volume, status, and timing for the selected sport."
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Competitions"
            value={competitions.totalCompetitions.toLocaleString()}
            detail={`${competitions.activeCompetitions.toLocaleString()} active · ${competitions.inactiveCompetitions.toLocaleString()} inactive`}
          />
          <RollupStat
            label="Active share"
            value={`${activePercent}%`}
            detail={`${competitions.activeCompetitions.toLocaleString()} of ${competitions.totalCompetitions.toLocaleString()} competitions`}
          />
          <RollupStat
            label="Near-term starts"
            value={startingSoon.toLocaleString()}
            detail={`${datePatterns.competitionsStartingThisMonth.toLocaleString()} this month · ${datePatterns.competitionsStartingNextMonth.toLocaleString()} next month`}
          />
          <RollupStat
            label="Season span"
            value={`${datePatterns.averageCompetitionDurationDays.toFixed(0)}d avg`}
            detail={`${formatShortDate(datePatterns.earliestStartDate)} → ${formatShortDate(datePatterns.latestEndDate)}`}
          />
        </div>
      </SectionContainer>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <SectionContainer
          title="Competition mix"
          description="Status, team size, and grade depth across competitions."
          variant="compact"
        >
          <CompetitionStatsCard data={competitions} hideSummary />
        </SectionContainer>

        <SectionContainer
          title="Timing & activity"
          description="Monthly start/end activity and competition date range."
          variant="compact"
        >
          <CompetitionDatePatternsCard
            data={datePatterns}
            hideSummary
            endingSoon={endingSoon}
          />
        </SectionContainer>
      </div>
    </div>
  );
}

function formatShortDate(dateString: string | null) {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function RollupStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold leading-none text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
