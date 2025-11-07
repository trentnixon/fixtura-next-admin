"use client";

import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { TestSummary } from "@/types/fetch-account-scrape-test";
import {
  CheckCircle,
  Clock,
  Activity,
  AlertTriangle,
  Database,
} from "lucide-react";

interface FetchAccountTestsSummaryProps {
  summary: TestSummary;
}

export function FetchAccountTestsSummary({
  summary,
}: FetchAccountTestsSummaryProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const successRate =
    summary.totalRuns > 0
      ? ((summary.totalPassed / summary.totalRuns) * 100).toFixed(1)
      : "0";

  const validationSuccessRate =
    summary.totalValidations > 0
      ? (
          (summary.totalPassedValidations / summary.totalValidations) *
          100
        ).toFixed(1)
      : "0";

  return (
    <MetricGrid columns={4} gap="lg">
      {/* Total Tests */}
      <StatCard
        title="Total Tests"
        value={summary.totalTests}
        icon={<Activity className="h-5 w-5" />}
        description={`${summary.totalRuns} total runs`}
        variant="primary"
      />

      {/* Success Rate */}
      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${summary.totalPassed} passed, ${summary.totalFailed} failed`}
        variant="secondary"
      />

      {/* Validation Success Rate */}
      <StatCard
        title="Validation Success"
        value={`${validationSuccessRate}%`}
        icon={<Database className="h-5 w-5" />}
        description={`${summary.totalPassedValidations} / ${summary.totalValidations} validations`}
        variant="accent"
      />

      {/* Average Duration */}
      <StatCard
        title="Avg Duration"
        value={formatDuration(summary.averageDuration)}
        icon={<Clock className="h-5 w-5" />}
        description={`Total: ${formatDuration(summary.totalDuration)}`}
        variant="light"
      />

      {/* Regression Count */}
      <StatCard
        title="Regressions"
        value={summary.regressionCount}
        icon={<AlertTriangle className="h-5 w-5" />}
        description="Detected regressions"
        variant="light"
      />

      {/* Scraped Items */}
      <StatCard
        title="Items Scraped"
        value={summary.totalScrapedItems.toLocaleString()}
        icon={<Database className="h-5 w-5" />}
        description={`Expected: ${summary.totalExpectedItems.toLocaleString()}`}
        variant="light"
      />
    </MetricGrid>
  );
}
