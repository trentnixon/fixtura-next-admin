/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import { useParams } from "next/navigation";

// TODO: Add History Tab
export default function HistoryTab() {
  const { teamID } = useParams();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading team data</div>;
  if (!team) return <div>No team data found</div>;

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Game History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Opposition
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {team.gameMetaData?.map((game: any) => (
                <tr key={game.gameId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {game.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {game.oppositionTeamName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        game.result === "Won"
                          ? "bg-green-100 text-green-800"
                          : game.result === "Lost"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {game.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Total Games</h3>
          <p className="text-2xl font-bold">{team.gameMetaData?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Wins</h3>
          <p className="text-2xl font-bold text-green-600">
            {team.gameMetaData?.filter((game: any) => game.result === "Won")
              .length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Losses</h3>
          <p className="text-2xl font-bold text-red-600">
            {team.gameMetaData?.filter((game: any) => game.result === "Lost")
              .length || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
