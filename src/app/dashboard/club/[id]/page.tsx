"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useClubAdminDetail } from "@/hooks/club/useClubAdminDetail";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ClubHeader from "./components/ClubHeader";
import StatisticsOverview from "./components/StatisticsOverview";
import AssociationsList from "./components/AssociationsList";
import TeamsList from "./components/TeamsList";
import CompetitionsList from "./components/CompetitionsList";
import AccountsList from "./components/AccountsList";
import InsightsSection from "./components/InsightsSection";

export default function ClubAdminDetailPage() {
  const params = useParams<{ id: string }>();

  const clubId = useMemo(() => {
    if (!params?.id) return null;
    const parsed = parseInt(params.id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [params?.id]);

  const { data, isLoading, error, refetch, isFetching } =
    useClubAdminDetail(clubId);

  // Invalid ID
  if (!clubId) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine="Invalid Club ID"
          byLineBottom="Please provide a valid numeric club ID in the URL."
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error(
                "Invalid club ID. The route expects a numeric ID parameter."
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  // Loading
  if (isLoading && !data) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine={`Club ID: ${clubId}`}
          byLineBottom="Loading club data..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading club admin detail..." />
        </PageContainer>
      </>
    );
  }

  // Error
  if (error) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine={`Club ID: ${clubId}`}
          byLineBottom="Error loading club data"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              error instanceof Error
                ? error
                : new Error("Failed to load club admin detail")
            }
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  if (!data?.data) {
    return null;
  }

  const {
    club,
    statistics,
    associations,
    teams,
    competitions,
    accounts,
    insights,
  } = data.data;

  return (
    <>
      <CreatePageTitle
        title={club.name}
        byLine={`${club.sport} • Club ID: ${clubId}`}
        byLineBottom={isFetching ? "Refreshing..." : "Club Admin Detail"}
      />
      <PageContainer padding="md" spacing="lg">
        {/* 1. Club Header */}
        <ClubHeader club={club} />

        {/* 2. Statistics Overview */}
        <StatisticsOverview statistics={statistics} />

        {/* 3. Associations */}
        <SectionContainer
          title="Associations"
          description="Associations this club participates in, with competition and team counts."
        >
          <AssociationsList associations={associations} />
        </SectionContainer>

        {/* 4. Teams */}
        <SectionContainer
          title="Teams"
          description="Teams for this club with competition and grade context."
        >
          <TeamsList teams={teams} />
        </SectionContainer>

        {/* 5. Competitions */}
        <SectionContainer
          title="Competitions"
          description="Competitions this club is involved in, including timeline and participation."
        >
          <CompetitionsList competitions={competitions} />
        </SectionContainer>

        {/* 6. Accounts */}
        <SectionContainer
          title="Accounts"
          description="Accounts linked to this club and their subscription status."
        >
          <AccountsList accounts={accounts} />
        </SectionContainer>

        {/* 7. Insights */}
        <SectionContainer
          title="Insights"
          description="Analytics and insights for this club (visualisation to be iterated in later phases)."
        >
          <InsightsSection insights={insights} />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
