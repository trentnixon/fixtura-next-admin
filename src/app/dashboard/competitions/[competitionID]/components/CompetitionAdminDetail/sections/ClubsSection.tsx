"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

interface ClubsSectionProps {
  clubs: CompetitionAdminDetailResponse["analytics"]["tables"]["clubs"];
}

export function ClubsSection({ clubs }: ClubsSectionProps) {
  const MAX_VISIBLE_GRADES = 3;
  const sortedClubs = [...clubs].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  return (
    <SectionContainer
      title="Clubs"
      description="Participating clubs with Fixtura coverage and competition links."
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Club</TableHead>
              <TableHead>Fixtura Account</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Grades</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedClubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell className="font-medium">{club.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={club.hasFixturaAccount ? "default" : "outline"}
                  >
                    {club.hasFixturaAccount ? "Linked" : "Missing"}
                  </Badge>
                </TableCell>
                <TableCell>{formatNumber(club.teamCount)}</TableCell>
                <TableCell>
                  {club.grades.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {club.grades.slice(0, MAX_VISIBLE_GRADES).map((grade) => (
                        <Badge key={grade} variant="outline">
                          {grade}
                        </Badge>
                      ))}
                      {club.grades.length > MAX_VISIBLE_GRADES && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="secondary"
                                className="cursor-help"
                              >
                                +{club.grades.length - MAX_VISIBLE_GRADES} more
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <div className="max-w-xs space-y-1 text-left">
                                {club.grades
                                  .slice(MAX_VISIBLE_GRADES)
                                  .map((grade) => (
                                    <div key={grade}>{grade}</div>
                                  ))}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="accent">
                    <Link href={`/dashboard/clubs/${club.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionContainer>
  );
}

