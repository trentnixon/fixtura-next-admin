import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
} from "lucide-react";
import {
  segmentedControlLabelClass,
  segmentedControlRowClass,
} from "@/lib/forms/segmentedControlStyles";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";

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
  category: CompetitionAdminStatsAvailableCompetition["sizeCategory"],
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
    null,
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
    <div id="competitions-table" className="space-y-4">
        <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 md:flex-row md:flex-wrap md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="competition-search"
              type="search"
              placeholder="Search name, association, season, sport…"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-full border-transparent bg-white pl-9 shadow-none"
            />
          </div>

          <div className={cn(segmentedControlRowClass, "shrink-0")}>
            <label htmlFor="size-filter" className={segmentedControlLabelClass}>
              Size
            </label>
            <Select
              value={sizeFilter}
              onValueChange={(value) => {
                setSizeFilter(value as typeof sizeFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger
                id="size-filter"
                className="h-9 w-[140px] rounded-full border-transparent bg-white shadow-none"
              >
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

          <div className={cn(segmentedControlRowClass, "shrink-0")}>
            <label htmlFor="sport-filter" className={segmentedControlLabelClass}>
              Sport
            </label>
            <Select
              value={sportFilter}
              onValueChange={(value) => {
                setSportFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger
                id="sport-filter"
                className="h-9 w-[160px] rounded-full border-transparent bg-white shadow-none"
              >
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

          <div className={cn(segmentedControlRowClass, "shrink-0")}>
            <label
              htmlFor="items-per-page"
              className={segmentedControlLabelClass}
            >
              Rows
            </label>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                const parsed = Number(value);
                setItemsPerPage(parsed);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger
                id="items-per-page"
                className="h-9 w-[88px] rounded-full border-transparent bg-white shadow-none"
              >
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

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className={cn(siteNavigationCtaClass, "w-full shrink-0 md:w-auto")}
            >
              Reset filters
            </Button>
          )}
        </div>

        <div className="px-1 text-sm text-muted-foreground">
          Showing {paginatedData.length} of {sortedData.length} results
          {filteredData.length !== competitions.length &&
            ` (filtered from ${competitions.length} total)`}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
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
                  <TableCell>{competition.season ?? "-"}</TableCell>
                  <TableCell>{competition.associationName ?? "-"}</TableCell>
                  <TableCell>{competition.sport ?? "-"}</TableCell>
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
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DashboardLinkButton
                      href={`/dashboard/competitions/${competition.id}`}
                      trailingIcon="arrow"
                    >
                      View
                    </DashboardLinkButton>
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
  );
}
