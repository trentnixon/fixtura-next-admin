"use client";

import { useParams } from "next/navigation";
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
import { EyeIcon } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

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
    <div className="space-y-4">
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
          {gameData.map((fixture) => {
            const { id, ground, teamHome, teamAway, status, round } = fixture;

            return (
              <TableRow key={id}>
                <TableCell>{round || "N/A"}</TableCell>
                <TableCell>{ground || "N/A"}</TableCell>
                <TableCell>
                  {teamHome || "N/A"} vs {teamAway || "N/A"}
                </TableCell>
                <TableCell>{status || "N/A"}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/accounts/game/${id}`}>
                    <Button variant="outline">
                      <EyeIcon size="16" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
