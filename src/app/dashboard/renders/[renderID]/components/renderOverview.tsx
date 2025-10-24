"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useParams } from "next/navigation";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Database,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  FileDown,
} from "lucide-react";

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
  } = useRendersQuery(renderID as string);

  const {
    data: Downloads,
    isLoading: downloadsLoading,
    isError: downloadsError,
    error: downloadsQueryError,
  } = useDownloadsQuery(renderID as string);

  // UI: Loading and Error States
  if (isLoading || downloadsLoading) return <p>Loading render data...</p>;
  if (isError || downloadsError) {
    return (
      <div>
        <p>
          Error loading render data: {error?.message}{" "}
          {downloadsQueryError?.message}
        </p>
      </div>
    );
  }
  return (
    <>
      {/* Main Content */}
      <div className="grid grid-cols-12 gap-4 mb-16">
        {/* Scheduler Info */}
        <div className="col-span-4 space-y-4">
          <Card className="bg-slate-50 border-b-4 border-b-slate-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Scheduler Info
              </CardTitle>
              <Calendar className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Scheduler
                  </span>
                  <span className="font-medium">
                    {render?.scheduler.data.attributes.Name} :{" "}
                    {render?.scheduler.data.id}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Queued</span>
                  <div className="flex items-center space-x-1">
                    {render?.scheduler.data.attributes.Queued ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="font-medium">
                      {render?.scheduler.data.attributes.Queued ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Is Rendering
                  </span>
                  <div className="flex items-center space-x-1">
                    {render?.scheduler.data.attributes.isRendering ? (
                      <Play className="h-4 w-4 text-green-500" />
                    ) : (
                      <Pause className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium">
                      {render?.scheduler.data.attributes.isRendering
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Nested Data Overview */}
        <div className="col-span-8 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {/* Updated At */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Updated At
                </CardTitle>
                <Clock className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {render?.updatedAt ? formatDate(render.updatedAt) : "N/A"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last modification
                </p>
              </CardContent>
            </Card>

            {/* Published At */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published At
                </CardTitle>
                <Calendar className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {render?.publishedAt && render.publishedAt !== null
                    ? formatDate(render.publishedAt)
                    : "Not Published"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {render?.publishedAt && render.publishedAt !== null
                    ? "Publication date"
                    : "Render not yet published"}
                </p>
              </CardContent>
            </Card>

            {/* Downloads */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <FileDown className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {Downloads?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available downloads
                </p>
              </CardContent>
            </Card>

            {/* Game Results */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Game Results
                </CardTitle>
                <Database className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {gameResults.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Results in render
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Games */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Games
                </CardTitle>
                <Clock className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {upcomingGames.length}
                </div>
                <p className="text-xs text-muted-foreground">Scheduled games</p>
              </CardContent>
            </Card>

            {/* Grades */}
            <Card className="bg-slate-50 border-b-4 border-b-slate-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Grades</CardTitle>
                <Database className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-600">
                  {grades.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Grades in render
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
