"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays, History } from "lucide-react";
import { formatDate } from "@/app/dashboard/fixtures/_components/_utils/dateUtils";
import {
  getTeamsDisplay,
  groupByGrade,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureUtils";
import { getStatusBadge } from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import { Badge } from "@/components/ui/badge";
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

type ScrapeRow = {
  fixtureId: number;
  accepted: boolean;
  message: string;
};

function resultLabel(finding: { percentage: number; reason: string | null } | undefined) {
  if (!finding) return "—";
  if (finding.percentage === 100) return "100%";
  return finding.reason
    ? `${finding.percentage}% · ${finding.reason}`
    : `${finding.percentage}%`;
}

export function ReadinessFixtureTable({
  fixtures,
  beforeScore,
  afterScore,
  scrapeRows,
}: {
  fixtures: FixtureSummary[];
  beforeScore: FixtureCompletenessScore | null;
  afterScore: FixtureCompletenessScore | null;
  scrapeRows: ScrapeRow[];
}) {
  const grouped = useMemo(() => {
    const split = splitFixturesByPlayDay(fixtures, sydneyToday());
    const byDate = (left: FixtureSummary, right: FixtureSummary) =>
      (left.date ?? "").localeCompare(right.date ?? "");
    return {
      upcoming: [...split.upcoming].sort(byDate),
      results: [...split.results].sort((left, right) => byDate(right, left)),
    };
  }, [fixtures]);
  const beforeById = useMemo(() => {
    const byId = new Map<number, { percentage: number; reason: string | null }>();
    for (const finding of beforeScore?.findings ?? []) byId.set(finding.fixtureId, finding);
    return byId;
  }, [beforeScore]);
  const afterById = useMemo(() => {
    const byId = new Map<number, { percentage: number; reason: string | null }>();
    for (const finding of afterScore?.findings ?? []) byId.set(finding.fixtureId, finding);
    return byId;
  }, [afterScore]);
  const scrapes = useMemo(() => {
    const byId = new Map<number, ScrapeRow>();
    for (const row of scrapeRows) byId.set(row.fixtureId, row);
    return byId;
  }, [scrapeRows]);

  return (
    <Tabs defaultValue="results" className="space-y-4">
      <TabsList variant="primary" className={sectionTabListClass}>
        <TabsTrigger value="upcoming" variant="section" className={sectionTabTriggerClass}>
          <CalendarDays className="h-4 w-4 shrink-0 text-current" aria-hidden />
          Upcoming ({grouped.upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="results" variant="section" className={sectionTabTriggerClass}>
          <History className="h-4 w-4 shrink-0 text-current" aria-hidden />
          Results ({grouped.results.length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-0">
        <FixtureRows
          fixtures={grouped.upcoming}
          emptyLabel="No upcoming fixtures."
          beforeById={beforeById}
          afterById={afterById}
          scrapes={scrapes}
        />
      </TabsContent>
      <TabsContent value="results" className="mt-0">
        <FixtureRows
          fixtures={grouped.results}
          emptyLabel="No results fixtures."
          beforeById={beforeById}
          afterById={afterById}
          scrapes={scrapes}
        />
      </TabsContent>
    </Tabs>
  );
}

function FixtureRows({
  fixtures,
  emptyLabel,
  beforeById,
  afterById,
  scrapes,
}: {
  fixtures: FixtureSummary[];
  emptyLabel: string;
  beforeById: Map<number, { percentage: number; reason: string | null }>;
  afterById: Map<number, { percentage: number; reason: string | null }>;
  scrapes: Map<number, ScrapeRow>;
}) {
  if (fixtures.length === 0) {
    return <p className="text-sm">{emptyLabel}</p>;
  }

  return (
    <div className="max-h-[32rem] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Fixture</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Before</TableHead>
            <TableHead>Scrape</TableHead>
            <TableHead>After</TableHead>
            <TableHead className="text-right">Open</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(groupByGrade(fixtures))
            .sort(([left], [right]) => left.localeCompare(right, "en"))
            .flatMap(([gradeName, gradeFixtures]) => [
              <TableRow
                key={`${gradeName}-header`}
                className="bg-slate-50/80 hover:bg-slate-50/80"
              >
                <TableCell colSpan={7} className="py-2">
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
              ...gradeFixtures.map((fixture) => {
                const scrape = scrapes.get(fixture.id);
                return (
              <TableRow key={fixture.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(fixture.date)}
                </TableCell>
                <TableCell>
                  <p className="text-sm font-medium">{getTeamsDisplay(fixture)}</p>
                  <p className="text-xs text-muted-foreground">
                    {fixture.competition?.name ?? "Competition unknown"}
                  </p>
                </TableCell>
                <TableCell>{getStatusBadge(fixture.status)}</TableCell>
                <TableCell>{resultLabel(beforeById.get(fixture.id))}</TableCell>
                <TableCell>
                  {scrape
                    ? scrape.accepted
                      ? "Queued"
                      : `Rejected. ${scrape.message}`
                    : "—"}
                </TableCell>
                <TableCell>{resultLabel(afterById.get(fixture.id))}</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/dashboard/fixtures/${fixture.id}`}
                    className="text-sm underline"
                  >
                    Open
                  </Link>
                </TableCell>
              </TableRow>
                );
              }),
            ])}
        </TableBody>
      </Table>
    </div>
  );
}
