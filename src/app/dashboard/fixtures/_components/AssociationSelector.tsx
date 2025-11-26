"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useSorting } from "./_utils/useSorting";
import { SearchInput } from "./_utils/SearchInput";
import { formatDateRange } from "./_utils/dateUtils";

interface AssociationSelectorProps {
  onSelect: (associationId: number) => void;
}

type AssociationSortField =
  | "name"
  | "fixtureCount"
  | "competitionCount"
  | "gradeCount";

/**
 * AssociationSelector Component
 *
 * Displays a table of associations from fixture insights.
 * Users can select an association to view its fixtures.
 */
export function AssociationSelector({ onSelect }: AssociationSelectorProps) {
  const { data, isLoading, error, refetch } = useFixtureInsights();
  const [searchQuery, setSearchQuery] = useState("");
  const { sortField, sortDirection, handleSort, getSortIcon } =
    useSorting<AssociationSortField>();

  // Get associations from API data
  const associations = useMemo(() => {
    if (!data?.data?.categories?.byAssociation) {
      return [];
    }

    // Filter by search query
    const filtered = data.data.categories.byAssociation.filter(
      (association) => {
        if (searchQuery === "") return true;
        return association.associationName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
    );

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortField) {
          case "name":
            aValue = a.associationName.toLowerCase();
            bValue = b.associationName.toLowerCase();
            break;
          case "fixtureCount":
            aValue = a.fixtureCount;
            bValue = b.fixtureCount;
            break;
          case "competitionCount":
            aValue = a.competitionCount;
            bValue = b.competitionCount;
            break;
          case "gradeCount":
            aValue = a.gradeCount;
            bValue = b.gradeCount;
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchQuery, sortField, sortDirection]);

  // Loading state
  if (isLoading) {
    return (
      <SectionContainer
        title="Select an Association"
        description="Choose an association to view its fixtures"
        variant="compact"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-40" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <SectionContainer
        title="Select an Association"
        description="Choose an association to view its fixtures"
        variant="compact"
      >
        <ErrorState
          error={error}
          title="Failed to load associations"
          onRetry={() => refetch()}
          variant="card"
        />
      </SectionContainer>
    );
  }

  // Empty state
  if (associations.length === 0) {
    return (
      <SectionContainer
        title="Select an Association"
        description="Choose an association to view its fixtures"
        variant="compact"
      >
        <p className="text-center text-muted-foreground py-8">
          No associations found.
        </p>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Select an Association"
      description="Choose an association to view its fixtures"
      variant="compact"
    >
      <div className="space-y-4">
        {/* Search Filter */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by association name..."
        />

        {/* Results Count */}
        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            Showing {associations.length} result
            {associations.length !== 1 ? "s" : ""}
            {searchQuery && ` for "${searchQuery}"`}
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("name")}
                >
                  Association Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("fixtureCount")}
                >
                  Fixtures
                  {getSortIcon("fixtureCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("competitionCount")}
                >
                  Competitions
                  {getSortIcon("competitionCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort("gradeCount")}
                >
                  Grades
                  {getSortIcon("gradeCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Date Range</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {associations.map((association) => (
              <TableRow key={association.associationId}>
                <TableCell className="font-medium text-left">
                  <div className="flex items-center gap-3">
                    {association.logoUrl && (
                      <div className="relative h-8 w-8 flex-shrink-0">
                        <Image
                          src={association.logoUrl}
                          alt={`${association.associationName} logo`}
                          fill
                          className="object-contain"
                          sizes="32px"
                          unoptimized
                        />
                      </div>
                    )}
                    <span>{association.associationName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {association.fixtureCount}
                </TableCell>
                <TableCell className="text-right">
                  {association.competitionCount}
                </TableCell>
                <TableCell className="text-right">
                  {association.gradeCount}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground text-right">
                  {formatDateRange(association.dateRange)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => onSelect(association.associationId)}
                  >
                    Select
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
