"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { CalendarDays, Gauge } from "lucide-react";

import { useGlobalContext } from "@/components/providers/GlobalContext";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ErrorState, LoadingState } from "@/components/ui-library";
import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { daysFromToday } from "@/lib/utils";
import { TeamFixtures } from "./components/TeamFixtures";
import { TeamSnapshot } from "./components/TeamSnapshot";
import { formatStoredDate } from "./components/teamFixtureModel";

const teamDetailTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "fixtures", label: "Fixtures", icon: CalendarDays },
] as const;

function parseTeamId(value: string | string[] | undefined): number | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === "string" && error.trim()) return new Error(error);
  return new Error("Failed to load team");
}

export default function TeamPage() {
  const params = useParams<{ teamID: string }>();
  const teamId = useMemo(() => parseTeamId(params?.teamID), [params?.teamID]);
  const { strapiLocation } = useGlobalContext();
  const { data: team, isLoading, isError, error, refetch } = useTeamByID(
    teamId ?? 0,
  );

  if (!teamId) {
    return (
      <>
        <CreatePageTitle
          title="Team"
          byLine="Invalid team ID"
          byLineBottom="The route expects a numeric team ID."
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error("Invalid team ID. The route expects a numeric ID.")
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  if (isLoading && !team) {
    return (
      <>
        <CreatePageTitle
          title="Team"
          byLine={`Team ID: ${teamId}`}
          byLineBottom="Loading team data..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading team..." />
        </PageContainer>
      </>
    );
  }

  if (isError || !team) {
    return (
      <>
        <CreatePageTitle
          title="Team"
          byLine={`Team ID: ${teamId}`}
          byLineBottom="Error loading team data"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={toError(error)}
            onRetry={() => {
              void refetch();
            }}
          />
        </PageContainer>
      </>
    );
  }

  const clubName = team.club?.Name?.trim() || "Club not linked";
  const competitionName =
    team.competition?.competitionName?.trim() || "Competition not linked";
  const gradeName = team.grades?.gradeName?.trim() || "Grade not linked";
  const season = team.competition?.season?.trim() || "Season not set";
  const logo = team.club?.ParentLogo || team.association?.ParentLogo || undefined;
  const cmsUrl =
    team.TopLineData.id > 0
      ? `${strapiLocation.team}${team.TopLineData.id}`
      : null;
  const daysSinceUpdate = team.TopLineData.updatedAt
    ? daysFromToday(team.TopLineData.updatedAt)
    : null;

  return (
    <>
      <CreatePageTitle
        title={team.TopLineData.teamName?.trim() || "Team"}
        byLine={`${clubName} • ${competitionName}`}
        byLineBottom={`${gradeName} • ${season} • Last synced ${formatStoredDate(team.TopLineData.updatedAt)}`}
        image={logo}
      />
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {teamDetailTabs.map((tab) => {
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
          <TabsContent value="snapshot" className="mt-0 space-y-6">
            <TeamSnapshot
              team={team}
              cmsUrl={cmsUrl}
              daysSinceUpdate={daysSinceUpdate}
            />
          </TabsContent>
          <TabsContent value="fixtures" className="mt-0">
            <TeamFixtures
              team={team}
              cmsFixtureBase={strapiLocation.fixture.cricket}
            />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
