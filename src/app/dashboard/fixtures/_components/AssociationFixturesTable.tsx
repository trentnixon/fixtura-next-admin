"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFixtureDetails } from "@/hooks/fixtures/useFixtureDetails";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { isAfter, isBefore, startOfDay, parseISO } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSorting } from "./_utils/useSorting";
import { SearchInput } from "./_utils/SearchInput";
import { formatDate } from "./_utils/dateUtils";
import { getStatusBadge, getRowColorClass } from "./_utils/statusUtils";
import { groupByGrade, getTeamsDisplay } from "./_utils/fixtureUtils";

interface AssociationFixturesTableProps {
  associationId: number;
  onBack: () => void;
}

type FixtureSortField = "date" | "round" | "grade" | "status";

/**
 * AssociationFixturesTable Component
 *
 * Displays fixtures for a selected association.
 * Users can view fixture details and navigate back to the association list.
 */
export function AssociationFixturesTable({
  associationId,
  onBack,
}: AssociationFixturesTableProps) {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useFixtureDetails({
    association: associationId,
  });
  const { sortField, sortDirection, handleSort, getSortIcon } =
    useSorting<FixtureSortField>({ allowClear: true });
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Get fixtures from API data and group by grade
  const fixtures = useMemo(() => {
    if (!data?.data?.fixtures) {
      return [];
    }

    let filtered = [...data.data.fixtures];

    // Apply grade filter
    if (selectedGrade !== "all") {
      filtered = filtered.filter(
        (fixture) => fixture.grade?.name === selectedGrade,
      );
    }

    // Apply team name search filter
    if (teamSearchQuery) {
      filtered = filtered.filter((fixture) => {
        const home = fixture.teams?.home?.toLowerCase() || "";
        const away = fixture.teams?.away?.toLowerCase() || "";
        const query = teamSearchQuery.toLowerCase();
        return home.includes(query) || away.includes(query);
      });
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = startOfDay(new Date());
      filtered = filtered.filter((fixture) => {
        if (!fixture.date) return false;
        try {
          const fixtureDate = startOfDay(parseISO(fixture.date));
          switch (dateFilter) {
            case "upcoming":
              return isAfter(fixtureDate, now);
            case "past":
              return isBefore(fixtureDate, now);
            case "today":
              return fixtureDate.getTime() === now.getTime();
            default:
              return true;
          }
        } catch {
          return false;
        }
      });
    }

    // Apply sorting
    if (sortField && sortDirection) {
      filtered.sort((a, b) => {
        let aValue: string | number | null;
        let bValue: string | number | null;

        switch (sortField) {
          case "date":
            aValue = a.date;
            bValue = b.date;
            break;
          case "round":
            aValue = a.round?.toLowerCase() || "";
            bValue = b.round?.toLowerCase() || "";
            break;
          case "grade":
            aValue = a.grade?.name?.toLowerCase() || "";
            bValue = b.grade?.name?.toLowerCase() || "";
            break;
          case "status":
            aValue = a.status?.toLowerCase() || "";
            bValue = b.status?.toLowerCase() || "";
            break;
          default:
            return 0;
        }

        // Handle null values
        if (aValue === null && bValue === null) return 0;
        if (aValue === null) return 1;
        if (bValue === null) return -1;

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [
    data,
    sortField,
    sortDirection,
    selectedGrade,
    teamSearchQuery,
    dateFilter,
  ]);

  // Group fixtures by grade for display
  const groupedFixtures = useMemo(() => {
    return groupByGrade(fixtures);
  }, [fixtures]);

  // Get unique grades for filter dropdown with counts
  const availableGrades = useMemo(() => {
    if (!data?.data?.fixtures) return [];
    const gradeMap = new Map<string, number>();
    data.data.fixtures.forEach((fixture) => {
      if (fixture.grade?.name) {
        gradeMap.set(
          fixture.grade.name,
          (gradeMap.get(fixture.grade.name) || 0) + 1,
        );
      }
    });
    return Array.from(gradeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  // Handle view details
  const handleViewDetails = (fixtureId: number) => {
    router.push(`/dashboard/fixtures/${fixtureId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <SectionContainer
        title="Fixtures"
        description="Loading fixture data..."
        variant="compact"
      >
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Associations
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-40" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
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
        title="Fixtures"
        description="Fixture data for the selected association"
        variant="compact"
      >
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Associations
          </Button>
        </div>
        <ErrorState
          error={error}
          title="Failed to load fixtures"
          onRetry={() => refetch()}
          variant="card"
        />
      </SectionContainer>
    );
  }

  // Empty state
  if (fixtures.length === 0) {
    return (
      <SectionContainer
        title="Fixtures"
        description="Fixture data for the selected association"
        variant="compact"
      >
        <div className="flex items-center justify-between mb-6">
          <div></div>
          <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Associations
          </Button>
        </div>
        <p className="text-center text-muted-foreground py-8">
          No fixtures found for this association.
        </p>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Fixtures"
      description="Fixture data for the selected association"
      variant="compact"
    >
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_200px_180px]">
            {/* Team Search */}
            <SearchInput
              value={teamSearchQuery}
              onChange={setTeamSearchQuery}
              placeholder="Search by team name..."
              className="min-w-0"
            />

            {/* Grade Filter */}
            {availableGrades.length > 0 && (
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Grades ({data?.data?.fixtures?.length || 0})
                  </SelectItem>
                  {availableGrades.map((grade) => (
                    <SelectItem key={grade.name} value={grade.name}>
                      {grade.name} ({grade.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past</SelectItem>
                <SelectItem value="today">Today</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="secondary" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Associations
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort("date")}
              >
                Date
                {getSortIcon("date")}
              </Button>
            </TableHead>
            <TableHead>Fixture</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort("round")}
              >
                Round
                {getSortIcon("round")}
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 font-semibold hover:bg-transparent"
                onClick={() => handleSort("status")}
              >
                Status
                {getSortIcon("status")}
              </Button>
            </TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(groupedFixtures).length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                No fixtures found
                {selectedGrade !== "all" ? ` for ${selectedGrade}` : ""}.
              </TableCell>
            </TableRow>
          ) : (
            Object.entries(groupedFixtures).flatMap(
              ([gradeName, gradeFixtures]) => [
                <TableRow
                  key={`${gradeName}-header`}
                  className="bg-slate-50/80 hover:bg-slate-50/80"
                >
                  <TableCell colSpan={6} className="py-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-slate-900">
                        {gradeName}
                      </div>
                      <Badge variant="outline">
                        {gradeFixtures.length} fixture
                        {gradeFixtures.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>,
                ...gradeFixtures.map((fixture) => (
                  <TableRow
                    key={fixture.id}
                    className={getRowColorClass(fixture.status)}
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatDate(fixture.date)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-900">
                        {getTeamsDisplay(fixture)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {fixture.competition?.name ?? "Competition unknown"}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {fixture.round || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{fixture.type || "N/A"}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(fixture.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleViewDetails(fixture.id)}
                      >
                        View
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )),
              ],
            )
          )}
        </TableBody>
      </Table>
    </SectionContainer>
  );
}
