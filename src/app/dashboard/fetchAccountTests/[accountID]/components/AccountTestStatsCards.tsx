"use client";

import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { TestRun } from "@/types/fetch-account-scrape-test";
import {
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Target,
  Activity,
} from "lucide-react";

interface AccountTestStatsCardsProps {
  data: TestRun;
}

export function AccountTestStatsCards({ data }: AccountTestStatsCardsProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const validationSuccessRate = data.validation.successRate.toFixed(1);

  const scrapedItemSuccessRate =
    data.dataComparison.expectedItemCount > 0
      ? (
          (data.dataComparison.scrapedItemCount /
            data.dataComparison.expectedItemCount) *
          100
        ).toFixed(1)
      : "0";

  return (
    <MetricGrid columns={4} gap="lg">
      {/* Test Status */}
      <StatCard
        title="Test Status"
        value={data.testPassed ? "Passed" : "Failed"}
        icon={
          data.testPassed ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )
        }
        description={
          data.regressionDetected ? "Regression detected" : "No regression"
        }
        variant={data.testPassed ? "secondary" : "light"}
        className={data.testPassed ? "" : "border-error-200"}
      />

      {/* Test Duration */}
      <StatCard
        title="Duration"
        value={formatDuration(data.testDuration)}
        icon={<Clock className="h-5 w-5" />}
        description="Test execution time"
        variant="primary"
      />

      {/* Validations */}
      <StatCard
        title="Validations"
        value={`${validationSuccessRate}%`}
        icon={<Target className="h-5 w-5" />}
        description={`${data.validation.passedValidations} / ${data.validation.totalValidations} passed`}
        variant="accent"
      />

      {/* Items Scraped */}
      <StatCard
        title="Items Scraped"
        value={`${scrapedItemSuccessRate}%`}
        icon={<Database className="h-5 w-5" />}
        description={`${data.dataComparison.scrapedItemCount} / ${data.dataComparison.expectedItemCount} expected`}
        variant="light"
      />

      {/* Test Entity */}
      <StatCard
        title="Test Entity"
        value={data.testEntity}
        icon={<Activity className="h-5 w-5" />}
        description={`ID: ${data.testEntityId}`}
        variant="light"
      />

      {/* Scraper Type */}
      <StatCard
        title="Scraper Type"
        value={data.scraperType}
        icon={<Database className="h-5 w-5" />}
        description={`${data.environment} environment`}
        variant="light"
      />

      {/* Environment */}
      <StatCard
        title="Environment"
        value={data.environment}
        icon={<Activity className="h-5 w-5" />}
        description="Test environment"
        variant="light"
      />

      {/* Test Initiator */}
      <StatCard
        title="Initiator"
        value={data.testInitiator}
        icon={<Activity className="h-5 w-5" />}
        description="Test trigger source"
        variant="light"
      />
    </MetricGrid>
  );
}
