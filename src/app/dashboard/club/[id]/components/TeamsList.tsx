"use client";

import { useMemo } from "react";
import { ClubTeamDetail } from "@/types/clubAdminDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface TeamsListProps {
  teams: ClubTeamDetail[];
}

export default function TeamsList({ teams }: TeamsListProps) {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      const competitionA = a.competition?.name ?? "";
      const competitionB = b.competition?.name ?? "";
      if (competitionA !== competitionB) {
        return competitionA.localeCompare(competitionB);
      }
      return a.name.localeCompare(b.name);
    });
  }, [teams]);

  if (sortedTeams.length === 0) {
    return (
      <EmptyState
        title="No Teams"
        description="No teams are currently linked to this club in the dataset."
        variant="minimal"
      />
    );
  }

  return (
    <Table className="min-w-[760px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[260px]">Team</TableHead>
          <TableHead className="min-w-[260px]">Competition</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {team.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Team #{team.id}
                </p>
              </div>
            </TableCell>
            <TableCell>
              {team.competition ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {team.competition.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {team.competition.association?.name ?? "No association"}
                  </p>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              {team.grade ? (
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="bg-slate-50">
                    {team.grade.name}
                  </Badge>
                  {team.grade.gender && (
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-600"
                    >
                      {team.grade.gender}
                    </Badge>
                  )}
                  {team.grade.ageGroup && (
                    <Badge
                      variant="outline"
                      className="bg-white text-slate-600"
                    >
                      {team.grade.ageGroup}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge
                status={team.isActive}
                trueLabel="Active"
                falseLabel="Inactive"
                variant={team.isActive ? "default" : "neutral"}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
