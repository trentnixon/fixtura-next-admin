"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";

import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { useFetchAccountTestsQuery } from "@/hooks/fetch-account-scrape-test/useFetchAccountTestsQuery";
import { FetchAccountTestsTable } from "./components/FetchAccountTestsTable";
import { FetchAccountTestsSummary } from "./components/FetchAccountTestsSummary";
import { FetchAccountTestsCharts } from "./components/FetchAccountTestsCharts";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function FetchAccountTestsPage() {
  const { data, isLoading, error } = useFetchAccountTestsQuery();

  return (
    <>
      <CreatePageTitle
        title="Account Scraper Tests"
        byLine="Overview of all account scrape tests"
        byLineBottom="View test results, statistics, and charts"
      />
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <LoadingState
            variant="skeleton"
            message="Loading account scrape tests..."
          />
        )}

        {error && (
          <ErrorState
            variant="card"
            error={error}
            title="Error Loading Account Scraper Tests"
          />
        )}

        {!isLoading && !error && !data && (
          <EmptyState variant="card" title="No data available" />
        )}

        {!isLoading && !error && data && (
          <>
            {/* Test Runs Table */}
            <FetchAccountTestsTable
              title="Recent Account Test Runs (Top 10)"
              testRuns={data.data.list.sort((a, b) => b.id - a.id).slice(0, 10)}
              emptyMessage="No account test runs available."
            />

            {/* Summary Statistics */}
            <SectionContainer
              title="Summary Statistics"
              description="Key metrics and statistics for all account tests"
            >
              <FetchAccountTestsSummary summary={data.data.summary} />
            </SectionContainer>

            {/* Charts */}
            <SectionContainer
              title="Analytics Charts"
              description="Visual representation of account data and trends"
            >
              <FetchAccountTestsCharts charts={data.data.charts} />
            </SectionContainer>
          </>
        )}
      </PageContainer>
    </>
  );
}
