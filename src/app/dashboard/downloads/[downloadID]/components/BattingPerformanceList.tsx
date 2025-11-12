"use client";

import type { BattingPerformance } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { Label } from "@/components/type/titles";

interface BattingPerformanceListProps {
  performances: BattingPerformance[];
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * BattingPerformanceList Component
 *
 * Displays batting performances in a table:
 * - Shows top 3 by default
 * - Expandable to show all performances
 * - Columns: Player, Runs, Balls, 4s, 6s, SR, Not Out
 */
export default function BattingPerformanceList({
  performances,
  isExpanded,
  onToggle,
}: BattingPerformanceListProps) {
  // Sort by runs (descending)
  const sortedPerformances = [...performances].sort((a, b) => b.runs - a.runs);
  const topPerformances = sortedPerformances.slice(0, 3);
  const remainingPerformances = sortedPerformances.slice(3);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Batting Performances ({performances.length})
        </Label>
        {remainingPerformances.length > 0 && (
          <Button variant="ghost" size="sm" className="h-7" onClick={onToggle}>
            {isExpanded ? (
              <>
                <ChevronUp className="h-3 w-3 mr-1" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-3 w-3 mr-1" />
                Show All ({remainingPerformances.length} more)
              </>
            )}
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Player</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Balls</TableHead>
              <TableHead className="text-right">4s</TableHead>
              <TableHead className="text-right">6s</TableHead>
              <TableHead className="text-right">SR</TableHead>
              <TableHead className="text-center">Not Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformances.map((performance, index) => {
              const isCentury = performance.runs >= 100;
              const isHalfCentury = performance.runs >= 50 && performance.runs < 100;
              return (
                <TableRow
                  key={index}
                  className={
                    isCentury
                      ? "bg-emerald-50 hover:bg-emerald-100"
                      : isHalfCentury
                      ? "bg-blue-50 hover:bg-blue-100"
                      : ""
                  }
                >
                  <TableCell className="font-medium">
                    {performance.player || "N/A"}
                    {isCentury && (
                      <span className="ml-2 text-xs text-emerald-700 font-semibold">
                        💯
                      </span>
                    )}
                    {isHalfCentury && !isCentury && (
                      <span className="ml-2 text-xs text-blue-700 font-semibold">
                        50+
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {performance.runs}
                  </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {performance.balls}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {performance.fours}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {performance.sixes}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {typeof performance.SR === "number" ? performance.SR.toFixed(2) : performance.SR || "N/A"}
                </TableCell>
                <TableCell className="text-center">
                  {performance.notOut ? (
                    <span className="text-emerald-600 font-semibold">*</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                  </TableCell>
                </TableRow>
              );
            })}
            {isExpanded &&
              remainingPerformances.map((performance, index) => {
                const isCentury = performance.runs >= 100;
                const isHalfCentury = performance.runs >= 50 && performance.runs < 100;
                return (
                  <TableRow
                    key={index + 3}
                    className={
                      isCentury
                        ? "bg-emerald-50 hover:bg-emerald-100"
                        : isHalfCentury
                        ? "bg-blue-50 hover:bg-blue-100"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {performance.player || "N/A"}
                      {isCentury && (
                        <span className="ml-2 text-xs text-emerald-700 font-semibold">
                          💯
                        </span>
                      )}
                      {isHalfCentury && !isCentury && (
                        <span className="ml-2 text-xs text-blue-700 font-semibold">
                          50+
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {performance.runs}
                    </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.balls}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.fours}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.sixes}
                  </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                    {typeof performance.SR === "number"
                      ? performance.SR.toFixed(2)
                      : performance.SR || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {performance.notOut ? (
                      <span className="text-emerald-600 font-semibold">*</span>
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
    </div>
  );
}

