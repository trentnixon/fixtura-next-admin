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

import {
  ArrowRight,
  ChevronDown,
  DatabaseIcon,
  ExternalLinkIcon,
  SearchIcon,
  XIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import { useGradeByID } from "@/hooks/grades/useGradeByID";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export const GradeTeamsTable = () => {
  const { gradeID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError } = useGradeByID(
    gradeID ? parseInt(gradeID as string) : 0,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const teams = useMemo(() => data?.teamData ?? [], [data?.teamData]);

  const filteredTeams = useMemo(() => {
    return teams.filter((team) =>
      team.teamName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teams, searchQuery]);

  if (isLoading || isError) return null; // Handled by parent page

  return (
    <SectionContainer
      title="Teams in Grade"
      description={`Review and manage the ${teams.length} teams associated with this grade.`}
      icon={<Users className="h-5 w-5 text-slate-500" />}
      action={
        <div className="flex items-center gap-2 max-w-sm">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 w-[200px] lg:w-[300px]"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="absolute right-0 top-0 h-9 w-9 text-slate-500"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="rounded-md border overflow-hidden">
        <ScrollArea className="w-full">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="min-w-[280px]">Team</TableHead>
                <TableHead>Metadata</TableHead>
                <TableHead className="text-right">Games</TableHead>
                <TableHead className="text-right">Wins</TableHead>
                <TableHead className="text-right">Losses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.length > 0 ? (
                filteredTeams.map((team) => {
                  const playHqUrl = team.href
                    ? `https://www.playhq.com${team.href}`
                    : team.url;
                  const cmsUrl = strapiLocation?.team
                    ? `${strapiLocation.team}${team.id}`
                    : null;

                  return (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-900">
                            {team.teamName}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Team #{team.id}
                            {team.teamID ? ` - PlayHQ ${team.teamID}` : ""}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          {team.gender && (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-600"
                            >
                              {team.gender}
                            </Badge>
                          )}
                          {team.age && (
                            <Badge
                              variant="outline"
                              className="bg-slate-50 text-slate-600"
                            >
                              {team.age}
                            </Badge>
                          )}
                          {team.form && (
                            <Badge variant="secondary">{team.form}</Badge>
                          )}
                          {!team.gender && !team.age && !team.form && (
                            <span className="text-sm text-muted-foreground">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {team.gamesPlayed}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {team.wins}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {team.losses}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="primary" size="sm">
                            <Link href={`/dashboard/teams/${team.id}`}>
                              View
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="primary" size="sm">
                                Open
                                <ChevronDown className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel>
                                Destinations
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {cmsUrl ? (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={cmsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <DatabaseIcon className="h-4 w-4" />
                                    Open in CMS
                                  </Link>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  <DatabaseIcon className="h-4 w-4" />
                                  Open in CMS
                                </DropdownMenuItem>
                              )}
                              {playHqUrl ? (
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={playHqUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLinkIcon className="h-4 w-4" />
                                    View on PlayHQ
                                  </Link>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem disabled>
                                  <ExternalLinkIcon className="h-4 w-4" />
                                  View on PlayHQ
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-auto p-0">
                    <EmptyState
                      variant="minimal"
                      title={
                        searchQuery ? "No matching teams" : "No teams found"
                      }
                      description={
                        searchQuery
                          ? `We couldn't find any teams matching "${searchQuery}"`
                          : "There are no teams currently associated with this grade."
                      }
                      className="py-12"
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </SectionContainer>
  );
};
