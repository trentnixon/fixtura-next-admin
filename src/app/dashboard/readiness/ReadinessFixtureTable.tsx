"use client";

import { useMemo, useState } from "react";
import { CalendarDays, History, RefreshCw, Search } from "lucide-react";
import { format } from "date-fns";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import {
  getTeamsDisplay,
  groupByGrade,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureUtils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  splitFixturesByPlayDay,
  sydneyToday,
} from "@/lib/readiness/fixtureDateWindow";
import type { FixtureCompletenessScore } from "@/lib/readiness/scoreFixtureCompleteness";
import type { FixtureSummary } from "@/types/fixtureInsights";
import {
  FixtureDataButton,
  ReadinessFixtureDataDialog,
} from "@/app/dashboard/readiness/ReadinessFixtureDataDialog";
import { ResultSingleScrapeConfirmDialog } from "@/app/dashboard/fixtures/[id]/_components/TriggerResultSingleScrapeButton";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";

const ALL = "all";

function statusLabel(status: FixtureSummary["status"]): string {
  return toFixtureDisplayText(status, "Unknown");
}

function matchesFilters(
  fixture: FixtureSummary,
  filter: {
    teamQuery: string;
    competitionId: string;
    gradeId: string;
    status: string;
  },
) {
  if (
    filter.competitionId !== ALL &&
    String(fixture.competition?.id ?? "") !== filter.competitionId
  ) {
    return false;
  }
  if (filter.gradeId !== ALL && String(fixture.grade?.id ?? "") !== filter.gradeId) {
    return false;
  }
  if (filter.status !== ALL && statusLabel(fixture.status) !== filter.status) {
    return false;
  }
  const needle = filter.teamQuery.trim().toLowerCase();
  if (!needle) return true;
  const home = toFixtureDisplayText(fixture.teams?.home, "").toLowerCase();
  const away = toFixtureDisplayText(fixture.teams?.away, "").toLowerCase();
  return home.includes(needle) || away.includes(needle);
}

function namedOptions(
  fixtures: FixtureSummary[],
  read: (fixture: FixtureSummary) => { id: number; name: string } | null,
) {
  const byId = new Map<string, string>();
  for (const fixture of fixtures) {
    const item = read(fixture);
    if (!item) continue;
    byId.set(String(item.id), item.name);
  }
  return [...byId.entries()].sort((left, right) =>
    left[1].localeCompare(right[1], "en"),
  );
}

function formatDayMonth(isoDate: string | null): string {
  if (!isoDate) return "No date";
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "No date";
  return format(new Date(year, month - 1, day), "MMM d");
}

function datesInGrade(fixtures: FixtureSummary[]) {
  const order: string[] = [];
  const byDate = new Map<string, FixtureSummary[]>();
  for (const fixture of fixtures) {
    const key = fixture.date?.slice(0, 10) ?? "";
    const existing = byDate.get(key);
    if (existing) {
      existing.push(fixture);
      continue;
    }
    order.push(key);
    byDate.set(key, [fixture]);
  }
  return order.map((key) => ({
    key,
    label: formatDayMonth(key || null),
    fixtures: byDate.get(key) ?? [],
  }));
}

