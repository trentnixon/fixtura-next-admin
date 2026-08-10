"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  CalendarRange,
  Gauge,
  Link2,
  Trophy,
  Users,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useClubInsights } from "@/hooks/club/useClubInsights";
import { ClubInsightsResponse, ClubSportFilter } from "@/types/clubInsights";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SportFilter from "./components/SportFilter";
import { ClubGanttSection } from "./components/ClubGanttSection";
import ClubsTable from "./components/ClubsTable";
import OverviewStatsCard from "./components/OverviewStatsCard";
import DistributionsCard from "./components/DistributionsCard";
import TeamsInsightsCard from "./components/TeamsInsightsCard";
import AccountsInsightsCard from "./components/AccountsInsightsCard";
import CompetitionTimelineCard from "./components/CompetitionTimelineCard";

const clubTabs = [
  {
    value: "snapshot",
    label: "Snapshot",
    icon: Gauge,
  },
  {
    value: "timeline",
    label: "Timeline",
    icon: CalendarDays,
  },
  {
    value: "coverage",
    label: "Coverage",
    icon: BarChart3,
  },
  {
    value: "competitions",
    label: "Competitions",
    icon: Trophy,
  },
];

export default function ClubData() {
  const [selectedSport, setSelectedSport] =
    useState<ClubSportFilter>("Cricket");
  const { data, isLoading, error, refetch } = useClubInsights(selectedSport);

  return (
    <>
      <CreatePageTitle
        title="Clubs"
        byLine="Club directory and operational insight"
        byLineBottom="Compact view of linked accounts, competitions, teams, and timelines"
      />
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <SectionContainer title="Loading">
            <LoadingState message="Loading club insights..." />
          </SectionContainer>
        )}

        {error && (
          <SectionContainer title="Error">
            <ErrorState
              error={error}
              title="Failed to load club insights"
              onRetry={() => refetch()}
            />
          </SectionContainer>
        )}

        {data?.data && (
          <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
                {clubTabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="min-h-10 gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <SportFilter
                selectedSport={selectedSport}
                onSportChange={setSelectedSport}
              />
            </div>

            <TabsContent value="snapshot" className="mt-6 space-y-6">
              <ClubSnapshot insights={data} />

              <SectionContainer
                title="Clubs"
                description="Search, sort, and open club detail records."
              >
                <ClubsTable clubs={data.data.clubs} />
              </SectionContainer>
            </TabsContent>

            <TabsContent
              value="timeline"
              className="mt-6 min-w-0 max-w-full overflow-hidden"
            >
              <ClubGanttSection clubs={data.data.clubs} />
            </TabsContent>

            <TabsContent value="coverage" className="mt-6 space-y-6">
              {data.data.overview && (
                <SectionContainer
                  title="Account Coverage"
                  description="How many clubs exist, how many are linked to accounts, and where account coverage gaps remain."
                >
                  <OverviewStatsCard data={data.data.overview} />
                </SectionContainer>
              )}

              {data.data.distributions && (
                <SectionContainer
                  title="Participation Structure"
                  description="Club depth by teams, competitions, associations, and account coverage."
                >
                  <DistributionsCard data={data.data.distributions} />
                </SectionContainer>
              )}

              <div className="grid gap-6 lg:grid-cols-2">
                {data.data.teams && (
                  <SectionContainer
                    title="Teams"
                    description="Team volume and average team depth across clubs."
                  >
                    <TeamsInsightsCard data={data.data.teams} />
                  </SectionContainer>
                )}

                {data.data.accounts && (
                  <SectionContainer
                    title="Accounts"
                    description="Account and trial coverage across club records."
                  >
                    <AccountsInsightsCard data={data.data.accounts} />
                  </SectionContainer>
                )}
              </div>
            </TabsContent>

            <TabsContent value="competitions" className="mt-6 space-y-6">
              {data.data.overview && (
                <SectionContainer
                  title="Competition Mix"
                  description="Competition volume and average competition depth across clubs."
                >
                  <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
                    <SnapshotStat
                      label="Competitions"
                      value={data.data.meta.dataPoints.competitions.toLocaleString()}
                    />
                    <SnapshotStat
                      label="Average per Club"
                      value={data.data.overview.averageCompetitionsPerClub.toFixed(
                        1,
                      )}
                    />
                    <SnapshotStat
                      label="Clubs With Timelines"
                      value={data.data.clubs
                        .filter(
                          (club) =>
                            club.competitionDateRange?.earliestStartDate &&
                            club.competitionDateRange.latestEndDate,
                        )
                        .length.toLocaleString()}
                    />
                  </div>
                </SectionContainer>
              )}

              {data.data.insights?.competitionTimeline?.length > 0 && (
                <SectionContainer
                  title="Competition Timing"
                  description="Start, end, and active competition volume by month for the selected sport."
                >
                  <CompetitionTimelineCard
                    data={data.data.insights.competitionTimeline}
                  />
                </SectionContainer>
              )}
            </TabsContent>
          </Tabs>
        )}
      </PageContainer>
    </>
  );
}

