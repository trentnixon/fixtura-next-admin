"use client";

import Image from "next/image";
import { Trophy, Calendar, Clock, MapPin } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import type { BattingPlayer, BowlingPlayer } from "@/types/fixtureDetail";

interface FixtureMatchProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureMatch({ data }: FixtureMatchProps) {
  const { fixture, club } = data;

  const homeTeam = club[0];
  const awayTeam = club[1];
  const homeScores = fixture.teams.home.scores;
  const awayScores = fixture.teams.away.scores;
  const hasScores = homeScores.total || awayScores.total;
  const scorecards = fixture.matchDetails.scorecards;

  // Format dates
  const formattedDate = fixture.dates.date
    ? format(new Date(fixture.dates.date), "EEEE, MMMM d, yyyy")
    : null;
  const formattedTime = fixture.dates.time || null;

  // Match info rows
  const matchInfoRows = [
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Date",
      value: formattedDate,
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: "Time",
      value: formattedTime,
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Venue",
      value: fixture.venue.ground,
    },
  ].filter((row) => row.value);

  return (
    <SectionContainer
      title="Match Summary"
      description="Teams and match result"
    >
      <div className="space-y-6">
        {/* Status Badges */}
        <div className="flex items-center gap-2 justify-end">
          {fixture.isFinished && <Badge variant="outline">Finished</Badge>}
          <Badge variant="outline">{fixture.type}</Badge>
        </div>

        {/* Match Info Grid */}
        {matchInfoRows.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {matchInfoRows.map((row, index) => (
              <div key={index} className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {row.icon}
                  <span className="font-medium">{row.label}</span>
                </div>
                <div className="text-base font-medium text-slate-900 dark:text-slate-100">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Result Statement - Publication Style */}
        {fixture.matchDetails.resultStatement && (
          <div className="p-5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-l-4 border-emerald-500 dark:border-emerald-400">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1">
                  Match Result
                </div>
                <p className="text-base leading-relaxed text-emerald-800 dark:text-emerald-200">
                  {fixture.matchDetails.resultStatement}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Match Scoreboard - Publication Style */}
        <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-gray-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-slate-200 dark:divide-slate-700">
            {/* Home Team */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {homeTeam?.logoUrl ? (
                    <div className="relative w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white p-1.5 shadow-sm">
                      <Image
                        src={homeTeam.logoUrl}
                        alt={homeTeam.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xl text-gray-900 dark:text-gray-100">
                      {homeTeam?.name || fixture.teams.home.name || "Home Team"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Home
                    </div>
                  </div>
                </div>
                {hasScores && homeScores.total && (
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {homeScores.total}
                    </div>
                    {homeScores.overs && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        ({homeScores.overs} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>
              {homeScores.firstInnings && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    1st innings:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {homeScores.firstInnings}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {awayTeam?.logoUrl ? (
                    <div className="relative w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white p-1.5 shadow-sm">
                      <Image
                        src={awayTeam.logoUrl}
                        alt={awayTeam.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-xl text-gray-900 dark:text-gray-100">
                      {awayTeam?.name || fixture.teams.away.name || "Away Team"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Away
                    </div>
                  </div>
                </div>
                {hasScores && awayScores.total && (
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                      {awayScores.total}
                    </div>
                    {awayScores.overs && (
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        ({awayScores.overs} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>
              {awayScores.firstInnings && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    1st innings:{" "}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {awayScores.firstInnings}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Scorecard */}
        {scorecards && Object.keys(scorecards).length > 0 && (
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Detailed Scorecard
              </h3>

              {scorecards &&
                Object.entries(scorecards).map(([teamName, teamData]) => (
                  <div key={teamName} className="mb-6 last:mb-0">
                    <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-t-lg">
                      <h4 className="font-bold text-gray-900 dark:text-gray-100">
                        {teamName}
                      </h4>
                    </div>

                    {/* Batting */}
                    {teamData.batting &&
                      Array.isArray(teamData.batting) &&
                      teamData.batting.length > 0 && (
                        <div className="mb-4">
                          <div className="rounded-b-lg border border-t-0 overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-900">
                                  <TableHead className="font-semibold">
                                    Batter
                                  </TableHead>
                                  <TableHead className="text-center">
                                    R
                                  </TableHead>
                                  <TableHead className="text-center">
                                    B
                                  </TableHead>
                                  <TableHead className="text-center">
                                    4s
                                  </TableHead>
                                  <TableHead className="text-center">
                                    6s
                                  </TableHead>
                                  <TableHead className="text-center">
                                    SR
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {teamData.batting.map(
                                  (player: BattingPlayer, idx: number) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-medium">
                                        <div>
                                          <div>
                                            {player.name || player.player}
                                          </div>
                                          {player.dismissal && (
                                            <div className="text-xs text-slate-500 dark:text-slate-400">
                                              {player.dismissal}
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.runs || player.R || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.balls || player.B || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.fours || player["4s"] || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.sixes || player["6s"] || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.strikeRate || player.SR || "-"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}

                    {/* Bowling */}
                    {teamData.bowling &&
                      Array.isArray(teamData.bowling) &&
                      teamData.bowling.length > 0 && (
                        <div>
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 px-1">
                            Bowling
                          </div>
                          <div className="rounded-lg border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50 dark:bg-slate-900">
                                  <TableHead className="font-semibold">
                                    Bowler
                                  </TableHead>
                                  <TableHead className="text-center">
                                    O
                                  </TableHead>
                                  <TableHead className="text-center">
                                    M
                                  </TableHead>
                                  <TableHead className="text-center">
                                    R
                                  </TableHead>
                                  <TableHead className="text-center">
                                    W
                                  </TableHead>
                                  <TableHead className="text-center">
                                    Econ
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {teamData.bowling.map(
                                  (player: BowlingPlayer, idx: number) => (
                                    <TableRow key={idx}>
                                      <TableCell className="font-medium">
                                        {player.name || player.player}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.overs || player.O || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.maidens || player.M || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.runs || player.R || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.wickets || player.W || "-"}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {player.economy || player.Econ || "-"}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Toss Information */}
        {(fixture.matchDetails.tossWinner ||
          fixture.matchDetails.tossResult) && (
          <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400 mb-3">
              Toss
            </div>
            <div className="space-y-2">
              {fixture.matchDetails.tossWinner && (
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {fixture.matchDetails.tossWinner}
                  </span>{" "}
                  won the toss
                </p>
              )}
              {fixture.matchDetails.tossResult && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  and elected to{" "}
                  <span className="font-medium">
                    {fixture.matchDetails.tossResult}
                  </span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
