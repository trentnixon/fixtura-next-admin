"use client";

import { use } from "react";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { useFetchTestByIdQuery } from "@/hooks/fetch-tests/useFetchTestByIdQuery";
import { TestStatsCards } from "./components/TestStatsCards";
import { DiscrepanciesTable } from "./components/DiscrepanciesTable";
import { PerformanceCharts } from "./components/PerformanceCharts";

interface FetchTestPageProps {
  params: Promise<{
    fetchID: string;
  }>;
}

export default function FetchTestPage({ params }: FetchTestPageProps) {
  const { fetchID } = use(params);
  const { data, isLoading, error } = useFetchTestByIdQuery(fetchID);

  return (
    <>
      <CreatePageTitle
        title={
          data
            ? `Result Scraper Test #${data.id}`
            : "Result Scraper Test Details"
        }
        byLine={
          data
            ? `Test executed on ${new Date(
                data.timestamp
              ).toLocaleDateString()}`
            : isLoading
            ? "Loading test details..."
            : error
            ? "Error loading test"
            : "Test not found"
        }
      />
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <LoadingState variant="skeleton" message="Loading test details..." />
        )}

        {error && (
          <ErrorState
            variant="card"
            error={error}
            title="Error Loading Result Scraper Test"
          />
        )}

        {!isLoading && !error && !data && (
          <EmptyState variant="card" title="Test not found" />
        )}

        {!isLoading && !error && data && (
          <>
            {/* Statistics Cards */}
            <SectionContainer
              title="Statistics"
              description="Key metrics and statistics for the test"
            >
              <TestStatsCards data={data} />
            </SectionContainer>

            {/* Discrepancies Table */}
            <SectionContainer
              title="Discrepancies"
              description="Discrepancies between the expected and actual results"
            >
              <DiscrepanciesTable data={data} />
            </SectionContainer>

            {/* Performance Charts */}
            <SectionContainer
              title="Performance Charts"
              description="Performance charts for the test"
            >
              <PerformanceCharts data={data} />
            </SectionContainer>

            {/* Error Logs */}
            {data.errorLogs && (
              <SectionContainer
                title="Error Logs"
                description="Error logs from the test execution"
                variant="compact"
              >
                <ElementContainer variant="dark" border padding="md">
                  <pre className="bg-error-50 text-error-900 p-4 rounded text-sm overflow-auto font-mono whitespace-pre-wrap break-words">
                    {data.errorLogs}
                  </pre>
                </ElementContainer>
              </SectionContainer>
            )}
          </>
        )}
      </PageContainer>
    </>
  );
}
