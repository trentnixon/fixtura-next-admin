"use client";

import Image from "next/image";
import { ExternalLink, Trophy } from "lucide-react";
import {
  toFixtureDisplayText,
  toFixtureMapsQuery,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import { getStatusBadge } from "@/app/dashboard/fixtures/_components/_utils/statusUtils";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { EmptyState } from "@/components/ui-library";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  hasLegacyTeamScorecard,
  hasRenderableDetailedScorecard,
  hasTeamRosterData,
  parseInningsScorecards,
} from "@/app/dashboard/fixtures/_components/_utils/fixtureScorecardDisplay";
import type { TeamScorecardData } from "@/types/fixtureDetail";
import {
  InningsScorecardBlocks,
  LegacyTeamScorecardTables,
} from "./FixtureScorecardTables";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";

interface FixtureScorecardSectionProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureScorecardSection({
  data,
}: FixtureScorecardSectionProps) {
  const { fixture, club, grade } = data;

  const homeTeam = club[0];
  const awayTeam = club[1];
  const homeScores = fixture.teams.home.scores;
  const awayScores = fixture.teams.away.scores;
  const hasScores = Boolean(homeScores.total || awayScores.total);
  const scorecards = fixture.matchDetails.scorecards as Record<
    string,
    unknown
  > | null;
  const inningsBlocks = parseInningsScorecards(scorecards);
  const hasDetailedScorecard = hasRenderableDetailedScorecard(scorecards);
  const hasToss =
    fixture.matchDetails.tossWinner || fixture.matchDetails.tossResult;
  const hasResultStatement = Boolean(fixture.matchDetails.resultStatement);
  const scorecardUrl = fixture.matchDetails.urlToScoreCard;

  const venueText = toFixtureDisplayText(fixture.venue.ground, "");
  const venueMapsQuery = toFixtureMapsQuery(fixture.venue.ground);
  const venueMapsUrl = venueMapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueMapsQuery)}`
    : null;

  const scheduleParts = [
    toFixtureDisplayText(fixture.round, ""),
    fixture.dates.date ?? fixture.dates.dateRange ?? "",
    fixture.dates.time ?? "",
    fixture.dates.finalDaysPlay
      ? `Final day ${fixture.dates.finalDaysPlay}`
      : "",
  ].filter(Boolean);

  const hasTeamRoster = hasTeamRosterData(
    fixture.teamRoster as Record<string, TeamScorecardData> | null,
  );

  const hasMatchContext =
    scheduleParts.length > 0 ||
    Boolean(venueText) ||
    Boolean(fixture.status) ||
    Boolean(grade?.gradeName);

  const hasAnyScorecardContent =
    hasScores ||
    hasDetailedScorecard ||
    hasToss ||
    hasResultStatement ||
    hasMatchContext ||
    hasTeamRoster;

  const tossSummary = [
    fixture.matchDetails.tossWinner
      ? `${fixture.matchDetails.tossWinner} won the toss`
      : null,
    fixture.matchDetails.tossResult
      ? `elected to ${fixture.matchDetails.tossResult}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <SectionContainer
      title="Scorecard"
      description="Line scores, innings detail, toss, and result."
      icon={<Trophy className="h-5 w-5 text-slate-500" aria-hidden />}
      variant="compact"
      contentClassName={hasAnyScorecardContent ? "p-0" : undefined}
    >
      {!hasAnyScorecardContent ? (
        <EmptyState
          variant="minimal"
          title="No scorecard data yet"
          description="Run Scrape result from Data actions after the match is playable on PlayHQ, then refresh this page."
          className="py-10"
        />
      ) : (
        <div className="overflow-hidden bg-white">
          {hasMatchContext ? (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5 sm:px-5">
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                {grade?.gradeName ? (
                  <span className="font-medium text-slate-800">
                    {grade.gradeName}
                  </span>
                ) : null}
                {scheduleParts.map((part) => (
                  <span key={part}>{part}</span>
                ))}
                {venueText ? (
                  <span className="inline-flex items-center gap-1">
                    {venueMapsUrl ? (
                      <a
                        href={venueMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-800 underline-offset-2 hover:underline"
                      >
                        {venueText}
                      </a>
                    ) : (
                      <span className="font-medium text-slate-800">
                        {venueText}
                      </span>
                    )}
                  </span>
                ) : null}
                {fixture.gameID ? (
                  <span className="text-muted-foreground">
                    Game {fixture.gameID}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(fixture.status)}
              </div>
            </div>
          ) : null}

          {hasResultStatement ? (
            <div className="border-b border-slate-800/10 bg-slate-900 px-4 py-2.5 text-center text-sm font-medium text-white">
              {fixture.matchDetails.resultStatement}
            </div>
          ) : null}

          <div className="grid grid-cols-1 divide-y border-slate-200 md:grid-cols-[1fr_auto_1fr] md:divide-x md:divide-y-0 md:items-stretch">
            <TeamLineScore
              side="home"
              team={homeTeam}
              fallbackName={fixture.teams.home.name || "Home"}
              scores={homeScores}
              showTotals={hasScores}
            />
            <div
              className="hidden items-center justify-center border-x border-slate-200 bg-slate-50 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:flex"
              aria-hidden
            >
              vs
            </div>
            <TeamLineScore
              side="away"
              team={awayTeam}
              fallbackName={fixture.teams.away.name || "Away"}
              scores={awayScores}
              showTotals={hasScores}
            />
          </div>

          {(hasToss || scorecardUrl || fixture.type) ? (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-muted-foreground sm:px-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {hasToss ? (
                  <span>
                    <span className="font-medium text-slate-700">Toss:</span>{" "}
                    {tossSummary}
                  </span>
                ) : null}
                {fixture.type ? (
                  <span className="text-slate-500">
                    {toFixtureDisplayText(fixture.type)}
                    {fixture.isFinished ? " · Final" : ""}
                  </span>
                ) : null}
              </div>
              {scorecardUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(siteNavigationCtaClass, "h-8 text-xs")}
                  asChild
                >
                  <a
                    href={scorecardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PlayHQ
                    <ExternalLink className="ml-1.5 h-3 w-3" aria-hidden />
                  </a>
                </Button>
              ) : null}
            </div>
          ) : null}

          {hasDetailedScorecard ? (
            <div className="border-t border-slate-200">
              {inningsBlocks.length > 0 ? (
                <InningsScorecardBlocks blocks={inningsBlocks} />
              ) : (
                Object.entries(scorecards ?? {})
                  .filter(([, entry]) =>
                    hasLegacyTeamScorecard(entry as TeamScorecardData),
                  )
                  .map(([teamName, teamData]) => (
                    <LegacyTeamScorecardTables
                      key={teamName}
                      teamName={teamName}
                      teamData={teamData as TeamScorecardData}
                    />
                  ))
              )}
            </div>
          ) : null}

          {hasTeamRoster ? (
            <div className="border-t border-slate-200">
              <p className="border-b border-slate-200 bg-slate-50/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 sm:px-5">
                Squad / roster (CMS)
              </p>
              {Object.entries(fixture.teamRoster ?? {})
                .filter(([, entry]) =>
                  hasLegacyTeamScorecard(entry as TeamScorecardData),
                )
                .map(([teamName, teamData]) => (
                  <LegacyTeamScorecardTables
                    key={`roster-${teamName}`}
                    teamName={teamName}
                    teamData={teamData as TeamScorecardData}
                  />
                ))}
            </div>
          ) : null}
        </div>
      )}
    </SectionContainer>
  );
}

