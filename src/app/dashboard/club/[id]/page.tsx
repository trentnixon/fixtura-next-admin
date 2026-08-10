"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useClubAdminDetail } from "@/hooks/club/useClubAdminDetail";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
                "Invalid club ID. The route expects a numeric ID parameter.",
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

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
        byLine={`${club.sport} - Club ID: ${clubId}`}
        byLineBottom={isFetching ? "Refreshing..." : "Club Admin Detail"}
      />
      <PageContainer padding="md" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full">
          <TabsList variant="primary" className="mb-4">
            <TabsTrigger value="snapshot">Club Snapshot</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="associations">Associations</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshot" className="space-y-6">
            <ClubHeader club={club} statistics={statistics} />
            <StatisticsOverview statistics={statistics} />
          </TabsContent>

          <TabsContent value="competitions">
            <SectionContainer
              title="Competitions"
              description={`${competitions.length} competition(s) this club is involved in, including timeline and participation.`}
            >
              <CompetitionsList competitions={competitions} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="teams">
            <SectionContainer
              title="Teams"
              description={`${teams.length} team(s) for this club with competition and grade context.`}
            >
              <TeamsList teams={teams} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="associations">
            <SectionContainer
              title="Associations"
              description={`${associations.length} association(s) this club participates in.`}
            >
              <AssociationsList associations={associations} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="accounts">
            <SectionContainer
              title="Accounts"
              description={`${accounts.length} account(s) linked to this club and their subscription status.`}
            >
              <AccountsList accounts={accounts} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="insights">
            <SectionContainer
              title="Insights"
              description="Analytics and insights for this club."
            >
              <InsightsSection insights={insights} />
            </SectionContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
