/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SectionTitle } from "@/components/type/titles";
import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatabaseIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";

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
      <SectionTitle>Completed Fixtures</SectionTitle>
      <p className="text-sm text-gray-500">{sport}</p>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        {renderFixtures()}
      </div>
    </div>
  );
}

// Sport-specific fixture components
function CricketFixtures({ team }: { team: any }) {
  const { strapiLocation } = useGlobalContext();
  const completedFixtures =
    team.gameMetaData
      ?.filter((game: any) => {
        return game.status === "Final" || game.status === "Abandoned";
      })

      .sort((a: any, b: any) => {
        return (
          new Date(a.finalDaysPlay).getTime() -
          new Date(b.finalDaysPlay).getTime()
        );
      }) || [];

  if (completedFixtures.length === 0) {
    return (
      <div className="p-4 text-gray-500">
        No upcoming cricket fixtures scheduled
      </div>
    );
  }

  return (
    <Table className="min-w-full divide-y divide-gray-200">
      <TableHeader className="bg-gray-50">
        <TableRow>
          <TableHead className="text-left">Type</TableHead>
          <TableHead className="text-left">Date</TableHead>
          <TableHead className="text-left">Time</TableHead>
          <TableHead className="text-left">Round</TableHead>
          <TableHead className="text-left">Opposition</TableHead>
          <TableHead className="text-left">Ground</TableHead>
          <TableHead className="text-center">PlayHQ</TableHead>
          <TableHead className="text-center">Strapi</TableHead>
          <TableHead className="text-center">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {completedFixtures.map((game: any) => {
          const attrs = game;
          const isHomeTeam = attrs.teamHome === team.teamName;
          const opposition = isHomeTeam ? attrs.teamAway : attrs.teamHome;

          return (
            <TableRow key={attrs.id} className="hover:bg-gray-50">
              <TableCell className="text-left">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {attrs.type}
                </span>
              </TableCell>
              <TableCell className="text-left">{attrs.date}</TableCell>
              <TableCell className="text-left">{attrs.time}</TableCell>

              <TableCell className="text-left">{attrs.round}</TableCell>
              <TableCell className="text-left">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2">
                    {isHomeTeam ? "vs" : "@"}
                  </span>
                  {opposition}
                </div>
              </TableCell>
              <TableCell className="text-left">{attrs.ground}</TableCell>
              <TableCell className="text-center">
                <Link
                  href={`https://www.playhq.com${game.urlToScoreCard}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button variant="outline">
                    <ExternalLinkIcon size="16" />
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`${strapiLocation.fixture.cricket}${game.id}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button variant="outline">
                    <DatabaseIcon size="16" />
                  </Button>
                </Link>
              </TableCell>
              <TableCell className="text-center">
                <Link
                  href={`/dashboard/fixture/${game.id}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button variant="outline">
                    <DatabaseIcon size="16" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
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
