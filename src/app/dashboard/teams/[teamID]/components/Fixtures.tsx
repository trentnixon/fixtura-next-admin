/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import { useParams } from "next/navigation";

// TODO: Add Fixtures Tab
export default function FixturesTab() {
  const { teamID } = useParams();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading team data</div>;
  if (!team) return <div>No team data found</div>;

  // Determine sport from the competition's association
  const sport = team?.association?.Sport || "Unknown";

  const renderFixtures = () => {
    switch (sport.toLowerCase()) {
      case "cricket":
        return <CricketFixtures team={team} />;
      case "afl":
        return <AFLFixtures team={team} />;
      case "netball":
        return <NetballFixtures team={team} />;
      case "hockey":
        return <HockeyFixtures team={team} />;
      case "basketball":
        return <BasketballFixtures team={team} />;
      default:
        return (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">
            No fixtures available for {sport}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Upcoming Fixtures</h2>
          <p className="text-sm text-gray-500">{sport}</p>
        </div>
        {renderFixtures()}
      </div>
    </div>
  );
}

// Sport-specific fixture components
function CricketFixtures({ team }: { team: any }) {
  const upcomingFixtures =
    team.gameMetaData?.filter((game: any) => {
      const gameDate = new Date(game.dayOne);

      return gameDate >= new Date();
    }) || [];

  if (upcomingFixtures.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No upcoming cricket fixtures scheduled
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Round
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opposition
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ground
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {upcomingFixtures.map((game: any) => {
            const attrs = game;
            const isHomeTeam = attrs.teamHome === team.teamName;
            const opposition = isHomeTeam ? attrs.teamAway : attrs.teamHome;

            return (
              <tr key={attrs.gameID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attrs.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attrs.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attrs.round}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">
                      {isHomeTeam ? "vs" : "@"}
                    </span>
                    {opposition}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {attrs.ground}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {attrs.type}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Placeholder components for other sports
function AFLFixtures({ team }: { team: any }) {
  return (
    <div className="p-4">
      AFL Fixtures component to be implemented {team.teamName}
    </div>
  );
}

function NetballFixtures({ team }: { team: any }) {
  return (
    <div className="p-4">
      Netball Fixtures component to be implemented {team.teamName}
    </div>
  );
}

function HockeyFixtures({ team }: { team: any }) {
  return (
    <div className="p-4">
      Hockey Fixtures component to be implemented {team.teamName}
    </div>
  );
}

function BasketballFixtures({ team }: { team: any }) {
  return (
    <div className="p-4">
      Basketball Fixtures component to be implemented {team.teamName}
    </div>
  );
}
