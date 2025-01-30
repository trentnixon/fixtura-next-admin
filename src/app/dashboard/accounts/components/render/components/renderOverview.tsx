"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";

import { useParams } from "next/navigation";

import { P } from "@/components/type/type";
import { H4 } from "@/components/type/titles";
import { useDownloadsQuery } from "@/hooks/downloads/useDownloadsQuery";
import { formatDate } from "@/lib/utils";

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
      <div className="grid grid-cols-12 gap-4">
        {/* Scheduler Info */}
        <div className="col-span-4 space-y-4">
          <section className="mb-6">
            <div className="p-4 border border-gray-300 rounded-lg">
              <div className="flex items-center space-x-2 mb-2 justify-between">
                <H4>Scheduler</H4>
                <P>
                  {render?.scheduler.data.attributes.Name} :{" "}
                  {render?.scheduler.data.id}
                </P>
              </div>
              <div className="flex items-center space-x-2 mb-2 justify-between">
                <H4>Queued</H4>
                <P>{render?.scheduler.data.attributes.Queued ? "Yes" : "No"}</P>
              </div>
              <div className="flex items-center space-x-2 mb-2 justify-between">
                <H4>Is Rendering</H4>
                <P>
                  {render?.scheduler.data.attributes.isRendering ? "Yes" : "No"}
                </P>
              </div>
            </div>
          </section>
        </div>
        {/* Nested Data Overview */}
        <div className="col-span-8 space-y-4">
          <section className="mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Updated At</H4>
                <P>
                  {render?.updatedAt ? formatDate(render.updatedAt) : "N/A"}
                </P>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Published At</H4>
                <P>
                  {render?.publishedAt ? formatDate(render.publishedAt) : "N/A"}
                </P>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Downloads</H4>
                <P>{Downloads?.length || 0}</P>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Game Results in Renders</H4>
                <P>{gameResults.length}</P>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Upcoming Games in Renders</H4>
                <P>{upcomingGames.length}</P>
              </div>
              <div className="p-4 border border-gray-300 rounded-lg">
                <H4>Grades in Renders</H4>
                <P>{grades.length}</P>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
