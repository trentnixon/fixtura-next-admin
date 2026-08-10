"use client";

import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";

import { ClubDetail } from "@/types/associationDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface ClubsListProps {
  clubs: ClubDetail[];
}

export default function ClubsList({ clubs }: ClubsListProps) {
  const sortedClubs = useMemo(() => {
    return [...clubs].sort((a, b) => {
      if (b.teamCount !== a.teamCount) return b.teamCount - a.teamCount;
      return a.name.localeCompare(b.name);
    });
  }, [clubs]);

  if (clubs.length === 0) {
    return (
      <EmptyState
        title="No Clubs"
        description="No clubs found for this association."
        variant="minimal"
      />
    );
  }

  return (
    <Table className="min-w-[720px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[280px]">Club</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Competitions</TableHead>
          <TableHead className="text-right">Teams</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedClubs.map((club) => (
          <ClubTableRow key={club.id} club={club} />
        ))}
      </TableBody>
    </Table>
  );
}

function ClubTableRow({ club }: { club: ClubDetail }) {
  const {
    id,
    name,
    sport,
    logoUrl,
    isActive,
    href,
    competitionCount,
    teamCount,
  } = club;

  return (
    <TableRow>
      <TableCell>
        <div className="flex min-w-0 items-center gap-3">
          {logoUrl && (
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-white p-1">
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                fill
                className="object-contain p-1"
                unoptimized
              />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Club #{id}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="bg-slate-50 text-slate-600">
          {sport || "-"}
        </Badge>
      </TableCell>
      <TableCell>
        <StatusBadge
          status={isActive}
          trueLabel="Active"
          falseLabel="Inactive"
          variant={isActive ? "default" : "error"}
        />
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {competitionCount}
      </TableCell>
      <TableCell className="text-right font-medium text-slate-900">
        {teamCount}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {href && (
            <Button variant="primary" size="sm" asChild>
              <a href={href} target="_blank" rel="noopener noreferrer">
                PlayHQ
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Button variant="accent" size="sm" asChild>
            <Link href={`/dashboard/club/${id}`}>
              View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