function ClubSnapshot({ insights }: { insights: ClubInsightsResponse }) {
  const { overview, clubs, meta } = insights.data;
  const linkedAccountPercent =
    overview.totalClubs > 0
      ? Math.round((overview.clubsWithAccounts / overview.totalClubs) * 100)
      : 0;
  const clubsWithDates = clubs.filter(
    (club) =>
      club.competitionDateRange?.earliestStartDate &&
      club.competitionDateRange.latestEndDate,
  ).length;

  return (
    <SectionContainer
      title="Club Snapshot"
      description="Current scope and coverage for the selected sport filter."
      action={
        <Badge variant="outline" className="w-fit bg-slate-50">
          {meta.sport}
        </Badge>
      }
      contentClassName="p-0"
    >
      <div className="grid overflow-hidden bg-white sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotMetric
          title="Clubs"
          value={overview.totalClubs.toLocaleString()}
          detail={`${overview.activeClubs.toLocaleString()} active`}
          supporting={`${overview.inactiveClubs.toLocaleString()} inactive`}
          detailLabel="status"
          supportingLabel="status"
          icon={<Building2 className="h-4 w-4" />}
          tone="blue"
        />
        <SnapshotMetric
          title="Linked Accounts"
          value={`${linkedAccountPercent}%`}
          detail={`${overview.clubsWithAccounts.toLocaleString()} linked`}
          supporting={`${overview.clubsWithoutAccounts.toLocaleString()} missing`}
          detailLabel="coverage"
          supportingLabel="gap"
          icon={<Link2 className="h-4 w-4" />}
          tone="emerald"
        />
        <SnapshotMetric
          title="Teams"
          value={meta.dataPoints.teams.toLocaleString()}
          detail={`${overview.averageTeamsPerClub.toFixed(1)} avg per club`}
          supporting={`${meta.dataPoints.associations.toLocaleString()} associations`}
          detailLabel="density"
          supportingLabel="network"
          icon={<Users className="h-4 w-4" />}
          tone="slate"
        />
        <SnapshotMetric
          title="Competitions"
          value={meta.dataPoints.competitions.toLocaleString()}
          detail={`${overview.averageCompetitionsPerClub.toFixed(1)} avg per club`}
          supporting={`${clubsWithDates.toLocaleString()} with timelines`}
          detailLabel="density"
          supportingLabel="timeline"
          icon={
            meta.dataPoints.competitions > 0 ? (
              <Trophy className="h-4 w-4" />
            ) : (
              <CalendarRange className="h-4 w-4" />
            )
          }
          tone="amber"
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.clubs.toLocaleString()} clubs
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.competitions.toLocaleString()} competitions
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.teams.toLocaleString()} teams
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          API time {meta.performance.totalTimeMs}ms
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

function SnapshotStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
