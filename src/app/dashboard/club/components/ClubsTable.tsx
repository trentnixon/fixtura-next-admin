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
import { ClubInsight } from "@/types/clubInsights";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, X } from "lucide-react";

/**
 * ClubsTable Component
 *
 * Advanced table with search, filtering, sorting, and pagination.
 * Displays clubs data with all metrics.
 */
interface ClubsTableProps {
  clubs: ClubInsight[];
}

type SortField =
  | "name"
  | "sport"
  | "associationCount"
  | "teamCount"
  | "competitionCount"
  | null;

type SortDirection = "asc" | "desc" | null;

const ITEMS_PER_PAGE = 25;

export default function ClubsTable({ clubs }: ClubsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [minTeams, setMinTeams] = useState<number | undefined>(undefined);
  const [minCompetitions, setMinCompetitions] = useState<number | undefined>(
    undefined
  );

  // Filter data by search query and thresholds
  const filteredData = useMemo(() => {
    let filtered = clubs;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.sport.toLowerCase().includes(query) ||
          club.associationNames.some((name) =>
            name.toLowerCase().includes(query)
          )
      );
    }

    // Apply team count threshold (>=)
    if (minTeams !== undefined) {
      filtered = filtered.filter((club) => {
        return club.teamCount >= minTeams;
      });
    }

    // Apply competition count threshold (>=)
    if (minCompetitions !== undefined) {
      filtered = filtered.filter((club) => {
        return club.competitionCount >= minCompetitions;
      });
    }

    return filtered;
  }, [clubs, searchQuery, minTeams, minCompetitions]);

  // Sort data
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
          aValue = a.sport.toLowerCase();
          bValue = b.sport.toLowerCase();
          break;
        case "associationCount":
          aValue = a.associationCount;
          bValue = b.associationCount;
          break;
        case "teamCount":
          aValue = a.teamCount;
          bValue = b.teamCount;
          break;
        case "competitionCount":
          aValue = a.competitionCount;
          bValue = b.competitionCount;
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

  // Paginate sorted data
  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Handle sorting
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
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSortField(null);
    setSortDirection(null);
    setMinTeams(undefined);
    setMinCompetitions(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    sortField ||
    minTeams !== undefined ||
    minCompetitions !== undefined;

  if (clubs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No clubs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by name, sport, or association..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-10 h-9"
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
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Team Count Threshold */}
        <div className="flex items-end gap-2">
          <div className="space-y-1 min-w-[120px]">
            <Label
              htmlFor="teams-filter"
              className="text-xs text-muted-foreground"
            >
              Team Count (≥)
            </Label>
            <Input
              id="teams-filter"
              type="number"
              placeholder="More than"
              value={minTeams ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? undefined
                    : parseInt(e.target.value, 10);
                setMinTeams(value);
                setCurrentPage(1);
              }}
              min="0"
              className="text-sm h-9"
            />
          </div>
        </div>

        {/* Competition Count Threshold */}
        <div className="flex items-end gap-2">
          <div className="space-y-1 min-w-[120px]">
            <Label
              htmlFor="competitions-filter"
              className="text-xs text-muted-foreground"
            >
              Competition Count (≥)
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
              className="text-sm h-9"
            />
          </div>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="whitespace-nowrap h-9"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
        {filteredData.length !== clubs.length &&
          ` (filtered from ${clubs.length} total)`}
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
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
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("associationCount")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Associations
                {getSortIcon("associationCount")}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("teamCount")}
                className="h-auto p-0 font-semibold hover:bg-transparent"
              >
                Teams
                {getSortIcon("teamCount")}
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
            <TableHead className="text-center">Account</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No results found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((club) => (
              <TableRow key={club.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {club.logoUrl && (
                      <div className="relative h-8 w-8 flex-shrink-0">
                        <Image
                          src={club.logoUrl}
                          alt={`${club.name} logo`}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                    )}
                    <span>{club.name}</span>
                  </div>
                </TableCell>
                <TableCell>{club.sport}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span>{club.associationCount.toLocaleString()}</span>
                    {club.associationNames.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {club.associationNames.slice(0, 2).join(", ")}
                        {club.associationNames.length > 2 &&
                          ` +${club.associationNames.length - 2}`}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {club.teamCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {club.competitionCount.toLocaleString()}
                </TableCell>
                <TableCell className="text-center">
                  {club.hasAccount ? (
                    <Badge variant="primary" className="text-xs">
                      Yes
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      No
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button variant="accent" size="sm" asChild>
                      <Link href={`/dashboard/club/${club.id}`}>View</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
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

