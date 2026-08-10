"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Search,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClubInsight } from "@/types/clubInsights";

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
    undefined,
  );

  const filteredData = useMemo(() => {
    let filtered = clubs;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (club) =>
          club.name.toLowerCase().includes(query) ||
          club.sport.toLowerCase().includes(query) ||
          club.associationNames.some((name) =>
            name.toLowerCase().includes(query),
          ),
      );
    }

    if (minTeams !== undefined) {
      filtered = filtered.filter((club) => club.teamCount >= minTeams);
    }

    if (minCompetitions !== undefined) {
      filtered = filtered.filter(
        (club) => club.competitionCount >= minCompetitions,
      );
    }

    return filtered;
  }, [clubs, searchQuery, minTeams, minCompetitions]);

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
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = sortedData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

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
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-sm">No clubs found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-end gap-4 lg:flex-row">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, sport, or association..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="h-9 pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="min-w-[120px] space-y-1">
          <Label
            htmlFor="teams-filter"
            className="text-xs text-muted-foreground"
          >
            Min teams
          </Label>
          <Input
            id="teams-filter"
            type="number"
            placeholder="More than"
            value={minTeams ?? ""}
            onChange={(event) => {
              const value =
                event.target.value === ""
                  ? undefined
                  : parseInt(event.target.value, 10);
              setMinTeams(value);
              setCurrentPage(1);
            }}
            min="0"
            className="h-9 text-sm"
          />
        </div>

        <div className="min-w-[150px] space-y-1">
          <Label
            htmlFor="competitions-filter"
            className="text-xs text-muted-foreground"
          >
            Min competitions
          </Label>
          <Input
            id="competitions-filter"
            type="number"
            placeholder="More than"
            value={minCompetitions ?? ""}
            onChange={(event) => {
              const value =
                event.target.value === ""
                  ? undefined
                  : parseInt(event.target.value, 10);
              setMinCompetitions(value);
              setCurrentPage(1);
            }}
            min="0"
            className="h-9 text-sm"
          />
        </div>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="h-9 whitespace-nowrap"
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
        {filteredData.length !== clubs.length &&
          ` (filtered from ${clubs.length} total)`}
      </div>

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
                className="ml-auto h-auto p-0 font-semibold hover:bg-transparent"
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
                className="ml-auto h-auto p-0 font-semibold hover:bg-transparent"
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
                className="ml-auto h-auto p-0 font-semibold hover:bg-transparent"
              >
                Competitions
                {getSortIcon("competitionCount")}
              </Button>
            </TableHead>
            <TableHead className="text-center">Account</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-8 text-center text-muted-foreground"
              >
                No results found. Try adjusting your filters.
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((club) => (
              <TableRow key={club.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                      {club.logoUrl ? (
                        <Image
                          src={club.logoUrl}
                          alt={`${club.name} logo`}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-slate-500">
                          {club.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {club.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID {club.id}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {club.sport}
                  </Badge>
                </TableCell>
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
                      Linked
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Missing
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Button variant="primary" size="sm" asChild>
                      <Link href={`/dashboard/club/${club.id}`}>
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
            <div className="ml-auto flex items-center gap-1">
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
