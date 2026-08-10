"use client";

import { useParams } from "next/navigation";

import { useCompetitionAdminDetail } from "@/hooks/competitions/useCompetitionAdminDetail";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { SnapshotSection } from "./CompetitionAdminDetail/sections/SnapshotSection";
import { toAssociationAccountOptionFromCompetition } from "@/utils/associationAccountSelection";
import { AssociationInsightsSection } from "./CompetitionAdminDetail/sections/AssociationOverviewSection";
import { AnalyticsSection } from "./CompetitionAdminDetail/sections/AnalyticsSection";
import { GradesSection } from "./CompetitionAdminDetail/sections/GradesSection";
import { TeamsSection } from "./CompetitionAdminDetail/sections/TeamsSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
}

export default function CompetitionAdminDetail() {
  const { competitionID } = useParams<{ competitionID: string }>();
  const competitionId = Number(competitionID);
  const { strapiLocation } = useGlobalContext();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminDetail(
      Number.isNaN(competitionId) ? undefined : competitionId,
    );

  if (isLoading && !data) {
    return <LoadingState message="Loading competition detail..." />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load competition detail.")
        }
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return null;
  }

  const { meta, association, counts, analytics, grades, clubs } = data;

  const associationAccounts = (association?.accounts ?? []).map(
    toAssociationAccountOptionFromCompetition,
  );

  return (
    <>
      <CreatePageTitle
        title={meta.name}
        byLine={
          association
            ? `${association.name} • ${meta.season ?? "Season unknown"}`
            : (meta.season ?? "Season unknown")
        }
        byLineBottom={`Status: ${meta.status} • Last synced ${formatDate(
          meta.lastSyncedAt,
        )}`}
      />

      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full">
          <TabsList variant="primary" className="mb-4">
            <TabsTrigger value="snapshot">Competition Snapshot</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="snapshot" className="space-y-6">
            <SnapshotSection
              meta={meta}
              counts={counts}
              accountCoverage={analytics.summary.accountCoverage}
              timeline={analytics.summary.timeline}
              strapiLocation={strapiLocation}
              isFetching={isFetching}
              associationAccounts={associationAccounts}
              associationId={association?.id ?? null}
            />
            <AssociationInsightsSection association={association} />
            <AnalyticsSection analytics={analytics} />
          </TabsContent>

          <TabsContent value="grades">
            <GradesSection grades={grades} />
          </TabsContent>

          <TabsContent value="teams">
            <TeamsSection teams={analytics.tables.teams} clubs={clubs} />
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