function typesOnDate(fixtures: FixtureSummary[]) {
  const byType = new Map<string, FixtureSummary[]>();
  for (const fixture of fixtures) {
    const label = toFixtureDisplayText(fixture.type);
    const existing = byType.get(label);
    if (existing) {
      existing.push(fixture);
      continue;
    }
    byType.set(label, [fixture]);
  }
  return [...byType.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en"))
    .map(([label, grouped]) => ({ label, fixtures: grouped }));
}

function resultLabel(finding: { percentage: number; reason: string | null } | undefined) {
  if (!finding) return "—";
  if (finding.percentage === 100) return "100%";
  return finding.reason
    ? `${finding.percentage}% · ${finding.reason}`
    : `${finding.percentage}%`;
}

function unexpectedStatus(finding: { reason: string | null } | undefined) {
  return finding?.reason === "unexpected status";
}

export function ReadinessFixtureTable({
  fixtures,
  beforeScore,
}: {
  fixtures: FixtureSummary[];
  beforeScore: FixtureCompletenessScore | null;
}) {
  const [teamQuery, setTeamQuery] = useState("");
  const [competitionId, setCompetitionId] = useState(ALL);
  const [gradeId, setGradeId] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [openFixtureId, setOpenFixtureId] = useState<number | null>(null);
  const [scrapeFixtureId, setScrapeFixtureId] = useState<number | null>(null);

  const competitions = useMemo(
    () => namedOptions(fixtures, (fixture) => fixture.competition),
    [fixtures],
  );
  const grades = useMemo(() => {
    const source =
      competitionId === ALL
        ? fixtures
        : fixtures.filter(
            (fixture) => String(fixture.competition?.id ?? "") === competitionId,
          );
    return namedOptions(source, (fixture) => fixture.grade);
  }, [competitionId, fixtures]);
  const statuses = useMemo(() => {
    const labels = new Set(fixtures.map((fixture) => statusLabel(fixture.status)));
    return [...labels].sort((left, right) => left.localeCompare(right, "en"));
  }, [fixtures]);

  const grouped = useMemo(() => {
    const split = splitFixturesByPlayDay(fixtures, sydneyToday());
    const byDate = (left: FixtureSummary, right: FixtureSummary) =>
      (left.date ?? "").localeCompare(right.date ?? "");
    const filtered = fixtures.filter((fixture) =>
      matchesFilters(fixture, { teamQuery, competitionId, gradeId, status }),
    );
    const filteredSplit = splitFixturesByPlayDay(filtered, sydneyToday());
    return {
      upcoming: [...split.upcoming].sort(byDate),
      results: [...split.results].sort((left, right) => byDate(right, left)),
      filteredUpcoming: [...filteredSplit.upcoming].sort(byDate),
      filteredResults: [...filteredSplit.results].sort((left, right) =>
        byDate(right, left),
      ),
    };
  }, [competitionId, fixtures, gradeId, status, teamQuery]);
  const beforeById = useMemo(() => {
    const byId = new Map<number, { percentage: number; reason: string | null }>();
    for (const finding of beforeScore?.findings ?? []) byId.set(finding.fixtureId, finding);
    return byId;
  }, [beforeScore]);
  const openFixture =
    fixtures.find((fixture) => fixture.id === openFixtureId) ?? null;

  return (
    <div className="space-y-4">
      <ReadinessFixtureDataDialog
        fixture={openFixture}
        open={openFixtureId != null}
        onOpenChange={(open) => {
          if (!open) setOpenFixtureId(null);
        }}
      />
      <ResultSingleScrapeConfirmDialog
        open={scrapeFixtureId != null}
        onOpenChange={(open) => {
          if (!open) setScrapeFixtureId(null);
        }}
        fixtureId={scrapeFixtureId ?? 0}
      />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="readiness-team-find">Team</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="readiness-team-find"
              className="pl-8"
              value={teamQuery}
              placeholder="Search a team name"
              onChange={(event) => setTeamQuery(event.target.value)}
            />
          </div>
        </div>
        <FilterSelect
          label="Competition"
          value={competitionId}
          allLabel="All competitions"
          options={competitions.map(([id, name]) => ({ id, name }))}
          onChange={(next) => {
            setCompetitionId(next);
            setGradeId(ALL);
          }}
        />
        <FilterSelect
          label="Grade"
          value={gradeId}
          allLabel="All grades"
          options={grades.map(([id, name]) => ({ id, name }))}
          onChange={setGradeId}
        />
        <FilterSelect
          label="Status"
          value={status}
          allLabel="All statuses"
          options={statuses.map((label) => ({ id: label, name: label }))}
          onChange={setStatus}
        />
      </div>
      <Tabs defaultValue="results" className="space-y-4">
        <TabsList variant="primary" className={sectionTabListClass}>
          <TabsTrigger value="upcoming" variant="section" className={sectionTabTriggerClass}>
            <CalendarDays className="h-4 w-4 shrink-0 text-current" aria-hidden />
            Upcoming ({grouped.filteredUpcoming.length})
          </TabsTrigger>
          <TabsTrigger value="results" variant="section" className={sectionTabTriggerClass}>
            <History className="h-4 w-4 shrink-0 text-current" aria-hidden />
            Results ({grouped.filteredResults.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-0">
          <FixtureRows
            fixtures={grouped.filteredUpcoming}
            emptyLabel={
              grouped.upcoming.length === 0
                ? "No upcoming fixtures."
                : "No fixtures match these filters."
            }
            beforeById={beforeById}
            onOpenData={setOpenFixtureId}
            onScrape={setScrapeFixtureId}
          />
        </TabsContent>
        <TabsContent value="results" className="mt-0">
          <FixtureRows
            fixtures={grouped.filteredResults}
            emptyLabel={
              grouped.results.length === 0
                ? "No results fixtures."
                : "No fixtures match these filters."
            }
            beforeById={beforeById}
            onOpenData={setOpenFixtureId}
            onScrape={setScrapeFixtureId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: { id: string; name: string }[];
  onChange: (value: string) => void;
}) {
  const fieldId = `readiness-filter-${label.toLowerCase()}`;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={fieldId}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={fieldId}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function FixtureRows({
  fixtures,
  emptyLabel,
  beforeById,
  onOpenData,
  onScrape,
}: {
  fixtures: FixtureSummary[];
  emptyLabel: string;
  beforeById: Map<number, { percentage: number; reason: string | null }>;
  onOpenData: (fixtureId: number) => void;
  onScrape: (fixtureId: number) => void;
}) {
  if (fixtures.length === 0) {
    return <EmptyState variant="minimal" title={emptyLabel} />;
  }

  return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fixture</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Before</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupByGrade(fixtures))
            .sort(([left], [right]) => left.localeCompare(right, "en"))
            .flatMap(([gradeName, gradeFixtures]) => [
              <TableRow
                key={`${gradeName}-header`}
                className="bg-slate-200 hover:bg-slate-200"
              >
                <TableCell colSpan={4} className="py-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-slate-900">
                      {gradeName}
                    </div>
                    <Badge variant="outline">
                      {gradeFixtures.length} fixture
                      {gradeFixtures.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </TableCell>
              </TableRow>,
              ...datesInGrade(gradeFixtures).flatMap((dateGroup) => [
                <TableRow
                  key={`${gradeName}-${dateGroup.key}-date`}
                  className="bg-slate-100 hover:bg-slate-100"
                >
                  <TableCell colSpan={4} className="py-1.5 pl-6">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-medium text-slate-600">
                        {dateGroup.label}
                      </div>
                      <Badge variant="outline">
                        {dateGroup.fixtures.length}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>,
                ...typesOnDate(dateGroup.fixtures).flatMap((typeGroup) => [
                  <TableRow
                    key={`${gradeName}-${dateGroup.key}-${typeGroup.label}-type`}
                    className="bg-slate-50 hover:bg-slate-50"
                  >
                    <TableCell colSpan={4} className="py-1.5 pl-10">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-slate-600">
                          {typeGroup.label}
                        </div>
                        <Badge variant="outline">
                          {typeGroup.fixtures.length}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>,
                  ...typeGroup.fixtures.map((fixture) => {
                    const finding = beforeById.get(fixture.id);
                    const alert = unexpectedStatus(finding);
                    const alertStyle = alert
                      ? { backgroundColor: "#fecaca" }
                      : undefined;
                    return (
                  <TableRow key={fixture.id} style={alertStyle}>
                    <TableCell style={alertStyle}>
                      <p className="text-sm font-medium">{getTeamsDisplay(fixture)}</p>
                      <p className="text-xs text-muted-foreground">
                        {toFixtureDisplayText(fixture.round, "—")}
                      </p>
                    </TableCell>
                    <TableCell style={alertStyle}>
                      <Badge variant="outline">{statusLabel(fixture.status)}</Badge>
                    </TableCell>
                    <TableCell style={alertStyle}>{resultLabel(finding)}</TableCell>
                    <TableCell className="text-right" style={alertStyle}>
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          type="button"
                          variant="accent"
                          size="sm"
                          onClick={() => onScrape(fixture.id)}
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Scrape result
                        </Button>
                        <FixtureDataButton onClick={() => onOpenData(fixture.id)} />
                        <DashboardLinkButton
                          href={`/dashboard/fixtures/${fixture.id}`}
                          trailingIcon="arrow"
                        >
                          View
                        </DashboardLinkButton>
                      </div>
                    </TableCell>
                  </TableRow>
                    );
                  }),
                ]),
              ]),
            ])}
        </TableBody>
      </Table>
  );
}
