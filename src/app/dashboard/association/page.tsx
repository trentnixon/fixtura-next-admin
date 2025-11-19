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
import CompetitionDatePatternsCard from "./components/CompetitionDatePatternsCard";
import AssociationsTable from "./components/AssociationsTable";

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

          {/* 5. Associations Table Section */}
          {data?.data?.associations && (
            <SectionContainer
              title="Associations"
              description="Detailed per-association metrics and data"
            >
              <AssociationsTable associations={data.data.associations} />
            </SectionContainer>
          )}

          {/* 2. Overview Section */}
          {data?.data?.overview && (
            <SectionContainer
              title="Overview"
              description="High-level association statistics and distributions"
            >
              <OverviewStatsCard data={data.data.overview} />
            </SectionContainer>
          )}

          {/* 3. Grades & Clubs Section */}
          {data?.data?.gradesAndClubs && (
            <SectionContainer
              title="Grades & Clubs"
              description="Analytics for grades and clubs across all associations"
            >
              <GradesAndClubsStatsCard data={data.data.gradesAndClubs} />
            </SectionContainer>
          )}

          {/* 4. Competitions Section */}
          {data?.data?.competitions && (
            <SectionContainer
              title="Competitions"
              description="Competition analytics and distributions"
            >
              <div className="space-y-4">
                <CompetitionStatsCard data={data.data.competitions} />
                <CompetitionDatePatternsCard
                  data={data.data.competitions.datePatterns}
                />
              </div>
            </SectionContainer>
          )}
        </DataWrapper>
      </PageContainer>
    </>
  );
}
