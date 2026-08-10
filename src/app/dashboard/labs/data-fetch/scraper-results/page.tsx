"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { useFetchTestsQuery } from "@/hooks/fetch-tests/useFetchTestsQuery";
import { FetchTestsTable } from "./components/FetchTestsTable";
import { FetchTestsSummary } from "./components/FetchTestsSummary";
import { FetchTestsCharts } from "./components/FetchTestsCharts";

export default function FetchTestsPage() {
  const { data, isLoading, error } = useFetchTestsQuery();

  return (
    <>
      <CreatePageTitle
        title="Result Scraper Tests"
        byLine="Overview of all result scraper tests"
        byLineBottom="View test results, statistics, and charts"
      />
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <LoadingState
            variant="skeleton"
            message="Loading result scraper tests..."
          />
        )}

        {error && (
          <ErrorState
            variant="card"
            error={error}
            title="Error Loading Result Scraper Tests"
          />
        )}

        {!isLoading && !error && !data && (
          <EmptyState variant="card" title="No data available" />
        )}

        {!isLoading && !error && data && (
          <>
            {/* Test Runs Table */}
            <FetchTestsTable
              title="Recent Test Runs (Top 10)"
              testRuns={data.list.sort((a, b) => b.id - a.id).slice(0, 10)}
              emptyMessage="No test runs available."
            />

            {/* Summary Statistics */}
            <SectionContainer
              title="Summary Statistics"
              description="Key metrics and statistics for all result scraper tests"
            >
              <FetchTestsSummary summary={data.summary} />
            </SectionContainer>

            {/* Charts */}
            <SectionContainer
              title="Analytics Charts"
              description="Visual representation of test data and trends"
            >
              <FetchTestsCharts charts={data.charts} />
            </SectionContainer>
          </>
        )}
      </PageContainer>
    </>
  );
}
