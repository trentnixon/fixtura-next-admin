/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import Link from "next/link";
import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { SectionTitle } from "@/components/type/titles";
// TODO: Add History Tab
export default function UpcomingGames() {
  const { teamID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading team data</div>;
  if (!team) return <div>No team data found</div>;

  const sortedGames = team.gameMetaData
    ?.filter(game => game.isFinished)
    .sort((a, b) =>
      new Date(b.finalDaysPlay) > new Date(a.finalDaysPlay) ? 1 : -1
    );

  return (
    <div className="mt-4">
      <SectionTitle>Upcoming Games</SectionTitle>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Date</TableHead>
                <TableHead className="text-left">Opposition</TableHead>
                <TableHead className="text-center">PlayHQ</TableHead>
                <TableHead className="text-center">Strapi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedGames?.map((game: any) => (
                <TableRow key={game.id}>
                  <TableCell className="text-left">{game.date}</TableCell>
                  <TableCell className="text-left">{game.teamAway}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
