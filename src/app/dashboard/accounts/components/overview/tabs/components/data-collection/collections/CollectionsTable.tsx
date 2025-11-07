"use client";

import Link from "next/link";
import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { formatDate, formatRelativeTime } from "../utils/formatters";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";
import { ScrollArea } from "@/components/ui/scroll-area";
import AccountSyncButton from "../../AccountSyncButton";

interface CollectionsTableProps {
  data: AccountStatsResponse;
  accountId: number;
  accountType: "CLUB" | "ASSOCIATION";
}

/**
 * CollectionsTable Component
 *
 * Displays a table of all collections for the account, showing:
 * - Collection ID
 * - Last Collection Date (formatted)
 * - Days Since Last Collection
 * Also includes a sync button section above the table
 */
export default function CollectionsTable({
  data,
  accountId,
  accountType,
}: CollectionsTableProps) {
  const collections = data.data.collections || [];

  // Sort collections by date (most recent first)
  const sortedCollections = [...collections].sort((a, b) => {
    const dateA = new Date(a.whenWasTheLastCollection).getTime();
    const dateB = new Date(b.whenWasTheLastCollection).getTime();
    return dateB - dateA;
  });

  // Get status badge color based on days since last collection
  const getStatusBadgeColor = (days: number): string => {
    if (days <= 1) return "bg-success-500";
    if (days <= 7) return "bg-success-500";
    if (days <= 30) return "bg-warning-500";
    return "bg-error-500";
  };

  // Get status label
  const getStatusLabel = (days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days <= 7) return "Recent";
    if (days <= 30) return "Stale";
    return "Very Stale";
  };

  return (
    <SectionContainer
      title="Data Collection"
      description={`Complete list of all data collections for this account, sorted by most recent first. ${
        sortedCollections.length > 0
          ? `Showing ${sortedCollections.length} collection${
              sortedCollections.length !== 1 ? "s" : ""
            }.`
          : ""
      }`}
      variant="compact"
      action={
        <AccountSyncButton
          accountId={accountId}
          accountType={accountType}
          variant="accent"
        />
      }
    >
      {sortedCollections.length === 0 ? (
        <EmptyState
          title="No collections found"
          description="This account has no data collections yet."
          variant="minimal"
        />
      ) : (
        <ScrollArea className="h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  Last Collection Date
                </TableHead>
                <TableHead className="text-center">Relative Time</TableHead>
                <TableHead className="text-center">Days Since</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[100px] text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formatDate(collection.whenWasTheLastCollection, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm text-muted-foreground">
                    {formatRelativeTime(collection.whenWasTheLastCollection)}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {collection.daysSinceLastCollection === 0
                      ? "Today"
                      : `${collection.daysSinceLastCollection} ${
                          collection.daysSinceLastCollection === 1
                            ? "day"
                            : "days"
                        }`}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`${getStatusBadgeColor(
                        collection.daysSinceLastCollection
                      )} text-white border-0 rounded-full text-xs`}
                    >
                      {getStatusLabel(collection.daysSinceLastCollection)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="primary" asChild>
                      <Link href={`/dashboard/data/${collection.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      )}
    </SectionContainer>
  );
}
