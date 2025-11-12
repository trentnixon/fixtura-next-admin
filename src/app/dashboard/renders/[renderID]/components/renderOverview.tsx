"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useParams } from "next/navigation";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { Clock, Database, FileDown } from "lucide-react";

export default function RenderOverview() {
  const { renderID } = useParams();

  // Fetch data
  const {
    data: render,
    gameResults,
    upcomingGames,
    grades,
    isLoading,
    isError,
    error,
    isFetching,
    refetch: refetchRender,
  } = useRendersQuery(renderID as string);

  const {
    data: Downloads,
    isLoading: downloadsLoading,
    isError: downloadsError,
  } = useDownloadsQuery(renderID as string);

  // UI: Loading State - Show loading if main render query is loading and no data
  if (isLoading && !render) {
    return <LoadingState message="Loading render data…" />;
  }

  // UI: Error State - Show error if main render query has error
  if (isError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load render data"
        error={error}
        onRetry={() => refetchRender()}
      />
    );
  }

  // UI: Empty State - Show empty if no render data
  if (!render) {
    return (
      <EmptyState
        variant="card"
        title="Render not found"
        description="The requested render could not be located."
      />
    );
  }
  return (
    <>
      {/* Show minimal loading state when refetching in background */}
      {isFetching && render && (
        <LoadingState variant="minimal" message="Refreshing data…" />
      )}

      {/* Main Content - Metrics Grid */}
      <MetricGrid columns={4} gap="md">
        {/* Downloads */}
        <StatCard
          title="Downloads"
          value={
            downloadsLoading
              ? "…"
              : downloadsError
              ? "Error"
              : Downloads?.length || 0
          }
          description={
            downloadsLoading
              ? "Loading downloads…"
              : downloadsError
              ? "Error loading downloads"
              : "Available files"
          }
          icon={<FileDown className="h-5 w-5" />}
          variant="primary"
        />

        {/* Game Results */}
        <StatCard
          title="Game Results"
          value={gameResults.length}
          description="Results in render"
          icon={<Database className="h-5 w-5" />}
          variant="secondary"
        />

        {/* Upcoming Games */}
        <StatCard
          title="Upcoming Games"
          value={upcomingGames.length}
          description="Scheduled games"
          icon={<Clock className="h-5 w-5" />}
          variant="accent"
        />

        {/* Grades */}
        <StatCard
          title="Grades"
          value={grades.length}
          description="Grades in render"
          icon={<Database className="h-5 w-5" />}
          variant="light"
        />
      </MetricGrid>
    </>
  );
}
