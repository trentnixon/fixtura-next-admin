/* eslint-disable @typescript-eslint/no-explicit-any */
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
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

export default function TableUpcomingGames() {
  const { renderID } = useParams();

  // Fetch data
  const {
    upcomingGames,
    isLoading,
    isError,
    error,
    refetch: refetchRender,
  } = useRendersQuery(renderID as string);

  // UI: Loading State
  if (isLoading) {
    return <LoadingState message="Loading upcoming games…" />;
  }

  // UI: Error State
  if (isError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load upcoming games"
        error={error}
        onRetry={() => refetchRender()}
      />
    );
  }

  // UI: Empty State - No upcoming games
  if (!upcomingGames || upcomingGames.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No upcoming games available"
        description="No upcoming games found for this render."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Published At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {upcomingGames.map((game: any) => {
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
