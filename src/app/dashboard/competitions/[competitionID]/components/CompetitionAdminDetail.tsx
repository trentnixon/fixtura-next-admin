"use client";

import { useParams } from "next/navigation";

import { useCompetitionAdminDetail } from "@/hooks/competitions/useCompetitionAdminDetail";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { SnapshotSection } from "./CompetitionAdminDetail/sections/SnapshotSection";
import { AssociationInsightsSection } from "./CompetitionAdminDetail/sections/AssociationOverviewSection";
import { AnalyticsSection } from "./CompetitionAdminDetail/sections/AnalyticsSection";
import { GradesSection } from "./CompetitionAdminDetail/sections/GradesSection";
import { TeamsSection } from "./CompetitionAdminDetail/sections/TeamsSection";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function CompetitionAdminDetail() {
  const { competitionID } = useParams<{ competitionID: string }>();
  const competitionId = Number(competitionID);
  const { strapiLocation } = useGlobalContext();

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminDetail(
      Number.isNaN(competitionId) ? undefined : competitionId
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

  return (
    <>
      <CreatePageTitle
        title={meta.name}
        byLine={
          association
            ? `${association.name} • ${meta.season ?? "Season unknown"}`
            : meta.season ?? "Season unknown"
        }
        byLineBottom={`Status: ${meta.status} • Last synced ${formatDate(
          meta.lastSyncedAt
        )}`}
      />

      <PageContainer padding="xs" spacing="lg">
        <SnapshotSection
          meta={meta}
          counts={counts}
          accountCoverage={analytics.summary.accountCoverage}
          timeline={analytics.summary.timeline}
          strapiLocation={strapiLocation}
          isFetching={isFetching}
          associationId={association?.id ?? null}
        />
        <AssociationInsightsSection
          association={association}
          insights={analytics.insights}
        />

        <TeamsSection teams={analytics.tables.teams} clubs={clubs} />

        <AnalyticsSection analytics={analytics} />

        <GradesSection grades={grades} />
      </PageContainer>
    </>
  );
}
