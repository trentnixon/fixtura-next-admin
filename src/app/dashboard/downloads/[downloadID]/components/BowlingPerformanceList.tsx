"use client";

import type { BowlingPerformance } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Target } from "lucide-react";
import { Label } from "@/components/type/titles";

interface BowlingPerformanceListProps {
  performances: BowlingPerformance[];
  isExpanded: boolean;
  onToggle: () => void;
}

/**
 * BowlingPerformanceList Component
 *
 * Displays bowling performances in a table:
 * - Shows top 3 by default
 * - Expandable to show all performances
 * - Columns: Player, Overs, Maidens, Runs, Wickets, Economy
 */
export default function BowlingPerformanceList({
  performances,
  isExpanded,
  onToggle,
}: BowlingPerformanceListProps) {
  // Sort by wickets (descending), then by economy (ascending)
  const sortedPerformances = [...performances].sort((a, b) => {
    if (b.wickets !== a.wickets) {
      return b.wickets - a.wickets;
    }
    return parseFloat(a.economy) - parseFloat(b.economy);
  });
  const topPerformances = sortedPerformances.slice(0, 3);
  const remainingPerformances = sortedPerformances.slice(3);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <Target className="h-4 w-4" />
          Bowling Performances ({performances.length})
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
              <TableHead className="text-right">Overs</TableHead>
              <TableHead className="text-right">Maidens</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Wickets</TableHead>
              <TableHead className="text-right">Economy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topPerformances.map((performance, index) => {
              const isFiveWickets = performance.wickets >= 5;
              return (
                <TableRow
                  key={index}
                  className={
                    isFiveWickets ? "bg-purple-50 hover:bg-purple-100" : ""
                  }
                >
                  <TableCell className="font-medium">
                    {performance.player || "N/A"}
                    {isFiveWickets && (
                      <span className="ml-2 text-xs text-purple-700 font-semibold">
                        🎯 5+
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {performance.overs}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.maidens}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.runs}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {performance.wickets}
                  </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {performance.economy}
                  </TableCell>
                </TableRow>
              );
            })}
            {isExpanded &&
              remainingPerformances.map((performance, index) => {
                const isFiveWickets = performance.wickets >= 5;
                return (
                  <TableRow
                    key={index + 3}
                    className={
                      isFiveWickets ? "bg-purple-50 hover:bg-purple-100" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      {performance.player || "N/A"}
                      {isFiveWickets && (
                        <span className="ml-2 text-xs text-purple-700 font-semibold">
                          🎯 5+
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {performance.overs}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {performance.maidens}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {performance.runs}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {performance.wickets}
                    </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {performance.economy}
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

