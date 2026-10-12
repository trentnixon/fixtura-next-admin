"use client";

import { useMemo, useState } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ReadinessAccountPicker,
  type ReadinessOrgType,
} from "./ReadinessAccountPicker";
import { ReadinessFixtureTable } from "./ReadinessFixtureTable";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import { triggerResultSingleScrape } from "@/lib/services/data-collection/triggerResultSingleScrape";
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";
import { fetchSingleFixtureDetail } from "@/lib/services/fixtures/fetchSingleFixtureDetail";
import {
  fixturesInReadinessWindow,
  listCoversReadinessWindow,
  readinessWindow,
  splitFixturesByPlayDay,
  sydneyToday,
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

function groundText(
  ground: SingleFixtureDetailResponse["fixture"]["venue"]["ground"],
): string | null {
  if (typeof ground === "string") return ground;
  if (ground && typeof ground === "object") return ground.text ?? null;
  return null;
}

function recordedScore(total: string | null | undefined, innings: string | null | undefined) {
  if (total != null && total.trim() !== "") return total;
  if (innings != null && innings.trim() !== "") return innings;
  return null;
}

function scorecardHasPlayer(
  scorecards: SingleFixtureDetailResponse["fixture"]["matchDetails"]["scorecards"],
): boolean {
  if (scorecards == null) return false;
  for (const card of Object.values(scorecards)) {
    const players = [
      ...("batting" in card && Array.isArray(card.batting) ? card.batting : []),
      ...("bowling" in card && Array.isArray(card.bowling) ? card.bowling : []),
    ];
    if (
      players.some((player) => {
        const name = player.name ?? player.player ?? "";
        return name.trim() !== "";
      })
    ) {
      return true;
    }
  }
  return false;
}

function toCompletenessInput(
  detail: SingleFixtureDetailResponse,
): FixtureCompletenessInput {
  const fixture = detail.fixture;
  return {
    id: fixture.id,
    status: fixture.status,
    date: fixture.dates?.date ?? null,
    homeTeam: fixture.teams?.home?.name ?? null,
    awayTeam: fixture.teams?.away?.name ?? null,
    location: groundText(fixture.venue?.ground),
    homeScore: recordedScore(
      fixture.teams?.home?.scores?.total,
      fixture.teams?.home?.scores?.firstInnings,
    ),
    awayScore: recordedScore(
      fixture.teams?.away?.scores?.total,
      fixture.teams?.away?.scores?.firstInnings,
    ),
    tossResult: fixture.matchDetails?.tossResult ?? null,
    tossWinner: fixture.matchDetails?.tossWinner ?? null,
    hasPlayerData: scorecardHasPlayer(fixture.matchDetails?.scorecards),
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
        Average of {score.totalCount} results fixtures. {score.completeCount} at
        100%.
      </p>
    </section>
  );
}

export function ReadinessCheckWorkspace() {
  const [step, setStep] = useState(0);
  const [orgType, setOrgType] = useState<ReadinessOrgType | null>(null);
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

  const fixtureWindow =
    chosenDate.length === 10 ? readinessWindow(chosenDate) : null;
  const windowFixtures = fixtureWindow
    ? fixturesInReadinessWindow(summaries, chosenDate)
    : [];
  const listMissesWindow =
    fixtureWindow != null && !listCoversReadinessWindow(fixtureWindow, ranges);

  const detailQueries = useQueries({
    queries: windowFixtures.map((fixture) => ({
      queryKey: ["readiness-fixture-detail", loadId, fixture.id] as const,
      queryFn: () => fetchSingleFixtureDetail(fixture.id),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    })),
  });

  const loadedDetails = detailQueries.flatMap((query) =>
    query.data ? [query.data] : [],
  );
  const resultIds = new Set(
    splitFixturesByPlayDay(windowFixtures, sydneyToday()).results.map(
      (fixture) => fixture.id,
    ),
  );
  const resultDetails = loadedDetails.filter((detail) =>
    resultIds.has(detail.fixture.id),
  );
  const beforeScore =
    resultIds.size > 0 && resultDetails.length === resultIds.size
      ? scoreFixtureCompleteness(resultDetails.map(toCompletenessInput))
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
      windowFixtures.map(async (fixture) => {
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
      windowFixtures.map((fixture) => fetchSingleFixtureDetail(fixture.id)),
    );
    const failed = results.filter((result) => result.status === "rejected");
    if (failed.length > 0) {
      setReloadError(
        `Could not reload ${failed.length} of ${windowFixtures.length} fixtures.`,
      );
      return;
    }
    const details = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : [],
    );
    const resultDetails = details.filter((detail) => resultIds.has(detail.fixture.id));
    setAfterScore(scoreFixtureCompleteness(resultDetails.map(toCompletenessInput)));
  }

  const weekday =
    chosenDate.length === 10 ? sydneyWeekday(chosenDate) : null;
  const onScheduledDay =
    weekday != null &&
    scheduledDay != null &&
    weekday.toLowerCase() === scheduledDay.toLowerCase();

  function selectAccount(nextAccountId: string) {
    setAccountId(nextAccountId);
    setLoadId((value) => value + 1);
    setScrapeRows([]);
    setReloadError(null);
    setAfterScore(null);
  }

  function chooseOrgType(next: ReadinessOrgType) {
    setOrgType(next);
  }

  const steps = ["Date", "Organisation type", "Organisation", "Results"] as const;
  const canContinue =
    step === 0
      ? chosenDate.length === 10
      : step === 1
        ? orgType != null
        : step === 2
          ? accountId !== ""
          : false;

  return (
    <div className="space-y-6">
      <ol className="flex flex-wrap gap-2">
        {steps.map((label, index) => {
          const current = index === step;
          const done = index < step;
          return (
            <li key={label}>
              <button
                type="button"
                disabled={index > step}
                onClick={() => {
                  if (index < step) setStep(index);
                }}
                className={
                  current
                    ? "rounded-full bg-sidebar px-3 py-1 text-sm text-white"
                    : done
                      ? "rounded-full px-3 py-1 text-sm text-sidebar underline"
                      : "rounded-full px-3 py-1 text-sm text-muted-foreground"
                }
              >
                {index + 1}. {label}
              </button>
            </li>
          );
        })}
      </ol>

      {step === 0 ? (
        <div className="space-y-1">
          <Label htmlFor="readiness-date">Date</Label>
          <Input
            id="readiness-date"
            type="date"
            className="max-w-xs"
            value={chosenDate}
            onChange={(event) => {
              setChosenDate(event.target.value);
              setLoadId((value) => value + 1);
              setScrapeRows([]);
              setReloadError(null);
              setAfterScore(null);
            }}
          />
          {fixtureWindow ? (
            <p className="text-xs text-muted-foreground">
              Fixtures from {fixtureWindow.start} to {fixtureWindow.end}. Two
              weeks before this date and one week after.
            </p>
          ) : null}
        </div>
      ) : null}

      {step === 1 || step === 2 ? (
        <ReadinessAccountPicker
          view={step === 1 ? "type" : "accounts"}
          orgType={orgType}
          onOrgTypeChange={chooseOrgType}
          selectedAccountId={accountId}
          onSelect={selectAccount}
        />
      ) : null}

      {step < 3 ? (
        <div className="flex gap-2">
          {step > 0 ? (
            <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : null}
          <Button type="button" onClick={() => setStep(step + 1)} disabled={!canContinue}>
            Next
          </Button>
        </div>
      ) : (
        <Button type="button" variant="outline" onClick={() => setStep(2)}>
          Back
        </Button>
      )}

      {step === 3 ? (
      <div className="space-y-6">

      {account ? (
        <p className="text-sm">
          {account.accountOrganisationDetails?.Name ?? "Client"}{" "}
          {isClub ? "club" : isAssociation ? "association" : "client"}
          {fixtureWindow
            ? `. Fixtures from ${fixtureWindow.start} to ${fixtureWindow.end}.`
            : null}
          {scheduledDay ? ` Scheduled day: ${scheduledDay}.` : null}
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

      {listMissesWindow && fixtureWindow ? (
        <p className="text-sm">
          The fixture list does not cover {fixtureWindow.start} to{" "}
          {fixtureWindow.end}.
        </p>
      ) : null}

      {!listMissesWindow &&
      accountId &&
      fixtureWindow &&
      !listsLoading &&
      windowFixtures.length === 0 ? (
        <p className="text-sm">
          No fixtures from {fixtureWindow.start} to {fixtureWindow.end}.
        </p>
      ) : null}

      {beforeScore ? <ScoreBlock label="Results before scrape" score={beforeScore} /> : null}

      {windowFixtures.length > 0 ? (
        <div className="flex gap-2">
          <Button type="button" onClick={() => void scrapeAll()} disabled={scraping}>
            {scraping ? "Scraping…" : `Scrape all ${windowFixtures.length} fixtures`}
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

      {afterScore ? <ScoreBlock label="Results after reload" score={afterScore} /> : null}

      {windowFixtures.length > 0 ? (
        <ReadinessFixtureTable
          fixtures={windowFixtures}
          beforeScore={
            resultDetails.length > 0
              ? scoreFixtureCompleteness(resultDetails.map(toCompletenessInput))
              : null
          }
          afterScore={afterScore}
          scrapeRows={scrapeRows}
        />
      ) : null}
      </div>
      ) : null}
    </div>
  );
}
