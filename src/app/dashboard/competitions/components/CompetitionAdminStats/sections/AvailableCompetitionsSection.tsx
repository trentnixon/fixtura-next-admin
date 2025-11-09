import { useMemo, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
  PaginationInfo,
} from "@/components/ui/pagination";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";
import { Label } from "@/components/ui/label";

import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";
import { formatNumber } from "../helpers";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

type SortField =
  | "name"
  | "season"
  | "association"
  | "sport"
  | "gradeCount"
  | "weight";
type SortDirection = "asc" | "desc";

interface AvailableCompetitionsSectionProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
}

function renderSizeCategoryBadge(
  category: CompetitionAdminStatsAvailableCompetition["sizeCategory"]
) {
  const labelMap: Record<
    CompetitionAdminStatsAvailableCompetition["sizeCategory"],
    string
  > = {
    none: "No Grades",
    small: "Small",
    medium: "Medium",
    large: "Large",
  };

  return <Badge variant="primary">{labelMap[category]}</Badge>;
}

export function AvailableCompetitionsSection({
  competitions,
}: AvailableCompetitionsSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState<
    CompetitionAdminStatsAvailableCompetition["sizeCategory"] | "all"
  >("all");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_OPTIONS[0]);

  const sportOptions = useMemo(() => {
    const sports = new Set<string>();
    competitions.forEach((competition) => {
      if (competition.sport && competition.sport.trim().length > 0) {
        sports.add(competition.sport);
      }
    });
    return Array.from(sports).sort((a, b) => a.localeCompare(b));
  }, [competitions]);

  const filteredData = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return competitions.filter((competition) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        competition.name.toLowerCase().includes(normalizedQuery) ||
        (competition.associationName &&
          competition.associationName
            .toLowerCase()
            .includes(normalizedQuery)) ||
        (competition.season &&
          competition.season.toLowerCase().includes(normalizedQuery)) ||
        (competition.sport &&
          competition.sport.toLowerCase().includes(normalizedQuery));

      const matchesSize =
        sizeFilter === "all" || competition.sizeCategory === sizeFilter;

      const matchesSport =
        sportFilter === "all" || competition.sport === sportFilter;

      return matchesQuery && matchesSize && matchesSport;
    });
  }, [competitions, searchQuery, sizeFilter, sportFilter]);

  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      let aValue: string | number | null = null;
      let bValue: string | number | null = null;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "season":
          aValue = (a.season ?? "").toLowerCase();
          bValue = (b.season ?? "").toLowerCase();
          break;
        case "association":
          aValue = (a.associationName ?? "").toLowerCase();
          bValue = (b.associationName ?? "").toLowerCase();
          break;
        case "sport":
          aValue = (a.sport ?? "").toLowerCase();
          bValue = (b.sport ?? "").toLowerCase();
          break;
        case "gradeCount":
          aValue = a.gradeCount;
          bValue = b.gradeCount;
          break;
        case "weight":
          aValue = a.weight;
          bValue = b.weight;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (aValue === bValue) return 0;
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

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
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSizeFilter("all");
    setSportFilter("all");
    setSortField(null);
    setSortDirection(null);
    setItemsPerPage(ITEMS_PER_PAGE_OPTIONS[0]);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    sizeFilter !== "all" ||
    sportFilter !== "all" ||
    sortField !== null ||
    itemsPerPage !== ITEMS_PER_PAGE_OPTIONS[0];

  return (
    <SectionContainer
      title="Available Competitions"
      description="Search, filter, and sort competitions returned by the admin stats endpoint."
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-2">
            <Label htmlFor="competition-search" className="text-sm font-medium">
              Search
            </Label>
            <div className="relative w-[240px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="competition-search"
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1.5 top-1.5 h-6 w-6"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="size-filter" className="text-sm font-medium">
              Size Category
            </Label>
            <Select
              value={sizeFilter}
              onValueChange={(value) => {
                setSizeFilter(value as typeof sizeFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="size-filter" className="w-[180px]">
                <SelectValue placeholder="All sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sizes</SelectItem>
                <SelectItem value="none">No Grades</SelectItem>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sport-filter" className="text-sm font-medium">
              Sport
            </Label>
            <Select
              value={sportFilter}
              onValueChange={(value) => {
                setSportFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="sport-filter" className="w-[200px]">
                <SelectValue placeholder="All sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sports</SelectItem>
                {sportOptions.map((sport) => (
                  <SelectItem key={sport} value={sport}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="items-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                const parsed = Number(value);
                setItemsPerPage(parsed);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger id="items-per-page" className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            size="sm"
            disabled={!hasActiveFilters}
            onClick={handleResetFilters}
            variant="accent"
          >
            Reset filters
          </Button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">
                  <button
                    type="button"
                    className="flex items-center"
                    onClick={() => handleSort("name")}
                  >
                    Competition
                    {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <button
                    type="button"
                    className="flex items-center justify-center"
                    onClick={() => handleSort("season")}
                  >
                    Season
                    {getSortIcon("season")}
                  </button>
                </TableHead>
                <TableHead className="min-w-[200px]">
                  <button
                    type="button"
                    className="flex items-center justify-center"
                    onClick={() => handleSort("association")}
                  >
                    Association
                    {getSortIcon("association")}
                  </button>
                </TableHead>
                <TableHead className="min-w-[160px] text-right">
                  <button
                    type="button"
                    className="flex items-center justify-center"
                    onClick={() => handleSort("sport")}
                  >
                    Sport
                    {getSortIcon("sport")}
                  </button>
                </TableHead>
                <TableHead className="min-w-[120px] text-right">
                  <button
                    type="button"
                    className="flex items-center justify-end"
                    onClick={() => handleSort("gradeCount")}
                  >
                    Grades
                    {getSortIcon("gradeCount")}
                  </button>
                </TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="min-w-[120px] text-right">
                  <button
                    type="button"
                    className="flex items-center justify-end"
                    onClick={() => handleSort("weight")}
                  >
                    Weight
                    {getSortIcon("weight")}
                  </button>
                </TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell className="font-medium">
                    {competition.name}
                  </TableCell>
                  <TableCell>{competition.season ?? "—"}</TableCell>
                  <TableCell>{competition.associationName ?? "—"}</TableCell>
                  <TableCell>{competition.sport ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(competition.gradeCount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {renderSizeCategoryBadge(competition.sizeCategory)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(competition.weight)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {competition.durationDays
                      ? `${competition.durationDays} days`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="accent">
                      <Link href={`/dashboard/competitions/${competition.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {paginatedData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No competitions match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          variant="primary"
          className="w-full justify-between"
        >
          <PaginationInfo
            format="long"
            totalItems={sortedData.length}
            itemsPerPage={itemsPerPage}
            className="mr-auto"
          />
          <div className="flex items-center gap-1 ml-auto">
            <PaginationPrevious showLabel={false} />
            <PaginationPages />
            <PaginationNext showLabel={false} />
          </div>
        </Pagination>
      </div>
    </SectionContainer>
  );
}
