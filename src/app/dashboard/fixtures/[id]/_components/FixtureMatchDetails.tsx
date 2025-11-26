"use client";

import { ExternalLink } from "lucide-react";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Button } from "@/components/ui/button";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface FixtureMatchDetailsProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureMatchDetails({
  data,
}: FixtureMatchDetailsProps) {
  const { fixture } = data;
  const { matchDetails } = fixture;

  const hasTossInfo = matchDetails.tossWinner || matchDetails.tossResult;
  const hasScorecard = matchDetails.urlToScoreCard;

  if (!hasTossInfo && !hasScorecard && !matchDetails.resultStatement) {
    return null;
  }

  return (
    <SectionContainer
      title="Game Metadata"
      description="Match details and scorecard information"
    >
      <div className="rounded-lg border">
        <Table>
          <TableBody>
            {/* Toss Winner */}
            {matchDetails.tossWinner && (
              <TableRow>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                  Toss Winner
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {matchDetails.tossWinner}
                </TableCell>
              </TableRow>
            )}

            {/* Toss Result */}
            {matchDetails.tossResult && (
              <TableRow>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                  Toss Decision
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {matchDetails.tossResult}
                </TableCell>
              </TableRow>
            )}

            {/* Result Statement */}
            {matchDetails.resultStatement && (
              <TableRow>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                  Result
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100">
                  {matchDetails.resultStatement}
                </TableCell>
              </TableRow>
            )}

            {/* Scorecard Link */}
            {hasScorecard && (
              <TableRow>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                  Scorecard
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={matchDetails.urlToScoreCard || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <span>View Scorecard</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}


