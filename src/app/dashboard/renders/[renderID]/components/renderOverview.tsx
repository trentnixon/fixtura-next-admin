"use client";

import { useParams } from "next/navigation";
import { Clock, Database, FileDown } from "lucide-react";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";

export default function RenderOverview() {
  const { renderID } = useParams();

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
    data: downloads,
    isLoading: downloadsLoading,
    isError: downloadsError,
  } = useDownloadsQuery(renderID as string);

  if (isLoading && !render) {
    return <LoadingState message="Loading render data..." />;
  }

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

  if (!render) {
    return (
      <EmptyState
        variant="card"
        title="Render not found"
        description="The requested render could not be located."
      />
    );
  }

  const metrics = [
    {
      label: "Downloads",
      value: downloadsLoading
        ? "..."
        : downloadsError
          ? "Error"
          : downloads?.length || 0,
      detail: downloadsError ? "Error loading downloads" : "Available files",
      icon: <FileDown className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Game Results",
      value: gameResults.length,
      detail: "Results in render",
      icon: <Database className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: "Upcoming Games",
      value: upcomingGames.length,
      detail: "Scheduled games",
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      label: "Grades",
      value: grades.length,
      detail: "Grades in render",
      icon: <Database className="h-4 w-4 text-slate-500" />,
    },
  ];

  return (
    <SectionContainer
      title="Render Snapshot"
      description="Compact totals for generated assets and fixture data."
    >
      {isFetching && render && (
        <LoadingState variant="minimal" message="Refreshing data..." />
      )}
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase text-muted-foreground">
                {metric.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-900">
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.detail}</p>
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              {metric.icon}
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
