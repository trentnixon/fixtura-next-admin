"use client";

import { use } from "react";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { useFetchAccountTestByIdQuery } from "@/hooks/fetch-account-scrape-test/useFetchAccountTestByIdQuery";
import { AccountTestStatsCards } from "./components/AccountTestStatsCards";
import { AccountTestDiscrepanciesTable } from "./components/AccountTestDiscrepanciesTable";
import { AccountTestPerformanceCharts } from "./components/AccountTestPerformanceCharts";

interface FetchAccountTestPageProps {
  params: Promise<{
    accountID: string;
  }>;
}

export default function FetchAccountTestPage({
  params,
}: FetchAccountTestPageProps) {
  const { accountID } = use(params);
  const { data, isLoading, error } = useFetchAccountTestByIdQuery(accountID);

  // Check if API returned success: false
  const apiError =
    data && !data.success ? data.message || "Unknown error" : null;
  const testRun = data?.success ? data.data : null;

  return (
    <>
      <CreatePageTitle
        title={
          testRun
            ? `Account Scraper Test #${testRun.id || "Unknown"}`
            : "Account Scraper Test Details"
        }
        byLine={
          testRun
            ? `Test executed on ${new Date(
                testRun.timestamp || Date.now()
              ).toLocaleDateString()}`
            : isLoading
            ? "Loading account test details..."
            : error || apiError
            ? "Error loading account test"
            : "Account test not found"
        }
      />
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <LoadingState
            variant="skeleton"
            message="Loading account test details..."
          />
        )}

        {error && (
          <ErrorState
            variant="card"
            error={error}
            title="Error Loading Account Test"
          />
        )}

        {!isLoading && !error && apiError && (
          <ErrorState
            variant="card"
            error={new Error(apiError)}
            title="API Error"
          />
        )}

        {!isLoading && !error && !apiError && !testRun && (
          <EmptyState variant="card" title="Account test not found" />
        )}

        {!isLoading && !error && !apiError && testRun && (
          <>
            {/* Statistics Cards */}
            <AccountTestStatsCards data={testRun} />

            {/* Discrepancies Table */}
            <AccountTestDiscrepanciesTable data={testRun} />

            {/* Performance Charts */}
            <AccountTestPerformanceCharts data={testRun} />
          </>
        )}
      </PageContainer>
    </>
  );
}
