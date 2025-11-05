"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Trophy, TrendingUp } from "lucide-react";
import { formatDuration } from "../utils/formatters";
import Link from "next/link";

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
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg font-semibold">
              Top Accounts by Time
            </CardTitle>
          </div>
          <CardDescription>
            Accounts with the highest total time taken across all collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No account data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-lg font-semibold">
            Top Accounts by Time
          </CardTitle>
        </div>
        <CardDescription>
          Top {topAccounts.length} accounts with the highest total time taken
          across all collections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="text-right">Total Time</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
                <TableHead className="text-right">Collections</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAccounts.map((account, index) => (
                <TableRow key={account.accountId}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Trophy className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-semibold text-muted-foreground">
                        #{index + 1}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/accounts/${account.accountId}`}
                      className="hover:underline text-blue-600 hover:text-blue-800"
                    >
                      {account.accountName}
                    </Link>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          <span>
            These accounts account for{" "}
            {formatDuration(
              topAccounts.reduce((sum, acc) => sum + acc.totalTimeTaken, 0)
            )}{" "}
            of total collection time
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
