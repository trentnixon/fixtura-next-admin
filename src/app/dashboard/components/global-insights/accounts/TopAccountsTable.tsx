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
import { Clock, Trophy, TrendingUp, Eye } from "lucide-react";
import { formatDuration } from "../utils/formatters";
import Link from "next/link";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface TopAccountsTableProps {
  data: GlobalInsightsData;
}

/**
 * TopAccountsTable Component
 *
 * Displays a table of the top 5 accounts by total time taken.
 */
export default function TopAccountsTable({ data }: TopAccountsTableProps) {
  const topAccounts = data.biggestAccountsByTime || [];

  if (topAccounts.length === 0) {
    return (
      <EmptyState
        title="No account data available"
        description="Accounts with the highest total time taken across all collections"
        icon={<Trophy className="h-12 w-12 text-muted-foreground" />}
        variant="card"
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead className="text-right">Total Time</TableHead>
            <TableHead className="text-right">Avg Time</TableHead>
            <TableHead className="text-right">Collections</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topAccounts.map((account, index) => (
            <TableRow key={account.accountId}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {index === 0 && (
                    <Trophy className="w-4 h-4 text-warning-500" />
                  )}
                  <span className="font-semibold text-muted-foreground">
                    #{index + 1}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {account.accountName}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold">
                    {formatDuration(account.totalTimeTaken)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <span className="text-muted-foreground">
                  {formatDuration(account.averageTimeTaken)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="font-mono">
                  {account.collectionCount}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="primary" size="icon" asChild>
                  <Link
                    href={`/dashboard/accounts/${(
                      account.accountType || "club"
                    ).toLowerCase()}/${account.accountId}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="text-xs text-muted-foreground flex items-center gap-1">
        <TrendingUp className="w-3 h-3" />
        <span>
          These accounts account for{" "}
          {formatDuration(
            topAccounts.reduce((sum, acc) => sum + acc.totalTimeTaken, 0)
          )}{" "}
          of total collection time
        </span>
      </div>
    </div>
  );
}
