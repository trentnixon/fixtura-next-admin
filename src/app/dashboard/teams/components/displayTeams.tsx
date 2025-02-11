// TODO: Add search for team
"use client";

import { useGetTeamsOnSearchTerm } from "@/hooks/teams/useGetTeamsOnSearchTerm";
import { FormattedTeam } from "@/types/team";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { DatabaseIcon, ExternalLinkIcon, EyeIcon } from "lucide-react";

export default function DisplayTeams({ searchTerm }: { searchTerm: string }) {
  const { data, isLoading } = useGetTeamsOnSearchTerm(searchTerm);
  const { strapiLocation } = useGlobalContext();
  console.log("[data]", data);
  const teams = data;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4">
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Team Name</TableHead>
                <TableHead className="text-left">Games Played</TableHead>
                <TableHead className="text-left">Competition</TableHead>
                <TableHead className="text-left">Competition URL</TableHead>
                <TableHead className="text-left">
                  Competition Is Active
                </TableHead>
                <TableHead className="text-left">Grades</TableHead>
                <TableHead className="text-left">Playhq</TableHead>
                <TableHead className="text-left">Strapi</TableHead>
                <TableHead className="text-left">View</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {teams?.map((team: FormattedTeam) => (
                <TableRow key={team.id}>
                  <TableCell className="text-left">{team.teamName}</TableCell>
                  <TableCell className="text-left">
                    {team.gamesPlayed}
                  </TableCell>
                  <TableCell className="text-left">
                    {team.competitionSeason}
                  </TableCell>
                  <TableCell className="text-left">
                    {team.competitionURL ? (
                      <Button variant="outline">
                        <Link href={team.competitionURL || ""}>View</Link>
                      </Button>
                    ) : (
                      "No URL"
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    {team.competitionIsActive ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="text-left">{team.grades}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline">
                      <Link
                        href={`https://www.playhq.com${team.href}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <ExternalLinkIcon size="16" />
                      </Link>
                    </Button>
                  </TableCell>

                  <TableCell className="text-left">
                    <Button variant="outline">
                      <Link
                        href={`${strapiLocation.team}${team.id}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <DatabaseIcon size="16" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline">
                      <Link href={`/dashboard/teams/${team.id}`}>
                        <EyeIcon size="16" />
                      </Link>
                    </Button>
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
