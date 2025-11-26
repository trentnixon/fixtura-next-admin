"use client";

import Image from "next/image";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Trophy } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { StatCard, MetricGrid } from "@/components/ui-library";

interface FixtureTeamsProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureTeams({ data }: FixtureTeamsProps) {
  const { fixture, club } = data;

  // Get home and away teams from club array (first is home, second is away)
  const homeTeam = club[0];
  const awayTeam = club[1];

  // Get scores from fixture.teams
  const homeScores = fixture.teams.home.scores;
  const awayScores = fixture.teams.away.scores;

  const hasScores =
    homeScores.total || awayScores.total || fixture.isFinished;

  return (
    <SectionContainer
      title="Teams & Scores"
      description="Match participants and scoring details"
    >
      <div className="space-y-6">
        {/* Teams Display with Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Team */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
            <div className="flex-shrink-0">
              {homeTeam?.logoUrl ? (
                <div className="relative w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white p-2 shadow-md overflow-hidden">
                  <Image
                    src={homeTeam.logoUrl}
                    alt={homeTeam.name || "Home Team"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                HOME
              </div>
              <div className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate">
                {homeTeam?.name || fixture.teams.home.name || "Home Team"}
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-sm">
            <div className="flex-shrink-0">
              {awayTeam?.logoUrl ? (
                <div className="relative w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white p-2 shadow-md overflow-hidden">
                  <Image
                    src={awayTeam.logoUrl}
                    alt={awayTeam.name || "Away Team"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                AWAY
              </div>
              <div className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate">
                {awayTeam?.name || fixture.teams.away.name || "Away Team"}
              </div>
            </div>
          </div>
        </div>

        {/* Scores as Stat Cards */}
        {hasScores && (
          <MetricGrid columns={2} gap="md">
            <StatCard
              title={homeTeam?.name || fixture.teams.home.name || "Home Team"}
              value={homeScores.total || "N/A"}
              description={
                homeScores.overs
                  ? `${homeScores.overs} overs${homeScores.firstInnings
                    ? ` • 1st: ${homeScores.firstInnings}`
                    : ""
                  }`
                  : homeScores.firstInnings
                    ? `1st innings: ${homeScores.firstInnings}`
                    : undefined
              }
              icon={<Trophy className="w-5 h-5" />}
              variant="primary"
            />
            <StatCard
              title={awayTeam?.name || fixture.teams.away.name || "Away Team"}
              value={awayScores.total || "N/A"}
              description={
                awayScores.overs
                  ? `${awayScores.overs} overs${awayScores.firstInnings
                    ? ` • 1st: ${awayScores.firstInnings}`
                    : ""
                  }`
                  : awayScores.firstInnings
                    ? `1st innings: ${awayScores.firstInnings}`
                    : undefined
              }
              icon={<Trophy className="w-5 h-5" />}
              variant="secondary"
            />
          </MetricGrid>
        )}

        {/* Result Statement */}
        {fixture.matchDetails.resultStatement && (
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-blue-900 dark:text-blue-100">
                Match Result
              </span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              {fixture.matchDetails.resultStatement}
            </p>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}

