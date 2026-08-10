"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useAssociationDetail } from "@/hooks/association/useAssociationDetail";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssociationHeader from "./components/AssociationHeader";
import StatisticsOverview from "./components/StatisticsOverview";
import CompetitionsList from "./components/CompetitionsList";
import ClubsList from "./components/ClubsList";
import AccountsList from "./components/AccountsList";
import InsightsSection from "./components/InsightsSection";

export default function AssociationDetailPage() {
  const params = useParams<{ id: string }>();

  // Convert id from route params to number
  const associationId = useMemo(() => {
    if (!params?.id) return null;
    const id = parseInt(params.id, 10);
    return isNaN(id) ? null : id;
  }, [params?.id]);

  const { data, isLoading, error, refetch, isFetching } =
    useAssociationDetail(associationId);

  // Loading state
  if (isLoading && !data) {
    return (
      <>
        <CreatePageTitle
          title="Association Detail"
          byLine="Loading association data..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading association detail..." />
        </PageContainer>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <CreatePageTitle
          title="Association Detail"
          byLine={`Association ID: ${associationId || "Invalid"}`}
          byLineBottom="Error loading association data"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              error instanceof Error
                ? error
                : new Error("Failed to load association detail")
            }
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  // Invalid ID state
  if (!associationId) {
    return (
      <>
        <CreatePageTitle
          title="Association Detail"
          byLine="Invalid Association ID"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error(
                "Invalid association ID. Please provide a valid numeric ID.",
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  // Success state - display components
  if (!data?.data) {
    return null;
  }

  const { association, statistics, competitions, clubs, accounts, insights } =
    data.data;

  return (
    <>
      <CreatePageTitle
        title={association.name}
        byLine={`${association.sport} • Association ID: ${associationId}`}
        byLineBottom={isFetching ? "Refreshing..." : "Association Detail"}
      />
      <PageContainer padding="md" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full">
          <TabsList variant="primary" className="mb-4">
            <TabsTrigger value="snapshot">Association Snapshot</TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
            <TabsTrigger value="clubs">Clubs</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshot" className="space-y-6">
            <AssociationHeader
              association={association}
              associationId={associationId}
            />
            <StatisticsOverview statistics={statistics} />
          </TabsContent>

          <TabsContent value="competitions">
            <SectionContainer
              title="Competitions"
              description={`${competitions.length} competition(s) with timeline and details`}
            >
              <CompetitionsList competitions={competitions} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="clubs">
            <SectionContainer
              title="Clubs"
              description={`${clubs.length} club(s) participating in this association`}
            >
              <ClubsList clubs={clubs} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="accounts">
            <SectionContainer
              title="Accounts"
              description={`${accounts.length} account(s) associated with this association`}
            >
              <AccountsList accounts={accounts} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="insights">
            <SectionContainer
              title="Insights"
              description="Analytics and insights (Phase 8 - Coming Soon)"
            >
              <InsightsSection insights={insights} />
            </SectionContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
