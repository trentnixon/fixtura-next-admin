"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";
import { startOfDay } from "date-fns";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFixtureDetails } from "@/hooks/fixtures/useFixtureDetails";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState, ErrorState } from "@/components/ui-library";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import TriggerFixtureDiscoveryButton from "./TriggerFixtureDiscoveryButton";
import TriggerResultBatchScrapeButton from "@/app/dashboard/competitions/components/TriggerResultBatchScrapeButton";
import { GradeSnapshotMetric } from "./GradeSnapshotSection";
import { SearchInput } from "@/app/dashboard/fixtures/_components/_utils/SearchInput";
import { formatDate } from "@/app/dashboard/fixtures/_components/_utils/dateUtils";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { getTeamsDisplay } from "@/app/dashboard/fixtures/_components/_utils/fixtureUtils";
import {
  getRowColorClass,
  getStatusBadge,
} from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import { useSorting } from "@/app/dashboard/fixtures/_components/_utils/useSorting";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import type { FixtureSummary } from "@/types/fixtureInsights";
import {
  classifyGradeFixture,
  isGradeFixtureListGroup,
  type GradeFixtureListGroup,
} from "./gradeFixtureListGroup";

type FixtureSortField = "date" | "round" | "status";

const fixtureListTabs = [
  { value: "complete", label: "Complete", icon: CheckCircle2 },
  { value: "scheduled", label: "Scheduled", icon: CalendarDays },
  { value: "needs-result", label: "Needs result", icon: AlertTriangle },
] as const;

const fixtureListCopy: Record<
  GradeFixtureListGroup,
  { detail: string; empty: string }
> = {
  complete: {
    detail: "Finished or completed",
    empty: "No completed fixtures for this grade.",
  },
  scheduled: {
    detail: "Still to play, in progress, or cancelled",
    empty: "No scheduled fixtures for this grade.",
  },
  "needs-result": {
    detail: "Game day has passed and no result is stored",
    empty: "Every past game has a result status.",
  },
};

function compareFixtures(
  a: FixtureSummary,
  b: FixtureSummary,
  sortField: FixtureSortField,
  sortDirection: "asc" | "desc",
) {
  let aValue: string | null;
  let bValue: string | null;

  switch (sortField) {
    case "date":
      aValue = a.date;
      bValue = b.date;
      break;
    case "round":
      aValue = toFixtureDisplayText(a.round, "").toLowerCase();
      bValue = toFixtureDisplayText(b.round, "").toLowerCase();
      break;
    case "status":
      aValue = toFixtureDisplayText(a.status, "").toLowerCase();
      bValue = toFixtureDisplayText(b.status, "").toLowerCase();
      break;
  }

  if (aValue === null && bValue === null) return 0;
  if (aValue === null) return 1;
  if (bValue === null) return -1;
  if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
  if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
  return 0;
}

export interface GradeFixturesTableProps {
  gradeId: number;
}

function FixturesSectionActions({ gradeId }: { gradeId: number }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <TriggerFixtureDiscoveryButton
        gradeId={gradeId}
        disabled={gradeId <= 0}
        triggerMode="button"
      />
      <TriggerResultBatchScrapeButton
        sourceType="grade"
        sourceId={gradeId}
        disabled={gradeId <= 0}
        triggerMode="button"
      />
    </div>
  );
}