function TeamLineScore({
  side,
  team,
  fallbackName,
  scores,
  showTotals,
}: {
  side: "home" | "away";
  team: SingleFixtureDetailResponse["club"][number] | undefined;
  fallbackName: string;
  scores: SingleFixtureDetailResponse["fixture"]["teams"]["home"]["scores"];
  showTotals: boolean;
}) {
  const name = team?.name || fallbackName;

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4",
        side === "away" && "md:flex-row-reverse md:text-right",
      )}
    >
      {team?.logoUrl ? (
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md border bg-white">
          <Image
            src={team.logoUrl}
            alt={name}
            fill
            className="object-contain p-1.5"
            unoptimized
          />
        </div>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border bg-slate-100">
          <Trophy className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-slate-900">
          {name}
        </div>
        {scores.firstInnings ? (
          <div className="mt-0.5 text-xs text-muted-foreground">
            1st inns {scores.firstInnings}
          </div>
        ) : null}
      </div>
      {showTotals && scores.total ? (
        <div className={cn("shrink-0", side === "away" && "md:text-left")}>
          <div className="text-2xl font-bold tabular-nums tracking-tight text-slate-900">
            {scores.total}
          </div>
          {scores.overs ? (
            <div className="text-xs text-muted-foreground">
              {scores.overs} ov
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
