"use client";

import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { formatDate } from "@/app/dashboard/fixtures/_components/_utils/dateUtils";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import {
  getTeamsDisplay,
  groupByGrade,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureUtils";
import { SearchInput } from "@/app/dashboard/fixtures/_components/_utils/SearchInput";
import {
  getRowColorClass,
  getStatusBadge,
} from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ErrorState } from "@/components/ui-library";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { Input } from "@/components/ui/input";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { useFixtureDetails } from "@/hooks/fixtures/useFixtureDetails";
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";
import {
  fixturesInReadinessWindow,
  sydneyToday,
} from "@/lib/readiness/fixtureDateWindow";
import {
  segmentedControlLabelClass,
  segmentedControlRowClass,
} from "@/lib/forms/segmentedControlStyles";
import { cn } from "@/lib/utils";
import type { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";
import type {
  FixtureDetailsResponse,
  FixtureSummary,
} from "@/types/fixtureInsights";

type FixtureSortField = "date" | "round" | "status";
type SortDirection = "asc" | "desc";
type FixtureScopeFilter = "all" | "render";

type AccountFixturesTabProps =
  | { kind: "association"; associationId: number }
  | { kind: "club"; clubId: number };

export default function AccountFixturesTab(props: AccountFixturesTabProps) {
  if (props.kind === "club") {
    return <ClubFixturesTab clubId={props.clubId} />;
  }
  return <AssociationFixturesTab associationId={props.associationId} />;
}

function AssociationFixturesTab({ associationId }: { associationId: number }) {
  const { data, isLoading, error, refetch } = useFixtureDetails({
    association: associationId,
  });
  const fixtures = data?.data?.fixtures ?? [];

  return (
    <FixtureList
      fixtures={fixtures}
      total={data?.data?.meta?.total ?? fixtures.length}
      dateRange={data?.data?.meta?.dateRange}
      isLoading={isLoading}
      error={error}
      onRetry={() => {
        void refetch();
      }}
      emptyLabel="No fixtures found for this association."
    />
  );
}

function ClubFixturesTab({ clubId }: { clubId: number }) {
  const drilldown = useCompetitionClubDrilldown(clubId);
  const namesByGrade = useMemo(
    () => clubTeamNamesByGrade(drilldown.data, clubId),
    [drilldown.data, clubId],
  );
  const gradeIds = useMemo(
    () => Array.from(namesByGrade.keys()),
    [namesByGrade],
  );
  const gradeQueries = useQueries({
    queries: gradeIds.map((gradeId) => ({
      queryKey: ["fixture-details", { grade: gradeId }] as const,
      queryFn: () => fetchFixtureDetails({ grade: gradeId }),
      staleTime: 2 * 60 * 1000,
    })),
  });
  const responses = gradeQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );
  const fixtures = fixturesForClub(responses, namesByGrade);
  const dateRange = responses.find((response) => response.data.meta?.dateRange)
    ?.data.meta.dateRange;
  const isLoading =
    drilldown.isLoading || gradeQueries.some((query) => query.isLoading);
  const error =
    drilldown.error ??
    gradeQueries.find((query) => query.error)?.error ??
    null;

  return (
    <FixtureList
      fixtures={fixtures}
      total={fixtures.length}
      dateRange={dateRange}
      isLoading={isLoading}
      error={error instanceof Error ? error : error ? new Error("Failed to load fixtures") : null}
      onRetry={() => {
        void drilldown.refetch();
        for (const query of gradeQueries) {
          void query.refetch();
        }
      }}
      emptyLabel="No fixtures found for this club."
    />
  );
}

