"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, CheckCircle, XCircle } from "lucide-react";

/**
 * TrialHistory Component
 *
 * Displays detailed trial history in a table format with conversion status,
 * duration, and subscription tier information.
 *
 * @param analytics - Account analytics data
 */
export default function TrialHistory({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.trialUsage?.trialHistory) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const { trialHistory, totalTrials, trialConversionRate } =
    analytics.trialUsage;

  if (trialHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-500" />
            Trial History
          </CardTitle>
          <CardDescription>No trial history found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            This account has no trial history.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate trial duration in days
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Sort by start date (most recent first)
  const sortedHistory = [...trialHistory].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-purple-500" />
          Trial History
        </CardTitle>
        <CardDescription>
          {totalTrials} total trials • {trialConversionRate?.toFixed(1) || 0}%
          conversion rate
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedHistory.map((trial, index) => {
              const duration = calculateDays(trial.startDate, trial.endDate);
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(trial.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(trial.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{duration} days</TableCell>
                  <TableCell>{trial.subscriptionTier}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {trial.converted ? (
                        <Badge
                          variant="default"
                          className="bg-green-500 text-white flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Converted
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-400 text-white flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" />
                          Expired
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Summary Stats */}
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-300 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Trials</p>
            <p className="text-lg font-semibold">{totalTrials}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Converted</p>
            <p className="text-lg font-semibold text-green-600">
              {trialHistory.filter((t) => t.converted).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
            <p className="text-lg font-semibold text-purple-600">
              {(trialConversionRate || 0).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
