/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useFetchGamesCricket } from "@/hooks/games/useFetchGamesCricket";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

export default function TableGamesResults() {
  const { renderID } = useParams();

  // Fetch render details, including game IDs
  const {
    gameResults: gameIDs,
    isLoading: isRenderLoading,
    isError: isRenderError,
    error: renderError,
  } = useRendersQuery(renderID as string);

  // Use the game IDs to fetch detailed game data
  console.log("[gameIDs]", gameIDs);
  const {
    data: gameData,
    isLoading: isGameLoading,
    isError: isGameError,
    error: gameError,
  } = useFetchGamesCricket(gameIDs);

  // Handle loading and error states for render
  if (isRenderLoading) return <p>Loading render details...</p>;
  if (isRenderError) return <p>Error loading render: {renderError?.message}</p>;

  // Handle loading and error states for games
  if (isGameLoading) return <p>Loading games...</p>;
  if (isGameError)
    return <p>Error loading games: {(gameError as Error)?.message}</p>;

  // Check for game data
  if (!gameData || gameData.length === 0) {
    return <p>No games available.</p>;
  }

  console.log(gameData);

  return (
    <div className="p-6">
      <h4 className="mb-4 text-lg font-semibold">Games</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Grade Name</TableHead>
            <TableHead>Ground</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameData.map((game: any) => {
            const { id, attributes } = game;

            if (!attributes) return null; // Safeguard for missing attributes

            const { grade, ground, teamHome, teamAway, status } = attributes;

            // Extract gradeName safely
            const gradeName = grade?.data?.gradeName || "N/A";

            return (
              <TableRow key={id}>
                <TableCell>{gradeName}</TableCell>
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