function FixtureList({
  fixtures,
  total,
  dateRange,
  isLoading,
  error,
  onRetry,
  emptyLabel,
}: {
  fixtures: FixtureSummary[];
  total: number;
  dateRange?: { start: string; end: string };
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  emptyLabel: string;
}) {
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState<FixtureScopeFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<FixtureSortField | null>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    "asc",
  );

  const gradeChoices = useMemo(() => gradeFilterChoices(fixtures), [fixtures]);
  const visibleFixtures = useMemo(
    () =>
      sortFixtures(
        filterFixtures(fixtures, {
          teamSearchQuery,
          selectedGrade,
          dateFilter,
          scopeFilter,
          dateFrom,
          dateTo,
          today: new Date(),
          readinessAnchor: sydneyToday(),
        }),
        sortField,
        sortDirection,
      ),
    [
      fixtures,
      teamSearchQuery,
      selectedGrade,
      dateFilter,
      scopeFilter,
      dateFrom,
      dateTo,
      sortField,
      sortDirection,
    ],
  );
  const groupedFixtures = useMemo(
    () => groupByGrade(visibleFixtures),
    [visibleFixtures],
  );

  if (isLoading) {
    return (
      <SectionContainer
        title="Fixtures"
        description="Loading fixture data..."
        variant="compact"
      >
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer title="Fixtures" variant="compact">
        <ErrorState
          error={error}
          title="Failed to load fixtures"
          onRetry={onRetry}
          variant="card"
        />
      </SectionContainer>
    );
  }

  const noun = total === 1 ? "fixture" : "fixtures";
  const description = dateRange
    ? `${total} ${noun} from ${formatDate(dateRange.start)} to ${formatDate(dateRange.end)}`
    : `${total} ${noun}`;

  return (
    <SectionContainer title="Fixtures" description={description} variant="compact">
      {fixtures.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <div className="space-y-4">
          <FixtureFilters
            teamSearchQuery={teamSearchQuery}
            onTeamSearchQuery={setTeamSearchQuery}
            selectedGrade={selectedGrade}
            onSelectedGrade={setSelectedGrade}
            gradeChoices={gradeChoices}
            fixtureCount={fixtures.length}
            dateFilter={dateFilter}
            onDateFilter={setDateFilter}
            scopeFilter={scopeFilter}
            onScopeFilter={setScopeFilter}
            dateFrom={dateFrom}
            onDateFrom={setDateFrom}
            dateTo={dateTo}
            onDateTo={setDateTo}
          />
          {visibleFixtures.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {selectedGrade === "all"
                ? "No fixtures found."
                : `No fixtures found for ${selectedGrade}.`}
            </p>
          ) : (
            <FixtureTable
              groupedFixtures={groupedFixtures}
              onSort={(field) => {
                const next = nextSort(sortField, sortDirection, field);
                setSortField(next.field);
                setSortDirection(next.direction);
              }}
            />
          )}
        </div>
      )}
    </SectionContainer>
  );
}

