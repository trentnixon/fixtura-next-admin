"use client";

import { AccountAnalytics } from "@/types/analytics";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
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
import { Label, H4 } from "@/components/type/titles";
import { CheckCircle, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

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

  const { trialInstance, trialHistory } = analytics.trialUsage;
  const orders = analytics?.orderHistory?.orders || [];

  // Calculate trial duration in days
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Determine if a trial was converted by checking if there are paid orders after the trial end date
  const checkTrialConversion = (trialEndDate: string) => {
    const trialEnd = new Date(trialEndDate);
    // Check if there's a paid Season Pass order after the trial ended
    const paidOrdersAfterTrial = orders.filter((order) => {
      if (!order.date) return false;
      const orderDate = new Date(order.date);
      if (isNaN(orderDate.getTime())) return false;

      // Check if order is paid
      const status = String(order.status || "").toLowerCase();
      const isPaid = status === "paid" || status === "true";

      // Check if it's a Season Pass or subscription order (not a trial)
      const tier = order.subscriptionTier?.toLowerCase() || "";
      const isSeasonPass =
        tier.includes("season pass") ||
        tier.includes("3 month pass") ||
        tier.includes("month pass") ||
        (tier.includes("pass") &&
          !tier.includes("trial") &&
          !tier.includes("free"));

      return isPaid && isSeasonPass && orderDate > trialEnd;
    });
    return paidOrdersAfterTrial.length > 0;
  };

  // Combine trialInstance (active trial) with trialHistory (historical trials)
  // Convert trialInstance to TrialEvent format for display
  const allTrials = [];

  // Add active trial if it exists
  if (trialInstance) {
    // Check if trial is actually still active based on endDate
    const trialEndDate = new Date(trialInstance.endDate);
    const now = new Date();
    const isActuallyActive = trialInstance.isActive && trialEndDate > now;

    // Check conversion status - only check if trial has ended
    const isConverted =
      !isActuallyActive && checkTrialConversion(trialInstance.endDate);

    allTrials.push({
      startDate: trialInstance.startDate,
      endDate: trialInstance.endDate,
      subscriptionTier: trialInstance.subscriptionTier,
      converted: isConverted,
      isActive: isActuallyActive,
    });
  }

  // Add historical trials
  if (trialHistory && Array.isArray(trialHistory)) {
    trialHistory.forEach((trial) => {
      // Check conversion status - use API value or infer from orders
      const isConverted =
        trial.converted || checkTrialConversion(trial.endDate);

      allTrials.push({
        ...trial,
        converted: isConverted,
        isActive: false,
      });
    });
  }

  // Calculate actual totals from combined data
  const actualTotalTrials = allTrials.length;
  const actualConvertedCount = allTrials.filter((t) => t.converted).length;
  const actualConversionRate =
    actualTotalTrials > 0
      ? (actualConvertedCount / actualTotalTrials) * 100
      : 0;

  // Only show empty state if there are no trials at all
  if (allTrials.length === 0) {
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

  // Sort by start date (most recent first)
  const sortedHistory = [...allTrials].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <SectionContainer
      title="Trial History"
      description={`${actualTotalTrials} total trials • ${actualConversionRate.toFixed(
        1
      )}% conversion rate`}
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
            const duration = calculateDays(trial.startDate, trial.endDate);
            return (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatDate(trial.startDate)}
                </TableCell>
                <TableCell>{formatDate(trial.endDate)}</TableCell>
                <TableCell>{duration} days</TableCell>
                <TableCell>{trial.subscriptionTier}</TableCell>
                <TableCell>
                  {trial.isActive ? (
                    <Badge className="bg-success-500 text-white border-0 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </Badge>
                  ) : trial.converted ? (
                    <Badge className="bg-success-500 text-white border-0 rounded-full flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Converted
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500 text-white border-0 rounded-full flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Expired
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Summary Stats */}
      <ElementContainer variant="dark" border padding="md" className="mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <Label className="text-sm m-0">Total Trials</Label>
            <H4 className="text-lg font-semibold m-0">{actualTotalTrials}</H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Converted</Label>
            <H4 className="text-lg font-semibold m-0 text-success-600">
              {actualConvertedCount}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Conversion Rate</Label>
            <H4 className="text-lg font-semibold m-0 text-purple-600">
              {actualConversionRate.toFixed(1)}%
            </H4>
          </div>
        </div>
      </ElementContainer>
    </SectionContainer>
  );
}
