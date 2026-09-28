"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { ClipboardCheck, Gauge, RefreshCcw } from "lucide-react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { ErrorState, LoadingState } from "@/components/ui-library";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { useSingleFixtureDetail } from "@/hooks/fixtures/useSingleFixtureDetail";

import FixtureScorecardSection from "./_components/FixtureScorecardSection";
import FixtureSnapshot from "./_components/FixtureSnapshot";
import FixtureValidation from "./_components/FixtureValidation";

const fixtureDetailTabs = [
  { value: "match", label: "Match", icon: Gauge },
  { value: "validation", label: "Validation", icon: ClipboardCheck },
] as const;

function formatTitleDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
}

export default function FixturePage() {
  const params = useParams<{ id: string }>();

  const fixtureId = useMemo(() => {
    if (!params?.id) return null;
    const id = parseInt(params.id, 10);
    return isNaN(id) ? null : id;
  }, [params?.id]);

  const { data, isLoading, isFetching, error, refetch } =
    useSingleFixtureDetail(fixtureId);

  if (isLoading && !data) {
    return <LoadingState message="Loading fixture detail..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load fixture detail"
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load fixture detail")
        }
        onRetry={() => refetch()}
      />
    );
  }

  if (!fixtureId || !data) {
    return (
      <ErrorState
        error={
          new Error(
            "Invalid fixture ID. Please provide a valid numeric ID.",
          )
        }
        onRetry={() => window.location.reload()}
      />
    );
  }

  const { fixture, grade, club, context } = data;
  const homeName =
    club[0]?.name ?? toFixtureDisplayText(fixture.teams.home.name, "Home");
  const awayName =
    club[1]?.name ?? toFixtureDisplayText(fixture.teams.away.name, "Away");

  const titleContext = grade
    ? [grade.gradeName, grade.association?.name].filter(Boolean).join(" · ")
    : "Fixture details";

  return (
    <>
      <CreatePageTitle
        title={`${homeName} vs ${awayName}`}
        byLine={`${toFixtureDisplayText(fixture.round, "Fixture")} · ${toFixtureDisplayText(fixture.type)}`}
        byLineBottom={
          isFetching
            ? "Refreshing fixture data…"
            : `${titleContext} · Last updated ${formatTitleDate(
                context.admin.updatedAt,
              )}`
        }
      >
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isFetching}
          className={cn(siteNavigationCtaClass, "shrink-0")}
        >
          <RefreshCcw
            className={cn(
              "h-4 w-4 shrink-0 text-current",
              isFetching && "animate-spin",
            )}
            aria-hidden
          />
          Refresh
        </Button>
      </CreatePageTitle>
      <PageContainer
        padding="xs"
        spacing="lg"
        className={cn(isFetching && "opacity-95 transition-opacity")}
        aria-busy={isFetching}
      >
        <Tabs defaultValue="match" className="w-full min-w-0 max-w-full">
          <div className="pb-8">
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
          </div>

          <TabsContent value="match" className="mt-0 space-y-6">
            <FixtureSnapshot data={data} fixtureId={fixtureId} />
            <FixtureScorecardSection data={data} />
          </TabsContent>

          <TabsContent value="validation" className="mt-0 space-y-6">
            <FixtureValidation data={data} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
