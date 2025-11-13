"use client";

import Image from "next/image";
import type { LadderTeam } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface LadderTableProps {
  teams: LadderTeam[];
}

/**
 * LadderTable Component
 *
 * Displays a league table for a ladder grade:
 * - Team position, name, logo
 * - Points, wins, losses, ties
 * - Bonus points and quotient (if available)
 */
export default function LadderTable({ teams }: LadderTableProps) {
  // Check if quotient (Q) is available in any team
  const hasQuotient = teams.some((team) => team.Q !== undefined);
  // Check if bonus points (BP) is available in any team
  const hasBonusPoints = teams.some((team) => team.BP !== undefined);

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-center">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="text-center">P</TableHead>
            <TableHead className="text-center">W</TableHead>
            <TableHead className="text-center">L</TableHead>
            <TableHead className="text-center">TIE</TableHead>
            <TableHead className="text-center">N/R</TableHead>
            <TableHead className="text-center">BYE</TableHead>
            {hasBonusPoints && (
              <TableHead className="text-center">BP</TableHead>
            )}
            <TableHead className="text-center font-semibold">PTS</TableHead>
            {hasQuotient && (
              <TableHead className="text-center">Q</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell className="text-center font-semibold">
                {team.position}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {/* Team Logo */}
                  {team.playHQLogo && (
                    <div className="flex-shrink-0">
                      <div className="relative w-8 h-8 rounded border bg-white p-0.5">
                        <Image
                          src={team.playHQLogo}
                          alt={`${team.teamName} logo`}
                          width={28}
                          height={28}
                          className="w-full h-full object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                  <span className="font-medium">{team.teamName}</span>
                </div>
              </TableCell>
              <TableCell className="text-center">{team.P}</TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {team.W}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  {team.L}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{team.TIE}</TableCell>
              <TableCell className="text-center">{team["N/R"]}</TableCell>
              <TableCell className="text-center">{team.BYE}</TableCell>
              {hasBonusPoints && (
                <TableCell className="text-center">{team.BP || "-"}</TableCell>
              )}
              <TableCell className="text-center font-semibold">
                {team.PTS}
              </TableCell>
              {hasQuotient && (
                <TableCell className="text-center font-mono text-xs">
                  {team.Q || "-"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

