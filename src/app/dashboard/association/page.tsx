"use client";

import { useState } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useAssociationInsights } from "@/hooks/association/useAssociationInsights";
import { SportFilter } from "@/types/associationInsights";

// Component imports
import DataWrapper from "./components/DataWrapper";
import SportFilterComponent from "./components/SportFilter";
import OverviewStatsCard from "./components/OverviewStatsCard";
import GradesAndClubsStatsCard from "./components/GradesAndClubsStatsCard";
import CompetitionStatsCard from "./components/CompetitionStatsCard";
import AssociationsTable from "./components/AssociationsTable";
import { AssociationGanttSection } from "./components/AssociationGanttSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AssociationData() {
  const [selectedSport, setSelectedSport] = useState<SportFilter | undefined>(
    "Cricket"
  );
  const { data, isLoading, error, refetch } =
    useAssociationInsights(selectedSport);

  return (
    <>
      <CreatePageTitle
        title="Association Data"
        byLine="Lookup and insights for associations"
        byLineBottom="Comprehensive analytics and metrics"
      />
      <PageContainer padding="md" spacing="lg">
        <DataWrapper
          isLoading={isLoading}
          error={error}
          data={data}
          onRetry={() => refetch()}
        >
          {/* 1. Sport Filter Section */}
          <SportFilterComponent
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
          />

          <Tabs defaultValue="table">
            <TabsList variant="secondary">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="gantt">
              {/* 2. Association Gantt Chart Section */}
              {data?.data?.associations && (
                <AssociationGanttSection
                  associations={data.data.associations}
                />
              )}
            </TabsContent>
            <TabsContent value="table">
              {/* 3. Associations Table Section */}
              {data?.data?.associations && (
                <SectionContainer
                  title="Associations"
                  description="Detailed per-association metrics and data"
                >
                  <AssociationsTable associations={data.data.associations} />
                </SectionContainer>
              )}
            </TabsContent>
          </Tabs>

          {/* 4. Overview Section */}
          {data?.data?.overview && (
            <SectionContainer
              title="Overview"
              description="High-level association statistics and distributions"
            >
              <OverviewStatsCard data={data.data.overview} />
            </SectionContainer>
          )}

          {/* 5. Grades & Clubs Section */}
          {data?.data?.gradesAndClubs && (
            <SectionContainer
              title="Grades & Clubs"
              description="Analytics for grades and clubs across all associations"
            >
              <GradesAndClubsStatsCard data={data.data.gradesAndClubs} />
            </SectionContainer>
          )}

          {/* 6. Competitions Section */}
          {data?.data?.competitions && (
            <SectionContainer
              title="Competitions"
              description="Competition analytics and distributions"
            >
              <div className="space-y-4">
                <CompetitionStatsCard data={data.data.competitions} />
              </div>
            </SectionContainer>
          )}
        </DataWrapper>
      </PageContainer>
    </>
  );
}
