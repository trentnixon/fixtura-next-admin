"use client";

import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { useFetchAccountTestsQuery } from "@/hooks/fetch-account-scrape-test/useFetchAccountTestsQuery";
import { FetchAccountTestsTable } from "./components/FetchAccountTestsTable";
import { FetchAccountTestsSummary } from "./components/FetchAccountTestsSummary";
import { FetchAccountTestsCharts } from "./components/FetchAccountTestsCharts";

export default function FetchAccountTestsPage() {
  const { data, isLoading, error } = useFetchAccountTestsQuery();

  if (isLoading) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Tests"
          byLine="Account Scraper Tests"
        />
        <div className="mt-6">
          <p>Loading account scrape tests...</p>
        </div>
      </CreatePage>
    );
  }

  if (error) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Tests"
          byLine="Account Scraper Tests"
        />
        <div className="mt-6">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      </CreatePage>
    );
  }

  if (!data) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Account Scraper Tests"
          byLine="Account Scraper Tests"
        />
        <div className="mt-6">
          <p>No data available</p>
        </div>
      </CreatePage>
    );
  }

  return (
    <CreatePage>
      <CreatePageTitle
        title="Account Scraper Tests"
        byLine="Account Scraper Tests"
      />

      {/* Test Runs Table */}
      <FetchAccountTestsTable
        title="Recent Account Test Runs (Top 10)"
        testRuns={data.data.list.sort((a, b) => b.id - a.id).slice(0, 10)}
        emptyMessage="No account test runs available."
      />

      {/* Summary Statistics */}
      <FetchAccountTestsSummary summary={data.data.summary} />

      {/* Charts */}
      <FetchAccountTestsCharts charts={data.data.charts} />
    </CreatePage>
  );
}
