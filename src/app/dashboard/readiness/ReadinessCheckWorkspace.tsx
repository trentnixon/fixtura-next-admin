"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  Building2,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Users,
} from "lucide-react";
import { formatDate } from "@/app/dashboard/fixtures/_components/_utils/dateUtils";
import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { ComparisonCard } from "@/components/ui-library/cards";
import CompactKpiCard from "@/components/ui-library/cards/CompactKpiCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  ReadinessAccountPicker,
  type ReadinessOrgType,
} from "./ReadinessAccountPicker";
import { ReadinessFixtureTable } from "./ReadinessFixtureTable";
import { ReadinessWizardSteps } from "./ReadinessWizardSteps";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { triggerResultSingleScrape } from "@/lib/services/data-collection/triggerResultSingleScrape";
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";
import { fetchSingleFixtureDetail } from "@/lib/services/fixtures/fetchSingleFixtureDetail";
import {
  fixturesInReadinessWindow,
  listCoversReadinessWindow,
  readinessWindow,
  splitFixturesByPlayDay,
  standardReadinessWindow,
  sydneyToday,
  readinessPlayDay,
} from "@/lib/readiness/fixtureDateWindow";
import { scorecardHasPlayer } from "@/lib/readiness/scorecardHasPlayer";
import {
  scoreFixtureCompleteness,
  type FixtureCompletenessInput,
  type FixtureCompletenessScore,
} from "@/lib/readiness/scoreFixtureCompleteness";
import type { CompetitionClubDrilldownResponse } from "@/types/competitionClubDrilldown";
import type { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import type { FixtureDetailsResponse, FixtureSummary } from "@/types/fixtureInsights";

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

function percentLabel(score: FixtureCompletenessScore | null) {
  if (!score || score.percentage == null) return "—";
  return `${score.percentage}%`;
}

function sectionIcon(icon: ReactNode, tone: string) {
  return <div className={`rounded-md p-1.5 ${tone}`}>{icon}</div>;
}

function parseDate(value: string | null): string {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return sydneyToday();
}

function parseOrgType(value: string | null): ReadinessOrgType | null {
  if (value === "Club" || value === "Association") return value;
  return null;
}

function parseAccountId(value: string | null): string {
  if (value && /^\d+$/.test(value)) return value;
  return "";
}

function parseStep(value: string | null): number {
  const step = Number(value);
  if (!Number.isInteger(step) || step < 0 || step > 3) return 0;
  return step;
}

function clampStep(
  step: number,
  date: string,
  orgType: ReadinessOrgType | null,
  accountId: string,
) {
  if (step >= 1 && date.length !== 10) return 0;
  if (step >= 2 && orgType == null) return 1;
  if (step >= 3 && accountId === "") return 2;
  return step;
}

export function ReadinessCheckWorkspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chosenDate = parseDate(searchParams.get("date"));
  const orgType = parseOrgType(searchParams.get("type"));
  const accountId = parseAccountId(searchParams.get("account"));
  const step = clampStep(
    parseStep(searchParams.get("step")),
    chosenDate,
    orgType,
    accountId,
  );
  const wizard = useRef({ step, chosenDate, orgType, accountId });
  wizard.current = { step, chosenDate, orgType, accountId };
  const [loadId, setLoadId] = useState(0);
  const [scraping, setScraping] = useState(false);
  const [reloadError, setReloadError] = useState<string | null>(null);
  const [afterScore, setAfterScore] = useState<FixtureCompletenessScore | null>(
    null,
  );
  const accountQuery = useAccountQuery(accountId);
  const account = accountQuery.data?.data;
  const organisationId = account?.accountOrganisationDetails?.id;
  const isClub = account?.account_type === 1;
  const isAssociation = account?.account_type === 2;

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
  const standardWindow =
    chosenDate.length === 10 ? standardReadinessWindow(chosenDate) : null;
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
  const detailById = new Map(loadedDetails.map((detail) => [detail.fixture.id, detail]));
  const scheduledFixtures = windowFixtures.map((fixture) => {
    const day = readinessPlayDay(fixture.date, detailById.get(fixture.id)?.fixture);
    if (day == null || day === fixture.date) return fixture;
    return { ...fixture, date: day };
  });
  const resultIds = new Set(
    splitFixturesByPlayDay(scheduledFixtures, sydneyToday()).results.map(
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
    setReloadError(null);
    try {
      const accepted = await Promise.all(
        windowFixtures.map(async (fixture) => {
          try {
            await triggerResultSingleScrape({ cmsFixtureId: fixture.id });
            return true;
          } catch {
            return false;
          }
        }),
      );
      const rejected = accepted.filter((ok) => !ok).length;
      if (rejected > 0) {
        setReloadError(
          `Could not queue ${rejected} of ${windowFixtures.length} scrapes.`,
        );
      }
    } finally {
      setScraping(false);
    }
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

  function commit(patch: {
    step?: number;
    chosenDate?: string;
    orgType?: ReadinessOrgType | null;
    accountId?: string;
  }) {
    const next = { ...wizard.current, ...patch };
    const nextStep = clampStep(
      next.step,
      next.chosenDate,
      next.orgType,
      next.accountId,
    );
    wizard.current = { ...next, step: nextStep };
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", next.chosenDate);
    if (next.orgType) params.set("type", next.orgType);
    else params.delete("type");
    if (next.accountId) params.set("account", next.accountId);
    else params.delete("account");
    if (nextStep > 0) params.set("step", String(nextStep));
    else params.delete("step");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function chooseDate(nextDate: string) {
    if (nextDate === chosenDate) return;
    commit({ chosenDate: nextDate });
    setLoadId((value) => value + 1);
    setReloadError(null);
    setAfterScore(null);
  }

  function selectAccount(nextAccountId: string) {
    commit({ accountId: nextAccountId });
    setLoadId((value) => value + 1);
    setReloadError(null);
    setAfterScore(null);
  }

  function chooseOrgType(next: ReadinessOrgType) {
    commit({ orgType: next, accountId: "" });
  }

  const organisationName =
    account?.accountOrganisationDetails?.Name ?? "Client";
  const wizardSteps = [
    {
      label: "Date",
      summary: chosenDate.length === 10 ? formatDate(chosenDate) : null,
      icon: CalendarDays,
    },
    {
      label: "Organisation type",
      summary: orgType,
      icon: Building2,
    },
    {
      label: "Organisation",
      summary: account ? organisationName : accountId ? "Selected" : null,
      icon: Users,
    },
    {
      label: "Results",
      summary: null,
      icon: ClipboardCheck,
    },
  ];
  const canContinue =
    step === 0
      ? chosenDate.length === 10
      : step === 1
        ? orgType != null
        : step === 2
          ? accountId !== ""
          : false;
  const stepCopy = [
    {
      title: "Choose a date",
      description:
        "Most fixtures are included from 7 days before this date through 7 days after it. Only Two Day+ fixtures use the 14 days before this date.",
      icon: sectionIcon(
        <CalendarDays className="h-4 w-4" />,
        "bg-blue-50 text-blue-700",
      ),
    },
    {
      title: "Organisation type",
      description:
        "Club and association accounts load their fixture lists differently.",
      icon: sectionIcon(
        <Building2 className="h-4 w-4" />,
        "bg-violet-50 text-violet-700",
      ),
    },
    {
      title: "Choose an organisation",
      description: orgType
        ? `Search ${orgType.toLowerCase()} accounts by name, organisation, sport, or id.`
        : "Search by name, organisation, sport, or id.",
      icon: sectionIcon(
        <Users className="h-4 w-4" />,
        "bg-sky-50 text-sky-700",
      ),
    },
    {
      title: account ? organisationName : "Results",
      description:
        fixtureWindow && standardWindow
          ? `Most fixtures from ${formatDate(standardWindow.start)} to ${formatDate(fixtureWindow.end)}. Two Day+ from ${formatDate(fixtureWindow.start)}.`
          : "Scores and scrape actions for this window.",
      icon: sectionIcon(
        <ClipboardCheck className="h-4 w-4" />,
        "bg-emerald-50 text-emerald-700",
      ),
    },
  ] as const;
  const currentStep = stepCopy[step] ?? stepCopy[0];
  const showEmptyWindow =
    !listMissesWindow &&
    accountId !== "" &&
    fixtureWindow != null &&
    !listsLoading &&
    windowFixtures.length === 0;

  return (
    <div className="space-y-6">
      <ElementContainer border padding="md">
        <ReadinessWizardSteps
          steps={wizardSteps}
          current={step}
          onStep={(index) => commit({ step: index })}
        />
      </ElementContainer>

      <SectionContainer
        title={currentStep.title}
        description={currentStep.description}
        icon={currentStep.icon}
      >
        {step === 0 ? (
          <div className="flex flex-col items-center gap-3">
            <Label htmlFor="readiness-date">Date</Label>
            <DatePicker
              id="readiness-date"
              value={chosenDate}
              today={sydneyToday()}
              placeholder="Pick a date"
              onChange={chooseDate}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => chooseDate(sydneyToday())}
            >
              Use today&apos;s date
            </Button>
          </div>
        ) : null}

        {step === 0 && fixtureWindow && standardWindow ? (
          <MetricGrid columns={3}>
            <CompactKpiCard
              label="Most fixtures from"
              value={formatDate(standardWindow.start)}
              icon={<CalendarDays className="h-4 w-4" />}
              iconClassName="bg-blue-50 text-blue-700"
              progressClassName="bg-blue-500"
            />
            <CompactKpiCard
              label="Two Day+ from"
              value={formatDate(fixtureWindow.start)}
              icon={<CalendarDays className="h-4 w-4" />}
              iconClassName="bg-violet-50 text-violet-700"
              progressClassName="bg-violet-500"
            />
            <CompactKpiCard
              label="Through"
              value={formatDate(fixtureWindow.end)}
              icon={<CalendarClock className="h-4 w-4" />}
              iconClassName="bg-sky-50 text-sky-700"
              progressClassName="bg-sky-500"
            />
          </MetricGrid>
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

        {step === 3 && listsLoading && !beforeScore ? (
          <LoadingState message="Loading fixtures..." />
        ) : null}

        {step === 3 && accountQuery.isError ? (
          <ErrorState
            variant="card"
            title="Could not load that client"
            error={
              accountQuery.error instanceof Error
                ? accountQuery.error
                : "The account request failed."
            }
            onRetry={() => void accountQuery.refetch()}
          />
        ) : null}

        {step === 3 && account && !isClub && !isAssociation ? (
          <ErrorState
            variant="card"
            title="Unsupported client"
            description="This client is not a club or an association."
          />
        ) : null}

        {step === 3 && detailQueries.some((query) => query.isError) ? (
          <ErrorState
            variant="minimal"
            title="Fixture load failed"
            description="Could not load every fixture in this set."
          />
        ) : null}

        {step === 3 && listMissesWindow && fixtureWindow ? (
          <ErrorState
            variant="card"
            title="Fixture list is shorter than this window"
            description={`The loaded list does not cover ${formatDate(fixtureWindow.start)} to ${formatDate(fixtureWindow.end)}.`}
          />
        ) : null}

        {step === 3 && showEmptyWindow && fixtureWindow ? (
          <EmptyState
            variant="card"
            title="No fixtures in this window"
            description={`Nothing from ${formatDate(fixtureWindow.start)} to ${formatDate(fixtureWindow.end)}.`}
            icon={<CalendarDays className="h-12 w-12 text-muted-foreground" />}
          />
        ) : null}

        {step === 3 && beforeScore ? (
          <MetricGrid columns={3}>
            <CompactKpiCard
              label="Results completeness"
              value={percentLabel(beforeScore)}
              badge="Before scrape"
              progressPercent={beforeScore.percentage ?? 0}
              icon={<Gauge className="h-4 w-4" />}
              iconClassName="bg-indigo-50 text-indigo-700"
              progressClassName="bg-indigo-500"
            />
            <CompactKpiCard
              label="Complete results"
              value={String(beforeScore.completeCount)}
              badge={`of ${beforeScore.totalCount}`}
              progressPercent={
                beforeScore.totalCount === 0
                  ? 0
                  : (beforeScore.completeCount / beforeScore.totalCount) * 100
              }
              icon={<CheckCircle2 className="h-4 w-4" />}
              iconClassName="bg-emerald-50 text-emerald-700"
              progressClassName="bg-emerald-500"
            />
            <CompactKpiCard
              label="Fixtures in window"
              value={String(windowFixtures.length)}
              icon={<CalendarDays className="h-4 w-4" />}
              iconClassName="bg-sky-50 text-sky-700"
              progressClassName="bg-sky-500"
            />
          </MetricGrid>
        ) : null}

        {step === 3 && beforeScore && afterScore ? (
          <ComparisonCard
            title="Before and after reload"
            description="Average completeness of results fixtures."
            icon={<Gauge className="h-4 w-4" />}
            rows={[
              {
                label: "Before scrape",
                value: percentLabel(beforeScore),
              },
              {
                label: "After reload",
                value: percentLabel(afterScore),
                tone:
                  (afterScore.percentage ?? 0) > (beforeScore.percentage ?? 0)
                    ? "text-emerald-700"
                    : undefined,
              },
              {
                label: "Complete before",
                value: String(beforeScore.completeCount),
              },
              {
                label: "Complete after",
                value: String(afterScore.completeCount),
                tone:
                  afterScore.completeCount > beforeScore.completeCount
                    ? "text-emerald-700"
                    : undefined,
              },
            ]}
          />
        ) : null}

        {step === 3 && reloadError ? (
          <ErrorState variant="minimal" description={reloadError} />
        ) : null}

        {step === 3 && windowFixtures.length > 0 ? (
          <ElementContainer
            title="Fixtures"
            subtitle="Upcoming games and results in this window."
            border
            padding="md"
          >
            <ReadinessFixtureTable
              fixtures={windowFixtures}
              details={loadedDetails}
              beforeScore={
                resultDetails.length > 0
                  ? scoreFixtureCompleteness(
                      resultDetails.map(toCompletenessInput),
                    )
                  : null
              }
            />
          </ElementContainer>
        ) : null}

        <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-end">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              className="sm:mr-auto"
              onClick={() => commit({ step: step - 1 })}
            >
              Back
            </Button>
          ) : null}
          {step < 3 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => commit({ step: step + 1 })}
              disabled={!canContinue}
            >
              Next
            </Button>
          ) : windowFixtures.length > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => void scoreAgain()}
                disabled={scraping}
              >
                Score again
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={() => void scrapeAll()}
                disabled={scraping}
              >
                {scraping
                  ? "Scraping…"
                  : `Scrape all ${windowFixtures.length} fixtures`}
              </Button>
            </div>
          ) : null}
        </div>
      </SectionContainer>
    </div>
  );
}
