"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
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
import {
  Database,
  Clock,
  MemoryStick,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { formatDuration, formatMemory, formatDate } from "../utils/formatters";
import Link from "next/link";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface RecentCollectionsTableProps {
  data: GlobalInsightsData;
}

/**
 * RecentCollectionsTable Component
 *
 * Displays a table of the 5 most recent collections.
 */
export default function RecentCollectionsTable({
  data,
}: RecentCollectionsTableProps) {
  const recentCollections = data.recentCollections || [];

  if (recentCollections.length === 0) {
    return (
      <EmptyState
        title="No recent collections found"
        description="Most recent data collection activities across all accounts"
        icon={<Database className="h-12 w-12 text-muted-foreground" />}
        variant="card"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Collection Date</TableHead>
            <TableHead className="text-right">Time Taken</TableHead>
            <TableHead className="text-right">Memory</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentCollections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="font-medium">
                {collection.accountName}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {formatDate(collection.whenWasTheLastCollection)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">
                    {formatDuration(collection.timeTaken)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <MemoryStick className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm">
                    {formatMemory(collection.memoryUsage)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {collection.hasError ? (
                    <Badge variant="destructive" className="text-xs">
                      <AlertCircle className="w-3 h-3 mr-1 text-error-500" />
                      Error
                    </Badge>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1 text-success-500" />
                      OK
                    </Badge>
                  )}
                  {collection.isIncomplete && (
                    <Badge variant="secondary" className="text-xs">
                      <XCircle className="w-3 h-3 mr-1 text-warning-500" />
                      Incomplete
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="primary" size="icon" asChild>
                  <Link
                    href={`/dashboard/accounts/${(
                      collection.accountType || "club"
                    ).toLowerCase()}/${collection.accountId}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
