"use client";

import { use } from "react";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
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

  if (isLoading) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Test Details"
          byLine="Loading account test details..."
        />
        <div className="mt-6">
          <p>Loading account test details...</p>
        </div>
      </CreatePage>
    );
  }

  if (error) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Test Details"
          byLine="Error loading account test"
        />
        <div className="mt-6">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </CreatePage>
    );
  }

  // Check if API returned success: false
  if (data && !data.success) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Test Details"
          byLine="API Error"
        />
        <div className="mt-6">
          <p className="text-red-500">
            API Error: {data.message || "Unknown error"}
          </p>
        </div>
      </CreatePage>
    );
  }

  if (!data || !data.data) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Test Details"
          byLine="Account test not found"
        />
        <div className="mt-6">
          <p>Account test not found</p>
        </div>
      </CreatePage>
    );
  }

  const testRun = data.data;

  return (
    <CreatePage>
      <CreatePageTitle
        title={`Account Scraper Test #${testRun.id || "Unknown"}`}
        byLine={`Test executed on ${new Date(
          testRun.timestamp || Date.now()
        ).toLocaleDateString()}`}
      />

      {/* Statistics Cards */}
      <AccountTestStatsCards data={testRun} />

      {/* Discrepancies Table */}
      <AccountTestDiscrepanciesTable data={testRun} />

      {/* Performance Charts */}
      <AccountTestPerformanceCharts data={testRun} />
    </CreatePage>
  );
}
