"use client";

import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { TestReport } from "@/types/fetch-test";
import { CheckCircle, XCircle, Clock, Activity } from "lucide-react";

interface FetchTestsSummaryProps {
  summary: TestReport["summary"];
}

export function FetchTestsSummary({ summary }: FetchTestsSummaryProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const successRate =
    summary.totalRuns > 0
      ? ((summary.totalPassed / summary.totalRuns) * 100).toFixed(1)
      : "0";

  const failureRate =
    summary.totalRuns > 0
      ? ((summary.totalFailed / summary.totalRuns) * 100).toFixed(1)
      : "0";

  return (
    <MetricGrid columns={4} gap="lg">
      {/* Total Runs */}
      <StatCard
        title="Total Runs"
        value={summary.totalRuns}
        icon={<Activity className="h-5 w-5" />}
        description="Test executions"
        variant="primary"
      />

      {/* Passed Tests */}
      <StatCard
        title="Passed Tests"
        value={summary.totalPassed}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${successRate}% success rate`}
        variant="secondary"
      />

      {/* Failed Tests */}
      <StatCard
        title="Failed Tests"
        value={summary.totalFailed}
        icon={<XCircle className="h-5 w-5" />}
        description={`${failureRate}% failure rate`}
        variant="accent"
      />

      {/* Average Duration */}
      <StatCard
        title="Avg Duration"
        value={formatDuration(summary.averageDuration)}
        icon={<Clock className="h-5 w-5" />}
        description="Per test run"
        variant="light"
      />
    </MetricGrid>
  );
}
