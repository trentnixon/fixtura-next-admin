"use client";

import Image from "next/image";
import {
  Calendar,
  Clock,
  Database,
  MapPin,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import { format } from "date-fns";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";

interface FixtureSnapshotProps {
  data: SingleFixtureDetailResponse;
}

function formatDate(value: string | null): string {
  if (!value) return "Not provided";
  try {
    return format(new Date(value), "EEE, d MMM yyyy");
  } catch {
    return value;
  }
}

function scoreText(total: string | null, overs: string | null): string {
  if (!total) return "No score";
  return overs ? `${total} (${overs} ov)` : total;
}

export default function FixtureSnapshot({ data }: FixtureSnapshotProps) {
  const { fixture, grade, club, downloads, renderStatus, meta } = data;

  const homeTeam = club[0];
  const awayTeam = club[1];
  const homeScore = fixture.teams.home.scores;
  const awayScore = fixture.teams.away.scores;
  const renderCount =
    renderStatus.upcomingGamesRenders.length +
    renderStatus.gameResultsRenders.length;

  const metrics = [
    {
      label: "Status",
      value: fixture.isFinished ? "Finished" : fixture.status || "Unknown",
    },
    {
      label: "Grade",
      value: grade?.gradeName ?? "Not linked",
    },
    {
      label: "Media",
      value: `${downloads.length} download${downloads.length === 1 ? "" : "s"}`,
    },
    {
      label: "Renders",
      value: `${renderCount} render${renderCount === 1 ? "" : "s"}`,
    },
  ];

  const details = [
    {
      icon: Calendar,
      label: "Date",
      value: formatDate(fixture.dates.date),
    },
    {
      icon: Clock,
      label: "Time",
      value: fixture.dates.time ?? "Not provided",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: fixture.venue.ground ?? "Not provided",
    },
    {
      icon: Database,
      label: "Game ID",
      value: fixture.gameID || "Not provided",
    },
  ];

  return (
    <SectionContainer
      title="Fixture Snapshot"
      description="Core fixture state, schedule, teams, and data quality."
    >
      <div className="space-y-5">
        <div className="grid overflow-hidden rounded-lg border sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="border-b px-4 py-3 last:border-b-0 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="text-xs font-medium uppercase text-muted-foreground">
                {metric.label}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-900">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {details.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="text-xs font-medium uppercase text-muted-foreground">
                  {label}
                </span>
              </div>
              <span className="text-right text-sm font-medium text-slate-900">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border">
          <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            {[
              {
                label: "Home",
                team: homeTeam,
                fallback: fixture.teams.home.name || "Home Team",
                score: scoreText(homeScore.total, homeScore.overs),
                innings: homeScore.firstInnings,
              },
              {
                label: "Away",
                team: awayTeam,
                fallback: fixture.teams.away.name || "Away Team",
                score: scoreText(awayScore.total, awayScore.overs),
                innings: awayScore.firstInnings,
              },
            ].map((side) => (
              <div key={side.label} className="flex items-center gap-4 p-4">
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border bg-white">
                  {side.team?.logoUrl ? (
                    <Image
                      src={side.team.logoUrl}
                      alt={side.team.name}
                      fill
                      className="object-contain p-1.5"
                      unoptimized
                    />
                  ) : (
                    <Trophy className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {side.label}
                  </div>
                  <div className="truncate text-sm font-medium text-slate-900">
                    {side.team?.name || side.fallback}
                  </div>
                  {side.innings && (
                    <div className="text-xs text-muted-foreground">
                      1st innings: {side.innings}
                    </div>
                  )}
                </div>
                <div className="text-right text-lg font-semibold text-slate-900">
                  {side.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {fixture.matchDetails.resultStatement && (
          <div className="rounded-lg border bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-600" />
              <span className="text-xs font-medium uppercase text-muted-foreground">
                Result
              </span>
              <Badge variant="outline" className="ml-auto">
                {meta.validation.overallScore}% quality
              </Badge>
            </div>
            <p className="mt-2 text-sm font-medium text-slate-900">
              {fixture.matchDetails.resultStatement}
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
