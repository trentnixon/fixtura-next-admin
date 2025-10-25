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

export default function TableGamesResults() {
  const { renderID } = useParams();

  // Fetch game fixtures directly using render ID
  const {
    data: gameData,
    isLoading: isGameLoading,
    isError: isGameError,
    error: gameError,
  } = useFetchGamesCricket(renderID as string);

  // Handle loading and error states for games
  if (isGameLoading) return <p>Loading games...</p>;
  if (isGameError)
    return <p>Error loading games: {(gameError as Error)?.message}</p>;

  // Debug game data
  console.log("[gameData]", gameData);
  console.log("[gameData length]", gameData?.length);
  console.log("[gameData type]", typeof gameData);
  console.log("[gameData isArray]", Array.isArray(gameData));

  // Check for game data
  if (!gameData || !Array.isArray(gameData) || gameData.length === 0) {
    return (
      <div className="p-6">
        <h4 className="mb-4 text-lg font-semibold">Games</h4>
        <p>No games available.</p>
        <div className="mt-4 text-sm text-gray-500">
          <p>Debug info:</p>
          <p>renderID: {renderID}</p>
          <p>gameData: {JSON.stringify(gameData)}</p>
          <p>isGameLoading: {isGameLoading.toString()}</p>
          <p>isGameError: {isGameError.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h4 className="mb-4 text-lg font-semibold">Games</h4>
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
