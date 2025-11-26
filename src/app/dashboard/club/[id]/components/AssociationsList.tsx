"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ClubAssociationDetail } from "@/types/clubAdminDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Building2, Trophy, Users, Eye } from "lucide-react";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface AssociationsListProps {
  associations: ClubAssociationDetail[];
}

export default function AssociationsList({
  associations,
}: AssociationsListProps) {
  const sortedAssociations = useMemo(() => {
    return [...associations].sort((a, b) => {
      if (b.teamCount !== a.teamCount) {
        return b.teamCount - a.teamCount;
      }
      if (b.competitionCount !== a.competitionCount) {
        return b.competitionCount - a.competitionCount;
      }
      return a.name.localeCompare(b.name);
    });
  }, [associations]);

  if (sortedAssociations.length === 0) {
    return (
      <EmptyState
        title="No Associations"
        description="This club is not currently linked to any associations in the dataset."
        variant="minimal"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Association</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Competitions</TableHead>
          <TableHead className="text-center">Teams</TableHead>
          <TableHead className="text-center">View</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAssociations.map((association) => (
          <TableRow key={association.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium truncate">{association.name}</span>
              </div>
            </TableCell>
            <TableCell>
              {association.sport ? (
                <span className="text-sm">{association.sport}</span>
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>
              <StatusBadge
                status={association.isActive}
                trueLabel="Active"
                falseLabel="Inactive"
                variant={association.isActive ? "default" : "neutral"}
              />
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Trophy className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">
                  {association.competitionCount}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-semibold">{association.teamCount}</span>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Button variant="accent" size="sm" asChild>
                <Link
                  href={`/dashboard/association/${association.id}`}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">View</span>
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
