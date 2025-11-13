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
import { useFetchUpcomingGamesCricket } from "@/hooks/games/useFetchUpcomingGamesCricket";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Fixture } from "@/types/fixture";

// Helper function to group fixtures by grade
function groupByGrade(fixtures: Fixture[]): Record<string, Fixture[]> {
  return fixtures.reduce((acc, fixture) => {
    const grade = fixture.gradeName || "Uncategorized";
    if (!acc[grade]) {
      acc[grade] = [];
    }
    acc[grade].push(fixture);
    return acc;
  }, {} as Record<string, Fixture[]>);
}

export default function TableUpcomingGames() {
  const { renderID } = useParams();

  // Fetch upcoming game fixtures directly using render ID
  const {
    data: gameData,
    isLoading: isGameLoading,
    isError: isGameError,
    error: gameError,
    refetch: refetchGames,
  } = useFetchUpcomingGamesCricket(renderID as string);

  // Group fixtures by grade
  const groupedByGrade = useMemo(() => {
    if (!gameData || !Array.isArray(gameData)) return {};
    return groupByGrade(gameData);
  }, [gameData]);

  // UI: Loading State
  if (isGameLoading) {
    return <LoadingState message="Loading upcoming games…" />;
  }

  // UI: Error State
  if (isGameError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load upcoming games"
        error={gameError as Error}
        onRetry={() => refetchGames()}
      />
    );
  }

  // UI: Empty State - No upcoming games
  if (!gameData || !Array.isArray(gameData) || gameData.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No upcoming games available"
        description="No upcoming games found for this render."
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
              <TableRow>
                <TableHead>Round</TableHead>
                <TableHead>Ground</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixtures.map((fixture) => {
                const { id, ground, teamHome, teamAway, status, round } =
                  fixture;

                return (
                  <TableRow key={id}>
                    <TableCell>{round || "N/A"}</TableCell>
                    <TableCell>{ground || "N/A"}</TableCell>
                    <TableCell>
                      {teamHome || "N/A"} vs {teamAway || "N/A"}
                    </TableCell>
                    <TableCell>{status || "N/A"}</TableCell>
                    <TableCell>
                      <Link href={`/dashboard/fixtures/${id}`}>
                        <Button variant="accent">
                          <EyeIcon className="h-4 w-4" />
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
