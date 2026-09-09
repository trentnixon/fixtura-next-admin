"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { Clock, Database, FileDown, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";

export default function RenderOverview() {
  const { renderID } = useParams();
  const renderId = renderID as string;

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
  } = useRendersQuery(renderId);

  const {
    data: downloads,
    isLoading: downloadsLoading,
    isError: downloadsError,
  } = useDownloadsQuery(renderId);

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "downloads",
        label: "Downloads",
        value: downloadsLoading
          ? "—"
          : downloadsError
            ? "—"
            : String(downloads?.length ?? 0),
        meta: downloadsError ? "Error loading downloads" : "Available files",
        isLoading: downloadsLoading,
      },
      {
        id: "game-results",
        label: "Game results",
        value: String(gameResults.length),
        meta: "Results in render",
        isLoading,
      },
      {
        id: "upcoming-games",
        label: "Upcoming games",
        value: String(upcomingGames.length),
        meta: "Scheduled fixtures",
        isLoading,
      },
      {
        id: "grades",
        label: "Grades",
        value: String(grades.length),
        meta: "Grades in render",
        isLoading,
      },
    ];
  }, [
    downloads?.length,
    downloadsError,
    downloadsLoading,
    gameResults.length,
    grades.length,
    isLoading,
    upcomingGames.length,
  ]);

  if (isLoading && !render) {
    return <LoadingState variant="default" message="Loading render snapshot…" />;
  }

  if (isError) {
    return (
      <ErrorState
        variant="default"
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

  const statusBadge = render.Complete ? (
    <Badge variant="secondary" className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-800">
      Complete
    </Badge>
  ) : render.Processing ? (
    <Badge variant="outline" className="gap-1 border-amber-200 text-amber-800">
      Processing
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1">
      In progress
    </Badge>
  );

  return (
    <div className="space-y-4">
      {isFetching ? (
        <LoadingState variant="minimal" message="Refreshing data…" />
      ) : null}
      <OverviewDataWorkspace
        title="Render snapshot"
        description="Compact totals for generated assets and fixture data"
        icon={Database}
        badge={statusBadge}
        metrics={metrics}
        columns={4}
        footer={
          <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <FileDown className="h-3.5 w-3.5" aria-hidden />
              Generated assets
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              Fixture coverage
            </span>
            <span className="inline-flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" aria-hidden />
              Grade scope
            </span>
          </span>
        }
      />
    </div>
  );
}
