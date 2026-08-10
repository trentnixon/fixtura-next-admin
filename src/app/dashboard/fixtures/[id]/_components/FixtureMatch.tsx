"use client";

import Image from "next/image";
import { Trophy } from "lucide-react";
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

  return (
    <SectionContainer
      title="Scorecard"
      description="Scores, batting, bowling, and toss details."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end gap-2">
          {fixture.isFinished && <Badge variant="outline">Finished</Badge>}
          <Badge variant="outline">{fixture.type}</Badge>
        </div>

        {fixture.matchDetails.resultStatement && (
          <div className="rounded-lg border bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <Trophy className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-500" />
              <div>
                <div className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                  Match Result
                </div>
                <p className="text-sm font-medium leading-relaxed text-slate-900">
                  {fixture.matchDetails.resultStatement}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border">
          <div className="grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {homeTeam?.logoUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-white">
                      <Image
                        src={homeTeam.logoUrl}
                        alt={homeTeam.name}
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-100">
                      <Trophy className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {homeTeam?.name || fixture.teams.home.name || "Home Team"}
                    </div>
                    <div className="text-xs text-muted-foreground">Home</div>
                  </div>
                </div>
                {hasScores && homeScores.total && (
                  <div className="text-right">
                    <div className="text-xl font-semibold text-slate-900">
                      {homeScores.total}
                    </div>
                    {homeScores.overs && (
                      <div className="text-xs text-muted-foreground">
                        ({homeScores.overs} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>
              {homeScores.firstInnings && (
                <div className="mt-3 border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    1st innings:{" "}
                    <span className="font-medium text-slate-700">
                      {homeScores.firstInnings}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {awayTeam?.logoUrl ? (
                    <div className="relative h-10 w-10 overflow-hidden rounded-md border bg-white">
                      <Image
                        src={awayTeam.logoUrl}
                        alt={awayTeam.name}
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-slate-100">
                      <Trophy className="h-5 w-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {awayTeam?.name || fixture.teams.away.name || "Away Team"}
                    </div>
                    <div className="text-xs text-muted-foreground">Away</div>
                  </div>
                </div>
                {hasScores && awayScores.total && (
                  <div className="text-right">
                    <div className="text-xl font-semibold text-slate-900">
                      {awayScores.total}
                    </div>
                    {awayScores.overs && (
                      <div className="text-xs text-muted-foreground">
                        ({awayScores.overs} ov)
                      </div>
                    )}
                  </div>
                )}
              </div>
              {awayScores.firstInnings && (
                <div className="mt-3 border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    1st innings:{" "}
                    <span className="font-medium text-slate-700">
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
              <h3 className="mb-4 text-sm font-semibold text-slate-900">
                Detailed Scorecard
              </h3>

              {scorecards &&
                Object.entries(scorecards).map(([teamName, teamData]) => (
                  <div key={teamName} className="mb-6 last:mb-0">
                    <div className="rounded-t-lg bg-slate-100 px-4 py-2">
                      <h4 className="text-sm font-semibold text-slate-900">
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
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                  <TableHead className="font-semibold">
                                    Batter
                                  </TableHead>
                                  <TableHead className="text-right">
                                    R
                                  </TableHead>
                                  <TableHead className="text-right">
                                    B
                                  </TableHead>
                                  <TableHead className="text-right">
                                    4s
                                  </TableHead>
                                  <TableHead className="text-right">
                                    6s
                                  </TableHead>
                                  <TableHead className="text-right">
                                    SR
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {teamData.batting.map(
                                  (player: BattingPlayer, idx: number) => (
                                    <TableRow key={idx}>
                                      <TableCell>
                                        <div>
                                          <div className="text-sm font-medium text-slate-900">
                                            {player.name || player.player}
                                          </div>
                                          {player.dismissal && (
                                            <div className="text-xs text-muted-foreground">
                                              {player.dismissal}
                                            </div>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.runs || player.R || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.balls || player.B || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.fours || player["4s"] || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.sixes || player["6s"] || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.strikeRate || player.SR || "-"}
                                      </TableCell>
                                    </TableRow>
                                  ),
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
                          <div className="mb-2 px-1 text-xs font-medium uppercase text-muted-foreground">
                            Bowling
                          </div>
                          <div className="rounded-lg border overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-slate-50 hover:bg-slate-50">
                                  <TableHead className="font-semibold">
                                    Bowler
                                  </TableHead>
                                  <TableHead className="text-right">
                                    O
                                  </TableHead>
                                  <TableHead className="text-right">
                                    M
                                  </TableHead>
                                  <TableHead className="text-right">
                                    R
                                  </TableHead>
                                  <TableHead className="text-right">
                                    W
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Econ
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {teamData.bowling.map(
                                  (player: BowlingPlayer, idx: number) => (
                                    <TableRow key={idx}>
                                      <TableCell className="text-sm font-medium text-slate-900">
                                        {player.name || player.player}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.overs || player.O || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.maidens || player.M || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.runs || player.R || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.wickets || player.W || "-"}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {player.economy || player.Econ || "-"}
                                      </TableCell>
                                    </TableRow>
                                  ),
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
          <div className="rounded-lg border bg-slate-50 p-4">
            <div className="mb-3 text-xs font-medium uppercase text-muted-foreground">
              Toss
            </div>
            <div className="space-y-2">
              {fixture.matchDetails.tossWinner && (
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">
                    {fixture.matchDetails.tossWinner}
                  </span>{" "}
                  won the toss
                </p>
              )}
              {fixture.matchDetails.tossResult && (
                <p className="text-sm text-muted-foreground">
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
