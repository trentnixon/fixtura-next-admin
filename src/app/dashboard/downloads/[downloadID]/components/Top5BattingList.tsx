"use client";

import Image from "next/image";
import type { Top5BattingPerformance } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface Top5BattingListProps {
  performances: Top5BattingPerformance[];
}

/**
 * Top5BattingList Component
 *
 * Displays a list of top 5 batting performances in a table:
 * - Rank, Player name, Team logo, Team name
 * - Runs, Balls, Strike Rate, Not Out
 * - Grade and Competition badges
 */
export default function Top5BattingList({
  performances,
}: Top5BattingListProps) {
  if (!performances || performances.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">Runs</TableHead>
            <TableHead className="text-center">Balls</TableHead>
            <TableHead className="text-center">SR</TableHead>
            <TableHead className="text-center">Not Out</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Competition</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performances.map((performance, index) => {
            const rank = index + 1;
            const runs = typeof performance.runs === "string"
              ? parseInt(performance.runs) || 0
              : performance.runs;
            const balls = typeof performance.balls === "string"
              ? parseInt(performance.balls) || 0
              : performance.balls;
            const strikeRate = typeof performance.SR === "string"
              ? parseFloat(performance.SR) || 0
              : performance.SR;
            const notOut = performance.notOut;

            return (
              <TableRow key={index}>
                {/* Rank */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`w-8 h-8 rounded-full flex items-center justify-center p-0 mx-auto ${
                      rank === 1
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : rank === 2
                        ? "bg-slate-50 text-slate-700 border-slate-200"
                        : rank === 3
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {rank === 1 ? (
                      <Trophy className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-semibold">{rank}</span>
                    )}
                  </Badge>
                </TableCell>

                {/* Player Name */}
                <TableCell className="font-medium">
                  {performance.name}
                </TableCell>

                {/* Team */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {performance.teamLogo?.url && (
                      <div className="flex-shrink-0">
                        <div className="relative w-8 h-8 rounded border bg-white p-0.5">
                          <Image
                            src={performance.teamLogo.url}
                            alt={`${performance.playedFor} logo`}
                            width={28}
                            height={28}
                            className="w-full h-full object-contain"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                    <span className="text-sm">{performance.playedFor}</span>
                  </div>
                </TableCell>

                {/* Runs */}
                <TableCell className="text-center font-semibold text-emerald-700">
                  {runs}
                </TableCell>

                {/* Balls */}
                <TableCell className="text-center font-semibold">
                  {balls}
                </TableCell>

                {/* Strike Rate */}
                <TableCell className="text-center font-mono text-sm">
                  {typeof strikeRate === "number"
                    ? strikeRate.toFixed(2)
                    : strikeRate}
                </TableCell>

                {/* Not Out */}
                <TableCell className="text-center">
                  {notOut ? (
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Yes
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>

                {/* Grade */}
                <TableCell>
                  {performance.assignSponsors?.grade?.name ? (
                    <Badge
                      variant="outline"
                      className="bg-purple-50 text-purple-700 border-purple-200"
                    >
                      {performance.assignSponsors.grade.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>

                {/* Competition */}
                <TableCell>
                  {performance.assignSponsors?.competition?.name ? (
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {performance.assignSponsors.competition.name}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

