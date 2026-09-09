"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  CompactKpiCard,
  ComparisonCard,
  OperationalStatusCard,
} from "@/components/ui-library/cards";
import { Percent, Target } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { getTrialSummaryMetrics } from "../../trialSummaryMetrics";

type TrialSummaryCardsProps = {
  analytics: AccountAnalytics;
};

export default function TrialSummaryCards({ analytics }: TrialSummaryCardsProps) {
  const metrics = getTrialSummaryMetrics(analytics);
  const StatusIcon = metrics.status.icon;

  const latestTrial = metrics.currentTrial;
  const periodLabel =
    latestTrial && metrics.durationDays != null
      ? `${formatDate(latestTrial.startDate)} – ${formatDate(latestTrial.endDate)} · ${metrics.durationDays} day${metrics.durationDays === 1 ? "" : "s"}`
      : "—";

  return (
    <div
      className={
        latestTrial
          ? "grid grid-cols-1 gap-4 md:grid-cols-3"
          : "grid grid-cols-1 gap-4 md:grid-cols-2"
      }
    >
      <CompactKpiCard
        value={`${metrics.conversionRate.toFixed(1)}%`}
        label="Conversion rate"
        icon={<Percent className="h-4 w-4" />}
        iconClassName="bg-indigo-50 text-indigo-700"
        progressClassName="bg-indigo-500"
        progressPercent={metrics.conversionRate}
      />

      <ComparisonCard
        title="Trial outcomes"
        description={`${metrics.totalTrials} total trial${metrics.totalTrials === 1 ? "" : "s"}`}
        icon={<Target className="h-4 w-4" />}
        rows={[
          {
            label: "Converted",
            value: String(metrics.convertedCount),
            tone: "text-emerald-700",
          },
          {
            label: "Not converted",
            value: String(metrics.notConvertedCount),
            tone:
              metrics.notConvertedCount > 0
                ? "text-amber-700"
                : "text-slate-600",
          },
        ]}
      />

      {latestTrial ? (
        <OperationalStatusCard
          title="Latest trial"
          description={`${metrics.status.text} · ${latestTrial.subscriptionTier}`}
          icon={<StatusIcon className="h-4 w-4" />}
          footerLabel="Period"
          footerValue={periodLabel}
          status={metrics.status.tone}
        />
      ) : null}
    </div>
  );
}