export function GradeFixturesTable({ gradeId }: GradeFixturesTableProps) {
  const { data, isLoading, error, refetch } = useFixtureDetails({
    grade: gradeId,
  });
  const { sortField, sortDirection, handleSort, getSortIcon } =
    useSorting<FixtureSortField>({ allowClear: true });
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [listGroup, setListGroup] =
    useState<GradeFixtureListGroup>("scheduled");

  const allFixtures = data?.data?.fixtures ?? [];

  const overviewCounts = useMemo(() => {
    const today = startOfDay(new Date());
    const counts: Record<GradeFixtureListGroup, number> = {
      complete: 0,
      scheduled: 0,
      "needs-result": 0,
    };

    for (const fixture of allFixtures) {
      counts[classifyGradeFixture(fixture, today)] += 1;
    }

    return counts;
  }, [allFixtures]);

  const groupedFixtures = useMemo(() => {
    const today = startOfDay(new Date());
    const groups: Record<GradeFixtureListGroup, FixtureSummary[]> = {
      complete: [],
      scheduled: [],
      "needs-result": [],
    };

    const query = teamSearchQuery.trim().toLowerCase();

    for (const fixture of allFixtures) {
      if (query) {
        const home = toFixtureDisplayText(
          fixture.teams?.home,
          "",
        ).toLowerCase();
        const away = toFixtureDisplayText(
          fixture.teams?.away,
          "",
        ).toLowerCase();
        if (!home.includes(query) && !away.includes(query)) continue;
      }

      groups[classifyGradeFixture(fixture, today)].push(fixture);
    }

    const direction: "asc" | "desc" =
      sortField && sortDirection
        ? sortDirection
        : listGroup === "scheduled"
          ? "asc"
          : "desc";
    const field: FixtureSortField = sortField ?? "date";

    for (const group of Object.values(groups)) {
      group.sort((a, b) => compareFixtures(a, b, field, direction));
    }

    return groups;
  }, [allFixtures, listGroup, sortDirection, sortField, teamSearchQuery]);

  const fixtures = groupedFixtures[listGroup];
  const groupCounts = {
    complete: groupedFixtures.complete.length,
    scheduled: groupedFixtures.scheduled.length,
    "needs-result": groupedFixtures["needs-result"].length,
  };

  const dateRangeLabel = useMemo(() => {
    const range = data?.data?.meta?.dateRange;
    if (!range?.start || !range?.end) return null;
    try {
      return `${formatDate(range.start)} – ${formatDate(range.end)}`;
    } catch {
      return null;
    }
  }, [data?.data?.meta?.dateRange]);

  const sectionTitle = "Fixtures";
  const sectionIcon = (
    <CalendarDays className="h-5 w-5 text-slate-500" aria-hidden />
  );

  if (isLoading) {
    return (
      <SectionContainer
        title={sectionTitle}
        description="Loading fixture records for this grade..."
        icon={sectionIcon}
        action={<FixturesSectionActions gradeId={gradeId} />}
      >
        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[72px] w-full" />
          ))}
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              {["Date", "Fixture", "Round", "Type", "Status", "Action"].map(
                (label) => (
                  <TableHead key={label}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionContainer>
    );
  }

  if (error) {
    return (
      <SectionContainer
        title={sectionTitle}
        description="Game metadata stored in the CMS for this grade."
        icon={sectionIcon}
        action={<FixturesSectionActions gradeId={gradeId} />}
      >
        <ErrorState
          error={error}
          title="Failed to load fixtures"
          onRetry={() => refetch()}
          variant="card"
        />
      </SectionContainer>
    );
  }

  if (allFixtures.length === 0) {
    return (
      <SectionContainer
        title={sectionTitle}
        description="Game metadata stored in the CMS for this grade."
        icon={sectionIcon}
        action={<FixturesSectionActions gradeId={gradeId} />}
      >
        <EmptyState
          title="No fixtures stored"
          description="Queue Discover fixtures to pull games from PlayHQ, then return here to review stored metadata."
          action={
            <TriggerFixtureDiscoveryButton
              gradeId={gradeId}
              disabled={gradeId <= 0}
              triggerMode="button"
            />
          }
        />
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title={sectionTitle}
      description={
        dateRangeLabel
          ? `${allFixtures.length} fixture${allFixtures.length === 1 ? "" : "s"} · ${dateRangeLabel}`
          : `${allFixtures.length} fixture${allFixtures.length === 1 ? "" : "s"} in the CMS`
      }
      icon={sectionIcon}
      action={<FixturesSectionActions gradeId={gradeId} />}
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <GradeSnapshotMetric
          title="Total"
          value={String(allFixtures.length)}
          detail="Stored for this grade"
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <GradeSnapshotMetric
          title="Complete"
          value={String(overviewCounts.complete)}
          detail={fixtureListCopy.complete.detail}
          icon={<CheckCircle2 className="h-4 w-4" />}
        />
        <GradeSnapshotMetric
          title="Scheduled"
          value={String(overviewCounts.scheduled)}
          detail={fixtureListCopy.scheduled.detail}
          icon={<CalendarDays className="h-4 w-4" />}
        />
        <GradeSnapshotMetric
          title="Needs result"
          value={String(overviewCounts["needs-result"])}
          detail={fixtureListCopy["needs-result"].detail}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </div>

      <Tabs
        value={listGroup}
        onValueChange={(value) => {
          if (isGradeFixtureListGroup(value)) setListGroup(value);
        }}
      >
        <TabsList variant="primary" className={sectionTabListClass}>
          {fixtureListTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {tab.label} ({groupCounts[tab.value]})
              </TabsTrigger>
            );
          })}
        </TabsList>
        <TabsContent value={listGroup} className="mt-4 space-y-4">
          <p className="text-sm text-slate-500">
            {fixtureListCopy[listGroup].detail}
          </p>
          <div className="flex min-w-0 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2">
            <SearchInput
              value={teamSearchQuery}
              onChange={setTeamSearchQuery}
              placeholder="Search by team name..."
              className="min-w-0 flex-1"
            />
          </div>

      <div className="mt-4 overflow-hidden rounded-md border">
        <ScrollArea className="w-full">
          <Table className="min-w-[720px]">
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixtures.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="py-8 text-center text-sm text-muted-foreground"
              >
                {teamSearchQuery
                  ? "No fixtures match that team."
                  : fixtureListCopy[listGroup].empty}
              </TableCell>
            </TableRow>
          ) : (
            fixtures.map((fixture) => (
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
                    ID {fixture.id}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {toFixtureDisplayText(fixture.round)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {toFixtureDisplayText(fixture.type)}
                  </Badge>
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
            ))
          )}
        </TableBody>
          </Table>
        </ScrollArea>
      </div>
        </TabsContent>
      </Tabs>
    </SectionContainer>
  );
}