function FixtureFilters({
  teamSearchQuery,
  onTeamSearchQuery,
  selectedGrade,
  onSelectedGrade,
  gradeChoices,
  fixtureCount,
  dateFilter,
  onDateFilter,
  scopeFilter,
  onScopeFilter,
  dateFrom,
  onDateFrom,
  dateTo,
  onDateTo,
}: {
  teamSearchQuery: string;
  onTeamSearchQuery: (value: string) => void;
  selectedGrade: string;
  onSelectedGrade: (value: string) => void;
  gradeChoices: Array<{ name: string; count: number }>;
  fixtureCount: number;
  dateFilter: string;
  onDateFilter: (value: string) => void;
  scopeFilter: FixtureScopeFilter;
  onScopeFilter: (value: FixtureScopeFilter) => void;
  dateFrom: string;
  onDateFrom: (value: string) => void;
  dateTo: string;
  onDateTo: (value: string) => void;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2 md:flex-row md:flex-wrap md:items-center">
      <SearchInput
        value={teamSearchQuery}
        onChange={onTeamSearchQuery}
        placeholder="Search by team name..."
        className="min-w-0 flex-1"
      />
      {gradeChoices.length > 0 && (
        <div className={cn(segmentedControlRowClass, "shrink-0")}>
          <label htmlFor="account-fixture-grade-filter" className={segmentedControlLabelClass}>
            Grade
          </label>
          <Select value={selectedGrade} onValueChange={onSelectedGrade}>
            <SelectTrigger
              id="account-fixture-grade-filter"
              className="h-9 w-[200px] rounded-full border-transparent bg-white shadow-none"
            >
              <SelectValue placeholder="All grades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All grades ({fixtureCount})</SelectItem>
              {gradeChoices.map((grade) => (
                <SelectItem key={grade.name} value={grade.name}>
                  {grade.name} ({grade.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className={cn(segmentedControlRowClass, "shrink-0")}>
        <label htmlFor="account-fixture-when-filter" className={segmentedControlLabelClass}>
          When
        </label>
        <Select value={dateFilter} onValueChange={onDateFilter}>
          <SelectTrigger
            id="account-fixture-when-filter"
            className="h-9 w-[140px] rounded-full border-transparent bg-white shadow-none"
          >
            <SelectValue placeholder="All dates" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All dates</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
            <SelectItem value="today">Today</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <LabeledSegmentedControl
        label="Include"
        value={scopeFilter}
        onValueChange={(value) => onScopeFilter(value as FixtureScopeFilter)}
        options={[
          { value: "all", label: "Show all" },
          { value: "render", label: "Show render" },
        ]}
        ariaLabel="Fixture scope"
        className="shrink-0"
      />
      <div className={cn(segmentedControlRowClass, "shrink-0")}>
        <label htmlFor="account-fixture-date-from" className={segmentedControlLabelClass}>
          From
        </label>
        <Input
          id="account-fixture-date-from"
          type="date"
          value={dateFrom}
          onChange={(event) => onDateFrom(event.target.value)}
          className="h-9 w-[150px] rounded-full border-transparent bg-white shadow-none"
        />
      </div>
      <div className={cn(segmentedControlRowClass, "shrink-0")}>
        <label htmlFor="account-fixture-date-to" className={segmentedControlLabelClass}>
          To
        </label>
        <Input
          id="account-fixture-date-to"
          type="date"
          value={dateTo}
          onChange={(event) => onDateTo(event.target.value)}
          className="h-9 w-[150px] rounded-full border-transparent bg-white shadow-none"
        />
      </div>
    </div>
  );
}

function FixtureTable({
  groupedFixtures,
  onSort,
}: {
  groupedFixtures: Record<string, FixtureSummary[]>;
  onSort: (field: FixtureSortField) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead>
            <SortHeader label="Date" field="date" onSort={onSort} />
          </TableHead>
          <TableHead>Fixture</TableHead>
          <TableHead>
            <SortHeader label="Round" field="round" onSort={onSort} />
          </TableHead>
          <TableHead>Type</TableHead>
          <TableHead>
            <SortHeader label="Status" field="status" onSort={onSort} />
          </TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(groupedFixtures).flatMap(([gradeName, gradeFixtures]) => [
          <TableRow key={`${gradeName}-header`} className="bg-slate-50/80 hover:bg-slate-50/80">
            <TableCell colSpan={6} className="py-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-900">{gradeName}</div>
                <Badge variant="outline">
                  {gradeFixtures.length} fixture
                  {gradeFixtures.length === 1 ? "" : "s"}
                </Badge>
              </div>
            </TableCell>
          </TableRow>,
          ...gradeFixtures.map((fixture) => (
            <TableRow key={fixture.id} className={getRowColorClass(fixture.status)}>
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
                {toFixtureDisplayText(fixture.round)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{toFixtureDisplayText(fixture.type)}</Badge>
              </TableCell>
              <TableCell>{getStatusBadge(fixture.status)}</TableCell>
              <TableCell className="text-right">
                <DashboardLinkButton
                  href={`/dashboard/fixtures/${fixture.id}`}
                  trailingIcon="arrow"
                >
                  View
                </DashboardLinkButton>
              </TableCell>
            </TableRow>
          )),
        ])}
      </TableBody>
    </Table>
  );
}

function SortHeader({
  label,
  field,
  onSort,
}: {
  label: string;
  field: FixtureSortField;
  onSort: (field: FixtureSortField) => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold hover:bg-transparent"
      onClick={() => onSort(field)}
    >
      {label}
    </Button>
  );
}

function gradeFilterChoices(fixtures: FixtureSummary[]) {
  const counts = new Map<string, number>();
  for (const fixture of fixtures) {
    const name = fixture.grade?.name;
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function filterFixtures(
  fixtures: FixtureSummary[],
  filters: {
    teamSearchQuery: string;
    selectedGrade: string;
    dateFilter: string;
    scopeFilter: FixtureScopeFilter;
    dateFrom: string;
    dateTo: string;
    today: Date;
    readinessAnchor: string;
  },
) {
  const query = filters.teamSearchQuery.trim().toLowerCase();
  let filtered = fixtures.filter((fixture) => {
    if (filters.selectedGrade !== "all" && fixture.grade?.name !== filters.selectedGrade) {
      return false;
    }
    if (query && !getTeamsDisplay(fixture).toLowerCase().includes(query)) {
      return false;
    }
    return matchesWhen(fixture, filters.dateFilter, filters.today);
  });

  if (filters.scopeFilter === "render") {
    filtered = fixturesInReadinessWindow(filtered, filters.readinessAnchor);
  }

  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter((fixture) =>
      matchesCalendarRange(fixture, filters.dateFrom, filters.dateTo),
    );
  }

  return filtered;
}

function matchesCalendarRange(
  fixture: FixtureSummary,
  dateFrom: string,
  dateTo: string,
) {
  if (!dateFrom && !dateTo) return true;
  if (!fixture.date) return false;
  const day = fixture.date.slice(0, 10);
  if (dateFrom && day < dateFrom) return false;
  if (dateTo && day > dateTo) return false;
  return true;
}

function matchesWhen(fixture: FixtureSummary, dateFilter: string, today: Date) {
  if (dateFilter === "all") return true;
  if (!fixture.date) return false;
  try {
    const fixtureDate = startOfDay(parseISO(fixture.date));
    const start = startOfDay(today);
    if (dateFilter === "upcoming") return isAfter(fixtureDate, start);
    if (dateFilter === "past") return isBefore(fixtureDate, start);
    if (dateFilter === "today") return fixtureDate.getTime() === start.getTime();
    return true;
  } catch {
    return false;
  }
}

function sortFixtures(
  fixtures: FixtureSummary[],
  sortField: FixtureSortField | null,
  sortDirection: SortDirection | null,
) {
  if (!sortField || !sortDirection) return fixtures;
  return [...fixtures].sort((a, b) =>
    compareFixtures(a, b, sortField, sortDirection),
  );
}

function compareFixtures(
  a: FixtureSummary,
  b: FixtureSummary,
  sortField: FixtureSortField,
  sortDirection: SortDirection,
) {
  const aValue = sortValue(a, sortField);
  const bValue = sortValue(b, sortField);
  if (aValue === null && bValue === null) return 0;
  if (aValue === null) return 1;
  if (bValue === null) return -1;
  if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
  if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
  return 0;
}

function sortValue(fixture: FixtureSummary, sortField: FixtureSortField) {
  if (sortField === "date") return fixture.date;
  if (sortField === "round") {
    return toFixtureDisplayText(fixture.round, "").toLowerCase();
  }
  return toFixtureDisplayText(fixture.status, "").toLowerCase();
}

function nextSort(
  sortField: FixtureSortField | null,
  sortDirection: SortDirection | null,
  clicked: FixtureSortField,
) {
  if (sortField !== clicked || sortDirection === null) {
    return { field: clicked, direction: "asc" as const };
  }
  if (sortDirection === "asc") {
    return { field: clicked, direction: "desc" as const };
  }
  return { field: null, direction: null };
}

function clubTeamNamesByGrade(
  drilldown: CompetitionClubDrilldownResponse | undefined,
  clubId: number,
) {
  const namesByGrade = new Map<number, Set<string>>();
  if (!drilldown) return namesByGrade;

  for (const competition of drilldown.competitions) {
    for (const grade of competition.grades) {
      for (const team of grade.teams) {
        if (team.club?.id != null && team.club.id !== clubId) continue;
        const name = team.name.trim().toLowerCase();
        if (!name) continue;
        const names = namesByGrade.get(grade.id) ?? new Set<string>();
        names.add(name);
        namesByGrade.set(grade.id, names);
      }
    }
  }

  return namesByGrade;
}

function fixturesForClub(
  responses: FixtureDetailsResponse[],
  namesByGrade: Map<number, Set<string>>,
) {
  const seen = new Set<number>();
  const kept: FixtureSummary[] = [];

  for (const response of responses) {
    for (const fixture of response.data.fixtures) {
      if (seen.has(fixture.id)) continue;
      const gradeId = fixture.grade?.id;
      if (gradeId == null) continue;
      const names = namesByGrade.get(gradeId);
      if (!names) continue;
      const home = toFixtureDisplayText(fixture.teams?.home, "").toLowerCase();
      const away = toFixtureDisplayText(fixture.teams?.away, "").toLowerCase();
      if (!names.has(home) && !names.has(away)) continue;
      seen.add(fixture.id);
      kept.push(fixture);
    }
  }

  return kept;
}
