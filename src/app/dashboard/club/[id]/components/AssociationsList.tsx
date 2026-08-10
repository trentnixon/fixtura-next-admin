"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ClubAssociationDetail } from "@/types/clubAdminDetail";
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

interface AssociationsListProps {
  associations: ClubAssociationDetail[];
}

export default function AssociationsList({
  associations,
}: AssociationsListProps) {
  const sortedAssociations = useMemo(() => {
    return [...associations].sort((a, b) => {
      if (b.teamCount !== a.teamCount) return b.teamCount - a.teamCount;
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
    <Table className="min-w-[760px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[280px]">Association</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Competitions</TableHead>
          <TableHead className="text-right">Teams</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAssociations.map((association) => (
          <TableRow key={association.id}>
            <TableCell>
              <div className="flex min-w-0 items-center gap-3">
                {association.logoUrl && (
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border bg-white p-1">
                    <Image
                      src={association.logoUrl}
                      alt={`${association.name} logo`}
                      fill
                      className="object-contain p-1"
                      unoptimized
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {association.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Association #{association.id}
                  </p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-slate-50 text-slate-600">
                {association.sport || "-"}
              </Badge>
            </TableCell>
            <TableCell>
              <StatusBadge
                status={association.isActive}
                trueLabel="Active"
                falseLabel="Inactive"
                variant={association.isActive ? "default" : "neutral"}
              />
            </TableCell>
            <TableCell className="text-right font-medium text-slate-900">
              {association.competitionCount}
            </TableCell>
            <TableCell className="text-right font-medium text-slate-900">
              {association.teamCount}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                {association.href && (
                  <Button variant="primary" size="sm" asChild>
                    <a
                      href={association.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PlayHQ
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button variant="accent" size="sm" asChild>
                  <Link href={`/dashboard/association/${association.id}`}>
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
