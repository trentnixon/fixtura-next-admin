"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchGamesCricket } from "@/hooks/games/useFetchGamesCricket";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Fixture } from "@/types/fixture";

// Helper function to group fixtures by grade
function groupByGrade(fixtures: Fixture[]): Record<string, Fixture[]> {
  return fixtures.reduce(
    (acc, fixture) => {
      const grade = fixture.gradeName || "Uncategorized";
      if (!acc[grade]) {
        acc[grade] = [];
      }
      acc[grade].push(fixture);
      return acc;
    },
    {} as Record<string, Fixture[]>,
  );
}

export default function TableGamesResults() {
  const { renderID } = useParams();

  // Fetch game fixtures directly using render ID
  const {
    data: gameData,
    isLoading: isGameLoading,
    isError: isGameError,
    error: gameError,
    refetch: refetchGames,
  } = useFetchGamesCricket(renderID as string);

  // Group fixtures by grade
  const groupedByGrade = useMemo(() => {
    if (!gameData || !Array.isArray(gameData)) return {};
    return groupByGrade(gameData);
  }, [gameData]);

  // UI: Loading State
  if (isGameLoading) {
    return <LoadingState message="Loading games…" />;
  }

  // UI: Error State
  if (isGameError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load games"
        error={gameError as Error}
        onRetry={() => refetchGames()}
      />
    );
  }

  // UI: Empty State - No game data
  if (!gameData || !Array.isArray(gameData) || gameData.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No games available"
        description="No game results found for this render."
      />
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedByGrade).map(([gradeName, fixtures]) => (
        <ElementContainer
          key={gradeName}
          title={gradeName}
          border={false}
          padding="none"
          margin="lg"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead>Round</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Ground</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixtures.map((fixture) => {
                const { id, ground, teamHome, teamAway, status, round } =
                  fixture;

                return (
                  <TableRow key={id}>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-900">
                        {round || "N/A"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-slate-900">
                        {teamHome || "N/A"} vs {teamAway || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Fixture ID {id}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {ground || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      {status || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/fixtures/${id}`} passHref>
                        <Button variant="primary" size="sm">
                          View
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ElementContainer>
      ))}
    </div>
  );
}
