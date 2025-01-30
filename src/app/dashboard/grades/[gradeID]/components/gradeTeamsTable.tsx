"use client";

import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";

import { DatabaseIcon, ExternalLinkIcon, EyeIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useGradeByID } from "@/hooks/grades/useGradeByID";

export const GradeTeamsTable = () => {
  const { gradeID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError } = useGradeByID(
    gradeID ? parseInt(gradeID as string) : 0
  );

  const Grade = data?.attributes;
  const teams = Grade?.teams?.data || [];
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) return <p>Loading Teams...</p>;
  if (isError) return <p>Error loading Teams</p>;

  // Filter teams based on search query (case-insensitive)
  const filteredTeams = teams.filter(team =>
    team.attributes.teamName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-8">
      <div className="bg-slate-200 rounded-lg px-4 py-2">
        {teams.length > 0 && (
          <div>
            <div className="flex justify-between items-center  py-2">
              <h2 className="text-xl font-semibold mb-2">
                Teams in Grade ({teams.length})
              </h2>

              {/* Search Input */}
              <div className="flex items-center w-1/2">
                <Input
                  type="text"
                  placeholder="Search by Team Name..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                />
                <Button
                  variant="ghost"
                  onClick={() => setSearchQuery("")}
                  className="ml-2 px-4 py-2 rounded-md focus:outline-none">
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-sm border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Team Name</TableHead>
                    <TableHead className="text-center">Games Played</TableHead>
                    <TableHead className="text-center">Wins</TableHead>
                    <TableHead className="text-center">Losses</TableHead>
                    <TableHead className="text-center">Strapi</TableHead>
                    <TableHead className="text-center">PlayHQ</TableHead>
                    <TableHead className="text-center">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.length > 0 ? (
                    filteredTeams.map(team => (
                      <TableRow key={team.id}>
                        <TableCell className="text-left">
                          {team.attributes.teamName}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.attributes.gamesPlayed}
                        </TableCell>

                        <TableCell className="text-center">
                          {team.attributes.wins}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.attributes.losses}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`${strapiLocation.team}${team.id}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">
                              <DatabaseIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`https://www.playhq.com${team.attributes.href}`}
                            target="_blank">
                            <Button variant="outline">
                              <ExternalLinkIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/teams/${team.id}`}>
                            <Button variant="outline">
                              <EyeIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-gray-500">
                        No grades found matching &quot;{searchQuery}&quot;
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
