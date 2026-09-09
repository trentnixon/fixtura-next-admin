"use client";

import { AccountAnalytics } from "@/types/analytics";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, EmptyState } from "@/components/ui-library";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  calculateTrialDays,
  getTrialSummaryMetrics,
} from "../../trialSummaryMetrics";

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
  if (!analytics?.trialUsage) {
    return (
      <LoadingState variant="skeleton" message="Loading trial history...">
        <SectionContainer title="Trial History" variant="compact">
          <div className="h-32" />
        </SectionContainer>
      </LoadingState>
    );
  }

  const metrics = getTrialSummaryMetrics(analytics);

  if (metrics.allTrials.length === 0) {
    return (
      <SectionContainer
        title="Trial History"
        description="No trial history found"
        variant="compact"
      >
        <EmptyState
          title="No trial history"
          description="This account has no trial history."
          variant="minimal"
        />
      </SectionContainer>
    );
  }

  const sortedHistory = [...metrics.allTrials].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <SectionContainer
      title="Trial History"
      description={`${metrics.totalTrials} total trial${
        metrics.totalTrials === 1 ? "" : "s"
      } • ${metrics.conversionRate.toFixed(1)}% conversion rate`}
      variant="compact"
    >
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
            const duration = calculateTrialDays(trial.startDate, trial.endDate);

            return (
              <TableRow key={`${trial.startDate}-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(trial.startDate)}
                </TableCell>
                <TableCell>{formatDate(trial.endDate)}</TableCell>
                <TableCell>{duration} days</TableCell>
                <TableCell>{trial.subscriptionTier}</TableCell>
                <TableCell>
                  {trial.isActive ? (
                    <Badge className="flex items-center gap-1 rounded-full border-0 bg-success-500 text-white">
                      <CheckCircle className="h-3 w-3" />
                      Active
                    </Badge>
                  ) : trial.converted ? (
                    <Badge className="flex items-center gap-1 rounded-full border-0 bg-success-500 text-white">
                      <CheckCircle className="h-3 w-3" />
                      Converted
                    </Badge>
                  ) : (
                    <Badge className="flex items-center gap-1 rounded-full border-0 bg-slate-500 text-white">
                      <XCircle className="h-3 w-3" />
                      Expired
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </SectionContainer>
  );
}
