"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import StatusFlags from "./StatusFlags";
import { Title } from "@/components/type/titles";
import { ByLine } from "@/components/type/titles";

export default function DisplayRenderId({ renderID }: { renderID: string }) {
  const { data, isLoading, error } = useRendersQuery(renderID);

  if (isLoading) return <p>Loading render data...</p>;
  if (error) {
    return (
      <div>
        <p>Error loading render data: {error.message}</p>
      </div>
    );
  }

  const render = data!;
  const { attributes } = render;

  const nestedCounts = {
    downloads: attributes.downloads.data.length,
    gameResults: attributes.game_results_in_renders.data.length,
    upcomingGames: attributes.upcoming_games_in_renders.data.length,
    grades: attributes.grades_in_renders.data.length,
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <Title>Render Details</Title>
          <ByLine>
            {attributes.Name} - {render.id}
          </ByLine>
        </div>

        <StatusFlags flags={attributes} />
      </div>

      {/* Status Flags */}

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 gap-8 space-y-4">
          {" "}
          {/* Nested Counts */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Nested Data Overview</h2>
            <table className="table-auto w-full border border-gray-300">
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Updated At</td>
                  <td className="p-2">{attributes.updatedAt}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Published At</td>
                  <td className="p-2">{attributes.publishedAt}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Downloads</td>
                  <td className="p-2">{nestedCounts.downloads}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Game Results in Renders</td>
                  <td className="p-2">{nestedCounts.gameResults}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Upcoming Games in Renders</td>
                  <td className="p-2">{nestedCounts.upcomingGames}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Grades in Renders</td>
                  <td className="p-2">{nestedCounts.grades}</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
        <div className="col-span-4 gap-4 space-y-4">
          {/* Scheduler Info */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Scheduler Information
            </h2>
            <table className="table-auto w-full border border-gray-300">
              <tbody>
                <tr>
                  <td className="p-2 font-medium">Scheduler ID</td>
                  <td className="p-2">{attributes.scheduler.data.id}</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Name</td>
                  <td className="p-2">
                    {attributes.scheduler.data.attributes.Name}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Queued</td>
                  <td className="p-2">
                    {attributes.scheduler.data.attributes.Queued ? "Yes" : "No"}
                  </td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Is Rendering</td>
                  <td className="p-2">
                    {attributes.scheduler.data.attributes.isRendering
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
}
