"use client";

import { useState } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useClubInsights } from "@/hooks/club/useClubInsights";
import { ClubSportFilter } from "@/types/clubInsights";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SportFilter from "./components/SportFilter";
import { ClubGanttSection } from "./components/ClubGanttSection";
import ClubsTable from "./components/ClubsTable";
import OverviewStatsCard from "./components/OverviewStatsCard";
import DistributionsCard from "./components/DistributionsCard";
import TeamsInsightsCard from "./components/TeamsInsightsCard";
import AccountsInsightsCard from "./components/AccountsInsightsCard";
import CompetitionTimelineCard from "./components/CompetitionTimelineCard";

export default function ClubData() {
  const [selectedSport, setSelectedSport] =
    useState<ClubSportFilter>("Cricket");
  const { data, isLoading, error, refetch } = useClubInsights(selectedSport);

  return (
    <>
      <CreatePageTitle
        title="Club Data"
        byLine="Lookup and insights for clubs"
        byLineBottom="Data integration in progress"
      />
      <PageContainer padding="md" spacing="lg">
        {/* Sport Filter */}
        <SportFilter
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
        />

        {/* Tabs for Table and Gantt Chart */}
        {data?.data?.clubs && (
          <Tabs defaultValue="table">
            <TabsList variant="secondary">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="gantt">
              {/* Club Gantt Chart Section */}
              <ClubGanttSection clubs={data.data.clubs} />
            </TabsContent>
            <TabsContent value="table">
              {/* Clubs Table Section */}
              {data.data.clubs && data.data.clubs.length > 0 && (
                <SectionContainer
                  title="Clubs"
                  description="Complete list of all clubs for the selected sport"
                >
                  <ClubsTable clubs={data.data.clubs} />
                </SectionContainer>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Loading State */}
        {isLoading && (
          <SectionContainer title="Loading">
            <LoadingState message="Loading club insights..." />
          </SectionContainer>
        )}

        {/* Error State */}
        {error && (
          <SectionContainer title="Error">
            <ErrorState
              error={error}
              title="Failed to load club insights"
              onRetry={() => refetch()}
            />
          </SectionContainer>
        )}

        {/* Content Sections - Only show when data is loaded */}
        {data?.data && (
          <>
            {/* Overview Statistics Section */}
            {data.data.overview && (
              <SectionContainer
                title="Overview Statistics"
                description="High-level club statistics and metrics"
              >
                <OverviewStatsCard data={data.data.overview} />
              </SectionContainer>
            )}

            {/* Distributions Section */}
            {data.data.distributions && (
              <SectionContainer
                title="Distributions"
                description="Club distributions by teams, competitions, associations, and account coverage"
              >
                <DistributionsCard data={data.data.distributions} />
              </SectionContainer>
            )}

            {/* Teams Insights Section */}
            {data.data.teams && (
              <SectionContainer
                title="Teams Insights"
                description="Team statistics across all clubs"
              >
                <TeamsInsightsCard data={data.data.teams} />
              </SectionContainer>
            )}

            {/* Accounts Insights Section */}
            {data.data.accounts && (
              <SectionContainer
                title="Accounts Insights"
                description="Account statistics and coverage across clubs"
              >
                <AccountsInsightsCard data={data.data.accounts} />
              </SectionContainer>
            )}

            {/* Competition Timeline Section */}
            {data.data.insights?.competitionTimeline &&
              data.data.insights.competitionTimeline.length > 0 && (
                <SectionContainer
                  title="Competition Timeline"
                  description="Monthly breakdown of competition activity"
                >
                  <CompetitionTimelineCard
                    data={data.data.insights.competitionTimeline}
                  />
                </SectionContainer>
              )}
          </>
        )}
      </PageContainer>
    </>
  );
}
