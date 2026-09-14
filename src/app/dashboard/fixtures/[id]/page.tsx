"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  ClipboardCheck,
  Gauge,
  Link2,
  Trophy,
} from "lucide-react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { ErrorState, LoadingState } from "@/components/ui-library";
import { useSingleFixtureDetail } from "@/hooks/fixtures/useSingleFixtureDetail";

import FixtureActionsBar from "./_components/FixtureActionsBar";
import FixtureAdditional from "./_components/FixtureAdditional";
import FixtureMatch from "./_components/FixtureMatch";
import FixtureRelatedEntities from "./_components/FixtureRelatedEntities";
import FixtureSnapshot from "./_components/FixtureSnapshot";
import FixtureValidation from "./_components/FixtureValidation";

const fixtureDetailTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "scorecard", label: "Scorecard", icon: Trophy },
  { value: "validation", label: "Validation", icon: ClipboardCheck },
  { value: "related", label: "Related", icon: Link2 },
] as const;

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
          title="Fixture detail"
          byLine={`Fixture ID: ${fixtureId || "Loading…"}`}
        />
        <PageContainer padding="xs" spacing="lg">
          <SectionContainer title="Loading">
            <LoadingState message="Loading fixture detail..." />
          </SectionContainer>
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CreatePageTitle
          title="Fixture detail"
          byLine={`Fixture ID: ${fixtureId || "Invalid"}`}
        />
        <PageContainer padding="xs" spacing="lg">
          <SectionContainer title="Error">
            <ErrorState
              error={
                error instanceof Error
                  ? error
                  : new Error("Failed to load fixture detail")
              }
              title="Failed to load fixture detail"
              onRetry={() => refetch()}
            />
          </SectionContainer>
        </PageContainer>
      </>
    );
  }

  if (!fixtureId || !data) {
    return (
      <>
        <CreatePageTitle title="Fixture detail" byLine="Invalid fixture ID" />
        <PageContainer padding="xs" spacing="lg">
          <SectionContainer title="Error">
            <ErrorState
              error={
                new Error(
                  "Invalid fixture ID. Please provide a valid numeric ID.",
                )
              }
              onRetry={() => window.location.reload()}
            />
          </SectionContainer>
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
        .join(" · ")
    : "Fixture details";

  return (
    <>
      <CreatePageTitle
        title={`Fixture #${fixtureId}`}
        byLine={`${data.fixture.round || "Fixture"} · ${data.fixture.type}`}
        byLineBottom={titleContext}
      />
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
          <div className="flex flex-col gap-4 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <TabsList variant="primary" className={sectionTabListClass}>
              {fixtureDetailTabs.map((tab) => {
                const Icon = tab.icon;

                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    variant="section"
                    className={sectionTabTriggerClass}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-current"
                      aria-hidden
                    />
                    {tab.label}
                  </TabsTrigger>
                );
              })}
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

          <TabsContent value="snapshot" className="mt-0">
            <FixtureSnapshot data={data} />
          </TabsContent>

          <TabsContent value="scorecard" className="mt-0">
            <FixtureMatch data={data} />
          </TabsContent>

          <TabsContent value="validation" className="mt-0">
            <FixtureValidation data={data} />
          </TabsContent>

          <TabsContent value="related" className="mt-0 space-y-6">
            <FixtureRelatedEntities data={data} />
            <FixtureAdditional data={data} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
