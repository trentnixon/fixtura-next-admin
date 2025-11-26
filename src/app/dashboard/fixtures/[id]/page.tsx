"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { LoadingState, ErrorState } from "@/components/ui-library";
import { useSingleFixtureDetail } from "@/hooks/fixtures/useSingleFixtureDetail";

import FixtureValidation from "./_components/FixtureValidation";
import FixtureMatch from "./_components/FixtureMatch";
import FixtureActionsBar from "./_components/FixtureActionsBar";

export default function FixturePage() {
  const params = useParams<{ id: string }>();

  const fixtureId = useMemo(() => {
    if (!params?.id) return null;
    const id = parseInt(params.id, 10);
    return isNaN(id) ? null : id;
  }, [params?.id]);

  const { data, isLoading, error, refetch } = useSingleFixtureDetail(fixtureId);

  // Loading state
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

  // Error state
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

  // Invalid ID state
  if (!fixtureId || !data) {
    return (
      <>
        <CreatePageTitle title="Fixture Detail" byLine="Invalid Fixture ID" />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error(
                "Invalid fixture ID. Please provide a valid numeric ID."
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  // Prepare render IDs for actions bar
  const renderIds = data.renderStatus
    ? [
        ...data.renderStatus.upcomingGamesRenders.map((r) => r.id),
        ...data.renderStatus.gameResultsRenders.map((r) => r.id),
      ]
    : [];

  return (
    <>
      <CreatePageTitle
        title={`Fixture #${fixtureId}`}
        byLine={`${data.fixture.round || "Fixture"} - ${data.fixture.type}`}
        byLineBottom={
          data.grade
            ? `${data.grade.gradeName}${
                data.grade.association
                  ? ` • ${data.grade.association.name}`
                  : ""
              }`
            : "Fixture Details"
        }
      />
      <PageContainer padding="md" spacing="lg">
        {/* Quick Actions Bar */}
        <FixtureActionsBar
          scorecardUrl={data.fixture.matchDetails.urlToScoreCard}
          clubs={data.club.map((c) => ({ id: c.id, name: c.name }))}
          renderIds={renderIds}
          data={data}
        />

        {/* Teams, Clubs & Scorecard */}
        <FixtureMatch data={data} />

        {/* Game Validity */}
        <FixtureValidation data={data} />

        {/* Additional Content (Renders, Admin) */}
        {/* <FixtureAdditional data={data} /> */}
      </PageContainer>
    </>
  );
}
