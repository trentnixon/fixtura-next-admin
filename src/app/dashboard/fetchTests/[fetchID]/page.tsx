"use client";

import { use } from "react";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
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

  if (isLoading) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Result Scraper Test Details"
          byLine="Loading test details..."
        />
        <div className="mt-6">
          <p>Loading test details...</p>
        </div>
      </CreatePage>
    );
  }

  if (error) {
    return (
      <CreatePage>
        <CreatePageTitle
          title="Result Scraper Test Details"
          byLine="Error loading test"
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
          title="Result Scraper Test Details"
          byLine="Test not found"
        />
        <div className="mt-6">
          <p>Test not found</p>
        </div>
      </CreatePage>
    );
  }

  return (
    <CreatePage>
      <CreatePageTitle
        title={`Result Scraper Test #${data.id}`}
        byLine={`Test executed on ${new Date(
          data.timestamp
        ).toLocaleDateString()}`}
      />

      {/* Statistics Cards */}
      <TestStatsCards data={data} />

      {/* Discrepancies Table */}
      <DiscrepanciesTable data={data} />

      {/* Performance Charts */}
      <PerformanceCharts data={data} />

      {/* Error Logs */}
      {data.errorLogs && (
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold mb-2">Error Logs</h3>
            <pre className="bg-red-50 p-4 rounded text-sm overflow-auto">
              {data.errorLogs}
            </pre>
          </div>
        </div>
      )}
    </CreatePage>
  );
}
