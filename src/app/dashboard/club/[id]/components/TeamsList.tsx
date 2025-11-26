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
import { Users, Trophy, Building2 } from "lucide-react";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface TeamsListProps {
  teams: ClubTeamDetail[];
}

export default function TeamsList({ teams }: TeamsListProps) {
  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => a.name.localeCompare(b.name));
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Team</TableHead>
          <TableHead>Competition</TableHead>
          <TableHead>Association</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedTeams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{team.name}</span>
              </div>
            </TableCell>
            <TableCell>
              {team.competition ? (
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">
                    {team.competition.name}
                  </span>
                  {team.competition.status && (
                    <span className="text-xs text-muted-foreground">
                      {team.competition.status}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              {team.competition?.association ? (
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {team.competition.association.name}
                  </span>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              {team.grade ? (
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1 font-normal"
                >
                  <Trophy className="h-3 w-3" />
                  <span>{team.grade.name}</span>
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
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


