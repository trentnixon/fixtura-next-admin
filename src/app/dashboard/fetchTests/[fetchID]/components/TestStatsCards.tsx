"use client";

import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { ByIDResponse } from "@/types/fetch-test";
import {
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  AlertTriangle,
  Database,
  Cpu,
  MemoryStick,
  Server,
} from "lucide-react";
import { formatDuration, formatMemory } from "@/utils/chart-formatters";

interface TestStatsCardsProps {
  data: ByIDResponse;
}

export function TestStatsCards({ data }: TestStatsCardsProps) {
  const successRate =
    data.totalTests > 0
      ? ((data.passedTests / data.totalTests) * 100).toFixed(1)
      : "0";

  const memoryPeak = data.performanceMetrics.systemMetrics.memoryPeak;
  const totalDiscrepancies = data.detailedResults.reduce(
    (acc, result) => acc + result.discrepancies.length,
    0
  );

  const cpuTimeSeconds =
    (data.performanceMetrics.systemMetrics.cpuUsage.user +
      data.performanceMetrics.systemMetrics.cpuUsage.system) /
    1000000;

  return (
    <MetricGrid columns={4} gap="lg">
      {/* Test Results */}
      <StatCard
        title="Test Results"
        value={data.totalTests}
        icon={<Activity className="h-5 w-5" />}
        description={`${data.passedTests} passed, ${data.failedTests} failed`}
        variant="primary"
      />

      {/* Success Rate */}
      <StatCard
        title="Success Rate"
        value={`${successRate}%`}
        icon={
          data.failedTests === 0 ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )
        }
        description={
          data.failedTests === 0
            ? "All tests passed"
            : `${data.failedTests} test(s) failed`
        }
        variant={data.failedTests === 0 ? "secondary" : "light"}
        className={data.failedTests === 0 ? "" : "border-error-200"}
      />

      {/* Duration */}
      <StatCard
        title="Duration"
        value={formatDuration(data.testDuration, "milliseconds")}
        icon={<Clock className="h-5 w-5" />}
        description="Total execution time"
        variant="accent"
      />

      {/* Memory Peak */}
      <StatCard
        title="Memory Peak"
        value={formatMemory(memoryPeak, "mb")}
        icon={<MemoryStick className="h-5 w-5" />}
        description="Peak memory usage"
        variant="light"
      />

      {/* CPU Usage */}
      <StatCard
        title="CPU Usage"
        value={`${cpuTimeSeconds.toFixed(2)}s`}
        icon={<Cpu className="h-5 w-5" />}
        description="User + System time"
        variant="light"
      />

      {/* Discrepancies */}
      <StatCard
        title="Discrepancies"
        value={totalDiscrepancies}
        icon={<AlertTriangle className="h-5 w-5" />}
        description="Total discrepancies found"
        variant="light"
      />

      {/* Extraction Rate */}
      <StatCard
        title="Extraction Rate"
        value={`${(data.dataQualityMetrics.extractionSuccessRate * 100).toFixed(
          1
        )}%`}
        icon={<Database className="h-5 w-5" />}
        description="Data extraction success"
        variant="light"
      />

      {/* Environment */}
      <StatCard
        title="Environment"
        value={
          data.environment.charAt(0).toUpperCase() + data.environment.slice(1)
        }
        icon={<Server className="h-5 w-5" />}
        description={data.testInitiator}
        variant="light"
      />
    </MetricGrid>
  );
}
