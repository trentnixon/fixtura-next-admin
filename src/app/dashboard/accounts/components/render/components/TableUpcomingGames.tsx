"use client";

import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableUpcomingGames() {
  const { renderID } = useParams();

  // Fetch data
  const { upcomingGames, isLoading, isError, error } = useRendersQuery(
    renderID as string
  );

  // Handle loading and error states
  if (isLoading) return <p>Loading game results...</p>;
  if (isError) return <p>Error loading game results: {error?.message}</p>;

  if (!upcomingGames || upcomingGames.length === 0) {
    return <p>No upcoming games available.</p>;
  }

  return (
    <div className="p-6">
      <h4 className="mb-4 text-lg font-semibold">Upcoming Games</h4>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Published At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingGames.map(game => {
            const { id, attributes } = game;
            const { updatedAt, publishedAt } = attributes || {};
            return (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{updatedAt || "N/A"}</TableCell>
                <TableCell>{publishedAt || "N/A"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
