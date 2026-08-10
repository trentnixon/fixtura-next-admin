"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { AssociationDetail } from "@/types/associationInsights";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  FilterX,
  Search,
  X,
} from "lucide-react";

interface AssociationsTableProps {
  associations: AssociationDetail[];
}

type SortField =
  | "name"
  | "sport"
  | "gradeCount"
  | "clubCount"
  | "competitionCount"
  | "activeCompetitionCount"
  | null;

type SortDirection = "asc" | "desc" | null;

const ITEMS_PER_PAGE = 15;

export default function AssociationsTable({
  associations,
}: AssociationsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [minGrades, setMinGrades] = useState<number | undefined>(undefined);
  const [minCompetitions, setMinCompetitions] = useState<number | undefined>(
    undefined,
  );

  const showSportColumn = useMemo(() => {
    return associations.some((assoc) => assoc.sport !== undefined);
  }, [associations]);

  const associationsWithWeighting = useMemo(() => {
    if (associations.length === 0) return [];

    const competitionValues = associations
      .map((a) => a.competitionCount)
      .sort((a, b) => a - b);
    const gradeValues = associations
      .map((a) => a.gradeCount)
      .sort((a, b) => a - b);

    return associations.map((assoc) => {
      const competitionPercentile =
        (competitionValues.filter((v) => v <= assoc.competitionCount).length /
          associations.length) *
        100;
      const gradePercentile =
        (gradeValues.filter((v) => v <= assoc.gradeCount).length /
          associations.length) *
        100;

      const combinedWeighting = (competitionPercentile + gradePercentile) / 2;

      return {
        ...assoc,
        competitionPercentile: Math.round(competitionPercentile),
        gradePercentile: Math.round(gradePercentile),
        combinedWeighting: Math.round(combinedWeighting),
      };
    });
  }, [associations]);

  const filteredData = useMemo(() => {
    let filtered = associationsWithWeighting;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (assoc) =>
          assoc.name.toLowerCase().includes(query) ||
          assoc.sport?.toLowerCase().includes(query),
      );
    }

    if (minGrades !== undefined) {
      filtered = filtered.filter((assoc) => {
        return assoc.gradeCount >= minGrades;
      });
    }

    if (minCompetitions !== undefined) {
      filtered = filtered.filter((assoc) => {
        return assoc.competitionCount >= minCompetitions;
      });
    }

    return filtered;
  }, [associationsWithWeighting, searchQuery, minGrades, minCompetitions]);

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "sport":
          aValue = (a.sport || "").toLowerCase();
          bValue = (b.sport || "").toLowerCase();
          break;
        case "gradeCount":
          aValue = a.gradeCount;
          bValue = b.gradeCount;
          break;
        case "clubCount":
          aValue = a.clubCount;
          bValue = b.clubCount;
          break;
        case "competitionCount":
          aValue = a.competitionCount;
          bValue = b.competitionCount;
          break;
        case "activeCompetitionCount":
          aValue = a.activeCompetitionCount;
          bValue = b.activeCompetitionCount;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-4 w-4" />;
    }
    return <ArrowDown className="ml-1 h-4 w-4" />;
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSortField(null);
    setSortDirection(null);
    setMinGrades(undefined);
    setMinCompetitions(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    sortField ||
    minGrades !== undefined ||
    minCompetitions !== undefined;

  if (associations.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-muted-foreground">
        <Search className="mx-auto mb-2 h-5 w-5 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          No associations found
        </p>
        <p className="mt-1 text-xs">
          The selected sport filter did not return association records.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 lg:flex-row lg:items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name or sport..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 bg-white pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-transparent"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1 min-w-[120px]">
            <Label
              htmlFor="grades-filter"
              className="text-xs text-muted-foreground"
            >
              Grade Count (&gt;=)
            </Label>
            <Input
              id="grades-filter"
              type="number"
              placeholder="More than"
              value={minGrades ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? undefined
                    : parseInt(e.target.value, 10);
                setMinGrades(value);
                setCurrentPage(1);
              }}
              min="0"
              className="h-9 bg-white text-sm"
            />
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="space-y-1 min-w-[120px]">
            <Label
              htmlFor="competitions-filter"
              className="text-xs text-muted-foreground"
            >
              Competition Count (&gt;=)
            </Label>
            <Input
              id="competitions-filter"
              type="number"
              placeholder="More than"
              value={minCompetitions ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? undefined
                    : parseInt(e.target.value, 10);
                setMinCompetitions(value);
                setCurrentPage(1);
              }}
              min="0"
              className="h-9 bg-white text-sm"
            />
          </div>
        </div>

        {hasActiveFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetFilters}
            className="whitespace-nowrap h-9"
          >
            <FilterX className="mr-2 h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>
          Showing {paginatedData.length} of {sortedData.length} results
          {filteredData.length !== associations.length &&
            ` (filtered from ${associations.length} total)`}
        </span>
        <span>
          Sorted by{" "}
          {sortField && sortDirection
            ? `${sortField} ${sortDirection}`
            : "default API order"}
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Name
                  {getSortIcon("name")}
                </Button>
              </TableHead>
              {showSportColumn && (
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("sport")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Sport
                    {getSortIcon("sport")}
                  </Button>
                </TableHead>
              )}
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("gradeCount")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Grades
                  {getSortIcon("gradeCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("clubCount")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Clubs
                  {getSortIcon("clubCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("competitionCount")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Competitions
                  {getSortIcon("competitionCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("activeCompetitionCount")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Active Comps
                  {getSortIcon("activeCompetitionCount")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Weighting</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={showSportColumn ? 8 : 7}
                  className="py-8 text-center text-muted-foreground"
                >
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((association) => (
                <TableRow key={association.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {association.logoUrl && (
                        <div className="relative h-8 w-8 flex-shrink-0 rounded-md border border-slate-200 bg-white">
                          <Image
                            src={association.logoUrl}
                            alt={`${association.name} logo`}
                            fill
                            className="object-contain"
                            sizes="32px"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {association.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID {association.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  {showSportColumn && (
                    <TableCell>
                      {association.sport ? (
                        <Badge variant="outline" className="text-xs">
                          {association.sport}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    {association.gradeCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {association.clubCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {association.competitionCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {association.activeCompetitionCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant={
                          association.combinedWeighting >= 75
                            ? "primary"
                            : association.combinedWeighting >= 50
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {association.combinedWeighting}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        C:{association.competitionPercentile}% G:
                        {association.gradePercentile}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {association.href ? (
                        <Button variant="primary" size="sm" asChild>
                          <Link
                            href={association.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                            PlayHQ
                          </Link>
                        </Button>
                      ) : null}
                      <Button variant="primary" size="sm" asChild>
                        <Link href={`/dashboard/association/${association.id}`}>
                          View
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            variant="primary"
            className="w-full"
          >
            <PaginationInfo
              format="long"
              totalItems={sortedData.length}
              itemsPerPage={ITEMS_PER_PAGE}
              className="mr-auto"
            />
            <div className="flex items-center gap-1 ml-auto">
              <PaginationPrevious />
              <PaginationPages />
              <PaginationNext />
            </div>
          </Pagination>
        </div>
      )}
    </div>
  );
}
