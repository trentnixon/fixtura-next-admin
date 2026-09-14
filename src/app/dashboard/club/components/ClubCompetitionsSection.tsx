"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  ClubInsight,
  ClubOverview,
  CompetitionTimelineEntry,
} from "@/types/clubInsights";
import CompetitionTimelineCard from "./CompetitionTimelineCard";

interface ClubCompetitionsSectionProps {
  overview: ClubOverview;
  clubs: ClubInsight[];
  totalCompetitions: number;
  competitionTimeline: CompetitionTimelineEntry[];
}

export default function ClubCompetitionsSection({
  overview,
  clubs,
  totalCompetitions,
  competitionTimeline,
}: ClubCompetitionsSectionProps) {
  const clubsWithTimelines = clubs.filter(
    (club) =>
      club.competitionDateRange?.earliestStartDate &&
      club.competitionDateRange.latestEndDate,
  ).length;

  const startingThisMonth = competitionTimeline.reduce(
    (sum, entry) => sum + entry.competitionsStarting,
    0,
  );
  const endingThisMonth = competitionTimeline.reduce(
    (sum, entry) => sum + entry.competitionsEnding,
    0,
  );

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Competitions at a glance"
        description="Volume and timing for the selected sport."
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Competitions"
            value={totalCompetitions.toLocaleString()}
            detail={`${overview.averageCompetitionsPerClub.toFixed(1)} avg per club`}
          />
          <RollupStat
            label="Clubs with timelines"
            value={clubsWithTimelines.toLocaleString()}
            detail={`of ${clubs.length.toLocaleString()} clubs in scope`}
          />
          <RollupStat
            label="Starts (timeline)"
            value={startingThisMonth.toLocaleString()}
            detail="Sum of monthly start counts in chart data"
          />
          <RollupStat
            label="Ends (timeline)"
            value={endingThisMonth.toLocaleString()}
            detail="Sum of monthly end counts in chart data"
          />
        </div>
      </SectionContainer>

      {competitionTimeline.length > 0 && (
        <SectionContainer
          title="Competition timing"
          description="Monthly start, end, and active competition volume."
          variant="compact"
        >
          <CompetitionTimelineCard data={competitionTimeline} />
        </SectionContainer>
      )}
    </div>
  );
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
