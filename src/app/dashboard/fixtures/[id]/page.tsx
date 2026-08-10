"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState, LoadingState } from "@/components/ui-library";
import { useSingleFixtureDetail } from "@/hooks/fixtures/useSingleFixtureDetail";

import FixtureActionsBar from "./_components/FixtureActionsBar";
import FixtureAdditional from "./_components/FixtureAdditional";
import FixtureMatch from "./_components/FixtureMatch";
import FixtureRelatedEntities from "./_components/FixtureRelatedEntities";
import FixtureSnapshot from "./_components/FixtureSnapshot";
import FixtureValidation from "./_components/FixtureValidation";

export default function FixturePage() {
  const params = useParams<{ id: string }>();

  const fixtureId = useMemo(() => {
    if (!params?.id) return null;
    const id = parseInt(params.id, 10);
    return isNaN(id) ? null : id;
  }, [params?.id]);

  const { data, isLoading, error, refetch } = useSingleFixtureDetail(fixtureId);

  if (isLoading && !data) {
    return (
      <>
        <CreatePageTitle
          title="Fixture Detail"
          byLine={`Fixture ID: ${fixtureId || "Loading..."}`}
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading fixture detail..." />
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CreatePageTitle
          title="Fixture Detail"
          byLine={`Fixture ID: ${fixtureId || "Invalid"}`}
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              error instanceof Error
                ? error
                : new Error("Failed to load fixture detail")
            }
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  if (!fixtureId || !data) {
    return (
      <>
        <CreatePageTitle title="Fixture Detail" byLine="Invalid Fixture ID" />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error(
                "Invalid fixture ID. Please provide a valid numeric ID.",
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  const renderIds = data.renderStatus
    ? [
        ...data.renderStatus.upcomingGamesRenders.map((render) => render.id),
        ...data.renderStatus.gameResultsRenders.map((render) => render.id),
      ]
    : [];
  const titleContext = data.grade
    ? [
        data.grade.gradeName,
        data.grade.association ? data.grade.association.name : null,
      ]
        .filter(Boolean)
        .join(" - ")
    : "Fixture Details";

  return (
    <>
      <CreatePageTitle
        title={`Fixture #${fixtureId}`}
        byLine={`${data.fixture.round || "Fixture"} - ${data.fixture.type}`}
        byLineBottom={titleContext}
      />
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <TabsList variant="primary">
              <TabsTrigger value="snapshot">Fixture Snapshot</TabsTrigger>
              <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="related">Related</TabsTrigger>
            </TabsList>

            <FixtureActionsBar
              fixtureId={fixtureId}
              scorecardUrl={data.fixture.matchDetails.urlToScoreCard}
              clubs={data.club.map((club) => ({
                id: club.id,
                name: club.name,
              }))}
              renderIds={renderIds}
            />
          </div>

          <TabsContent value="snapshot">
            <FixtureSnapshot data={data} />
          </TabsContent>

          <TabsContent value="scorecard">
            <FixtureMatch data={data} />
          </TabsContent>

          <TabsContent value="validation">
            <FixtureValidation data={data} />
          </TabsContent>

          <TabsContent value="related" className="space-y-6">
            <FixtureRelatedEntities data={data} />
            <FixtureAdditional data={data} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
