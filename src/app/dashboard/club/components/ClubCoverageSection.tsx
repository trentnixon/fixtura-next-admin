"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  AccountsInsights,
  ClubOverview,
  Distributions,
  TeamsInsights,
} from "@/types/clubInsights";
import DistributionsCard from "./DistributionsCard";
import AccountsInsightsCard from "./AccountsInsightsCard";

interface ClubCoverageSectionProps {
  overview: ClubOverview;
  distributions: Distributions;
  teams: TeamsInsights;
  accounts: AccountsInsights;
}

export default function ClubCoverageSection({
  overview,
  distributions,
  teams,
  accounts,
}: ClubCoverageSectionProps) {
  const linkedPercent =
    overview.totalClubs > 0
      ? Math.round((overview.clubsWithAccounts / overview.totalClubs) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Coverage at a glance"
        description="Headline counts for the selected sport. Charts below break down participation and account coverage."
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Clubs"
            value={overview.totalClubs.toLocaleString()}
            detail={`${overview.activeClubs.toLocaleString()} active · ${overview.inactiveClubs.toLocaleString()} inactive`}
          />
          <RollupStat
            label="Account linkage"
            value={`${linkedPercent}%`}
            detail={`${overview.clubsWithAccounts.toLocaleString()} linked · ${overview.clubsWithoutAccounts.toLocaleString()} missing`}
          />
          <RollupStat
            label="Teams"
            value={teams.totalTeams.toLocaleString()}
            detail={`${teams.averageTeamsPerClub.toFixed(1)} avg per club`}
          />
          <RollupStat
            label="Competition depth"
            value={overview.averageCompetitionsPerClub.toFixed(1)}
            detail={`${overview.associationsCount.toLocaleString()} associations in scope`}
          />
        </div>
      </SectionContainer>

      <SectionContainer
        title="Participation structure"
        description="How clubs distribute across team, competition, and association buckets, plus account coverage."
        variant="compact"
        className="min-w-0"
        contentClassName="min-w-0"
      >
        <DistributionsCard data={distributions} />
      </SectionContainer>

      <SectionContainer
        title="Accounts & trials"
        description="Fixtura account records and trial activity (club linkage counts are in the rollup above)."
        variant="compact"
      >
        <AccountsInsightsCard data={accounts} omitClubLinkage />
      </SectionContainer>
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
