"use client";

import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import { triggerResultSingleScrape } from "@/lib/services/data-collection/triggerResultSingleScrape";
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";
import { fetchSingleFixtureDetail } from "@/lib/services/fixtures/fetchSingleFixtureDetail";
import {
  chosenDateIsOutsideWindow,
  fixturesOnChosenDate,
  sydneyWeekday,
} from "@/lib/readiness/fixtureDateWindow";
import {
  scoreFixtureCompleteness,
  type FixtureCompletenessInput,
  type FixtureCompletenessScore,
} from "@/lib/readiness/scoreFixtureCompleteness";
import type { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";
import type { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import type { FixtureDetailsResponse, FixtureSummary } from "@/types/fixtureInsights";

type ScrapeRow = {
  fixtureId: number;
  accepted: boolean;
  message: string;
};

function teamNamesByGrade(
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

function toCompletenessInput(
  detail: SingleFixtureDetailResponse,
): FixtureCompletenessInput {
  const cards = detail.fixture.matchDetails.scorecards;
  return {
    id: detail.fixture.id,
    status: detail.fixture.status,
    isFinished: detail.fixture.isFinished,
    homeTeam: detail.fixture.teams.home.name,
    awayTeam: detail.fixture.teams.away.name,
    scorecardUrl: detail.fixture.matchDetails.urlToScoreCard,
    hasScorecards: cards != null && Object.keys(cards).length > 0,
  };
}

function ScoreBlock({
  label,
  score,
}: {
  label: string;
  score: FixtureCompletenessScore;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium">{label}</h2>
      <p className="text-2xl">
        {score.percentage == null ? "No fixtures" : `${score.percentage}%`}
      </p>
      <p className="text-sm text-muted-foreground">
        {score.completeCount} complete of {score.totalCount}
      </p>
      {score.findings.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {score.findings.map((finding) => (
            <li key={`${label}-${finding.fixtureId}`}>
              Fixture {finding.fixtureId}: {finding.reason}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export function ReadinessCheckWorkspace() {
  const [accountInput, setAccountInput] = useState("");
  const [accountId, setAccountId] = useState("");
  const [chosenDate, setChosenDate] = useState("");
  const [loadId, setLoadId] = useState(0);
  const [scraping, setScraping] = useState(false);
  const [scrapeRows, setScrapeRows] = useState<ScrapeRow[]>([]);
  const [reloadError, setReloadError] = useState<string | null>(null);
  const [afterScore, setAfterScore] = useState<FixtureCompletenessScore | null>(
    null,
  );

  const accountQuery = useAccountQuery(accountId);
  const account = accountQuery.data?.data;
  const organisationId = account?.accountOrganisationDetails?.id;
  const isClub = account?.account_type === 1;
  const isAssociation = account?.account_type === 2;
  const schedulerQuery = useSchedulerQuery(account?.scheduler?.id ?? 0);
  const scheduledDay =
    schedulerQuery.data?.attributes.days_of_the_week?.data?.attributes.Name ??
    null;

  const associationFixtures = useQuery({
    queryKey: ["fixture-details", { association: organisationId }],
    queryFn: () => {
      if (typeof organisationId !== "number") {
        throw new Error("Organisation id is required");
      }
      return fetchFixtureDetails({ association: organisationId });
    },
    enabled: isAssociation && typeof organisationId === "number",
    staleTime: 2 * 60 * 1000,
  });
  const drilldown = useCompetitionClubDrilldown(
    isClub ? organisationId : undefined,
  );
  const namesByGrade = useMemo(
    () =>
      isClub && organisationId
        ? teamNamesByGrade(drilldown.data, organisationId)
        : new Map<number, Set<string>>(),
    [drilldown.data, isClub, organisationId],
  );
  const gradeIds = useMemo(
    () => Array.from(namesByGrade.keys()),
    [namesByGrade],
  );
  const gradeQueries = useQueries({
    queries: gradeIds.map((gradeId) => ({
      queryKey: ["fixture-details", { grade: gradeId }] as const,
      queryFn: () => fetchFixtureDetails({ grade: gradeId }),
      enabled: isClub,
      staleTime: 2 * 60 * 1000,
    })),
  });

  const summaries = useMemo(() => {
    if (isAssociation) return associationFixtures.data?.data?.fixtures ?? [];
    if (!isClub) return [];
    const responses = gradeQueries.flatMap((query) =>
      query.data ? [query.data] : [],
    );
    return fixturesForClub(responses, namesByGrade);
  }, [
    associationFixtures.data,
    gradeQueries,
    isAssociation,
    isClub,
    namesByGrade,
  ]);

  const ranges = useMemo(() => {
    const collected: { start: string; end: string }[] = [];
    const associationRange = associationFixtures.data?.data?.meta?.dateRange;
    if (associationRange) collected.push(associationRange);
    for (const query of gradeQueries) {
      const range = query.data?.data?.meta?.dateRange;
      if (range) collected.push(range);
    }
    return collected;
  }, [associationFixtures.data, gradeQueries]);

  const dated = chosenDate
    ? fixturesOnChosenDate(summaries, chosenDate)
    : [];
  const outsideWindow =
    chosenDate.length > 0 &&
    chosenDateIsOutsideWindow(chosenDate, ranges) &&
    dated.length === 0;

  const detailQueries = useQueries({
    queries: dated.map((fixture) => ({
      queryKey: ["readiness-fixture-detail", loadId, fixture.id] as const,
      queryFn: () => fetchSingleFixtureDetail(fixture.id),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    })),
  });

  const loadedDetails = detailQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );
  const beforeScore =
    dated.length > 0 && loadedDetails.length === dated.length
      ? scoreFixtureCompleteness(loadedDetails.map(toCompletenessInput))
      : null;

  const listsLoading =
    accountQuery.isFetching ||
    associationFixtures.isFetching ||
    drilldown.isFetching ||
    gradeQueries.some((query) => query.isFetching) ||
    detailQueries.some((query) => query.isFetching);

  async function scrapeAll() {
    setScraping(true);
    setAfterScore(null);
    const rows = await Promise.all(
      dated.map(async (fixture) => {
        try {
          const result = await triggerResultSingleScrape({
            cmsFixtureId: fixture.id,
          });
          return {
            fixtureId: fixture.id,
            accepted: true,
            message: result.message || "Queued",
          };
        } catch (error) {
          return {
            fixtureId: fixture.id,
            accepted: false,
            message: error instanceof Error ? error.message : "Rejected",
          };
        }
      }),
    );
    setScrapeRows(rows);
    setScraping(false);
  }

  async function scoreAgain() {
    setReloadError(null);
    const results = await Promise.allSettled(
      dated.map((fixture) => fetchSingleFixtureDetail(fixture.id)),
    );
    const failed = results.filter((result) => result.status === "rejected");
    if (failed.length > 0) {
      setReloadError(
        `Could not reload ${failed.length} of ${dated.length} fixtures.`,
      );
      return;
    }
    const details = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    setAfterScore(scoreFixtureCompleteness(details.map(toCompletenessInput)));
  }

  const weekday =
    chosenDate.length === 10 ? sydneyWeekday(chosenDate) : null;
  const onScheduledDay =
    weekday != null &&
    scheduledDay != null &&
    weekday.toLowerCase() === scheduledDay.toLowerCase();

  return (
    <div className="space-y-6">
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setAccountId(accountInput.trim());
          setLoadId((value) => value + 1);
          setScrapeRows([]);
          setReloadError(null);
          setAfterScore(null);
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="readiness-account">Client id</Label>
          <Input
            id="readiness-account"
            inputMode="numeric"
            value={accountInput}
            onChange={(event) => setAccountInput(event.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="readiness-date">Date</Label>
          <Input
            id="readiness-date"
            type="date"
            value={chosenDate}
            onChange={(event) => {
              setChosenDate(event.target.value);
              setLoadId((value) => value + 1);
              setScrapeRows([]);
              setReloadError(null);
              setAfterScore(null);
            }}
          />
        </div>
        <Button type="submit" disabled={accountInput.trim() === ""}>
          Load fixtures
        </Button>
      </form>

      {account ? (
        <p className="text-sm">
          {account.accountOrganisationDetails?.Name ?? "Client"}{" "}
          {isClub ? "club" : isAssociation ? "association" : "client"}
          {scheduledDay ? `. Scheduled day: ${scheduledDay}.` : null}
          {onScheduledDay
            ? " This date is the client's scheduled day."
            : null}
        </p>
      ) : null}

      {accountQuery.isError ? (
        <p className="text-sm">Could not load that client.</p>
      ) : null}

      {account && !isClub && !isAssociation ? (
        <p className="text-sm">This client is not a club or an association.</p>
      ) : null}

      {detailQueries.some((query) => query.isError) ? (
        <p className="text-sm">Could not load every fixture in this set.</p>
      ) : null}

      {outsideWindow ? (
        <p className="text-sm">
          The fixture list does not cover {chosenDate}.
        </p>
      ) : null}

      {!outsideWindow && accountId && chosenDate && !listsLoading && dated.length === 0 ? (
        <p className="text-sm">No fixtures on {chosenDate}.</p>
      ) : null}

      {beforeScore ? <ScoreBlock label="Before scrape" score={beforeScore} /> : null}

      {dated.length > 0 ? (
        <div className="flex gap-2">
          <Button type="button" onClick={() => void scrapeAll()} disabled={scraping}>
            {scraping ? "Scraping…" : `Scrape all ${dated.length} fixtures`}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => void scoreAgain()}
            disabled={scraping}
          >
            Score again
          </Button>
        </div>
      ) : null}

      {reloadError ? <p className="text-sm">{reloadError}</p> : null}

      {scrapeRows.length > 0 ? (
        <ul className="space-y-1 text-sm">
          {scrapeRows.map((row) => (
            <li key={row.fixtureId}>
              Fixture {row.fixtureId}: {row.accepted ? "Queued" : "Rejected"}.{" "}
              {row.message}
            </li>
          ))}
        </ul>
      ) : null}

      {afterScore ? <ScoreBlock label="After reload" score={afterScore} /> : null}
    </div>
  );
}
