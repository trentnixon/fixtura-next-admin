"use client";

import Image from "next/image";
import { useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Trophy, Users, Eye } from "lucide-react";
import { ClubDetail } from "@/types/associationDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";

/**
 * ClubsList Component
 *
 * Main clubs list component displaying:
 * - Clubs sorted by team count (descending), then alphabetically
 * - Table format with club details
 * - Consider virtualization for large lists
 */
interface ClubsListProps {
  clubs: ClubDetail[];
}

export default function ClubsList({ clubs }: ClubsListProps) {
  // Sort clubs by team count (descending), then alphabetically by name
  const sortedClubs = useMemo(() => {
    return [...clubs].sort((a, b) => {
      // First sort by team count (descending)
      if (b.teamCount !== a.teamCount) {
        return b.teamCount - a.teamCount;
      }
      // If team counts are equal, sort alphabetically by name
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Club</TableHead>
          <TableHead>Sport</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-center">Competitions</TableHead>
          <TableHead className="text-center">Teams</TableHead>
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

// Individual club table row component
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
    <TableRow className="hover:bg-muted/50">
      {/* Club Name with Logo */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          {logoUrl && (
            <div className="relative w-10 h-10 rounded-lg border-2 bg-white p-1 shadow-sm flex-shrink-0">
              <Image
                src={logoUrl}
                alt={`${name} logo`}
                width={32}
                height={32}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="font-semibold">{name}</span>
          </div>
        </div>
      </TableCell>

      {/* Sport */}
      <TableCell>
        {sport ? (
          <span className="text-sm">{sport}</span>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge
          status={isActive}
          trueLabel="Active"
          falseLabel="Inactive"
          variant={isActive ? "default" : "error"}
        />
      </TableCell>

      {/* Competitions Count */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{competitionCount}</span>
        </div>
      </TableCell>

      {/* Teams Count */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{teamCount}</span>
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          {href && (
            <Button variant="primary" size="sm" asChild>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">PlayHQ</span>
              </a>
            </Button>
          )}
          <Button variant="accent" size="sm" asChild>
            <Link href={`/dashboard/accounts/club/${id}`}>
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1">View</span>
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
