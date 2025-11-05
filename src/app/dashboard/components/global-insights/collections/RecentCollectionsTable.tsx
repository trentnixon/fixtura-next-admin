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
import {
  Database,
  Clock,
  MemoryStick,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatDuration, formatMemory, formatDate } from "../utils/formatters";
import Link from "next/link";

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
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg font-semibold">
              Recent Collections
            </CardTitle>
          </div>
          <CardDescription>
            Most recent data collection activities across all accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recent collections found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold">
            Recent Collections
          </CardTitle>
        </div>
        <CardDescription>
          {recentCollections.length} most recent data collection activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Collection Date</TableHead>
                <TableHead className="text-right">Time Taken</TableHead>
                <TableHead className="text-right">Memory</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentCollections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/dashboard/accounts/${collection.accountId}`}
                      className="hover:underline text-blue-600 hover:text-blue-800"
                    >
                      {collection.accountName}
                    </Link>
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
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Error
                        </Badge>
                      ) : (
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          OK
                        </Badge>
                      )}
                      {collection.isIncomplete && (
                        <Badge variant="secondary" className="text-xs">
                          <XCircle className="w-3 h-3 mr-1" />
                          Incomplete
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
