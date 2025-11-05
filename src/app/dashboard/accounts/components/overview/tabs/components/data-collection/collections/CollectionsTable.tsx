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
import { Clock, Database } from "lucide-react";
import { formatDate, formatRelativeTime } from "../utils/formatters";
import { H3 } from "@/components/type/titles";
import { P } from "@/components/type/type";
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

  // Get status badge variant based on days since last collection
  const getStatusBadgeVariant = (
    days: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (days <= 1) return "default";
    if (days <= 7) return "default";
    if (days <= 30) return "secondary";
    return "destructive";
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
    <div className="">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <H3 className="text-lg font-semibold">Data Collection</H3>
        </div>
        <P className="text-sm text-muted-foreground">
          Complete list of all data collections for this account, sorted by most
          recent first.
        </P>
      </div>
      <div className="px-6 pb-2 space-y-2">
        {/* Sync Button Section */}
        <div className="pb-0">
          <div className="flex items-center justify-end">
            <AccountSyncButton
              accountId={accountId}
              accountType={accountType}
            />
          </div>
        </div>

        {/* Table Section */}
        {sortedCollections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No collections found for this account.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="max-h-[400px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">
                      Last Collection Date
                    </TableHead>
                    <TableHead className="text-center">Relative Time</TableHead>
                    <TableHead className="text-center">Days Since</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="w-[100px] text-center">
                      Actions
                    </TableHead>
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
                        {formatRelativeTime(
                          collection.whenWasTheLastCollection
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">
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
                          variant={getStatusBadgeVariant(
                            collection.daysSinceLastCollection
                          )}
                          className="text-xs"
                        >
                          {getStatusLabel(collection.daysSinceLastCollection)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/data/${collection.id}`}>
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
        {sortedCollections.length > 0 && (
          <div className="mt-4 text-xs text-muted-foreground text-center">
            Showing {sortedCollections.length} collection
            {sortedCollections.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
