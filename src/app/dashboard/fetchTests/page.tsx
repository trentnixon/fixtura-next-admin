"use client";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { useFetchTestsQuery } from "@/hooks/fetch-tests/useFetchTestsQuery";
import { FetchTestsTable } from "./components/FetchTestsTable";
import { FetchTestsSummary } from "./components/FetchTestsSummary";
import { FetchTestsCharts } from "./components/FetchTestsCharts";

export default function FetchTestsPage() {
  const { data, isLoading, error } = useFetchTestsQuery();

  if (isLoading) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Result Scraper Tests"
          byLine="Result Scraper Tests"
        />
        <div className="mt-6">
          <p>Loading fetch tests...</p>
        </div>
      </CreatePage>
    );
  }

  if (error) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Result Scraper Tests"
          byLine="Result Scraper Tests"
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
          title="Result Scraper Tests"
          byLine="Result Scraper Tests"
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
        title="Result Scraper Tests"
        byLine="Result Scraper Tests"
      />

      {/* Test Runs Table */}
      <FetchTestsTable
        title="Recent Test Runs (Top 10)"
        testRuns={data.list.sort((a, b) => b.id - a.id).slice(0, 10)}
        emptyMessage="No test runs available."
      />

      {/* Summary Statistics */}
      <FetchTestsSummary summary={data.summary} />

      {/* Charts */}
      <FetchTestsCharts charts={data.charts} />
    </CreatePage>
  );
}
