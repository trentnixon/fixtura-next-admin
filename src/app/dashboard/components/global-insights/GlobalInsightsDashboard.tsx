"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GlobalInsightsSection from "./GlobalInsightsSection";
import SummaryCards from "./summary/SummaryCards";
import PerformanceMetricsCards from "./performance/PerformanceMetricsCards";
import ErrorAnalysisCard from "./errors/ErrorAnalysisCard";
import TemporalAnalysisCard from "./temporal/TemporalAnalysisCard";
import TopAccountsTable from "./accounts/TopAccountsTable";
import RecentCollectionsTable from "./collections/RecentCollectionsTable";
import PerformanceOverTimeChart from "./charts/PerformanceOverTimeChart";
import ErrorsOverTimeChart from "./charts/ErrorsOverTimeChart";
import CollectionsFrequencyChart from "./charts/CollectionsFrequencyChart";

interface GlobalInsightsDashboardProps {
  data: GlobalInsightsData;
}

/**
 * GlobalInsightsDashboard Component
 *
 * Main container component that organizes all global insights components
 * into logical tabs for a comprehensive dashboard view.
 */
export default function GlobalInsightsDashboard({
  data,
}: GlobalInsightsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards - Always Visible */}
      <SummaryCards data={data} />

      {/* Tabbed Sections */}
      <Tabs defaultValue="accounts" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="temporal">Temporal</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="mt-6 space-y-6">
          <GlobalInsightsSection
            title="Performance Metrics"
            description="Time taken and memory usage metrics with statistical analysis"
          >
            <PerformanceMetricsCards data={data} />
          </GlobalInsightsSection>

          <GlobalInsightsSection
            title="Performance Over Time"
            description="Trends in time taken and memory usage across all collections"
          >
            <PerformanceOverTimeChart data={data} />
          </GlobalInsightsSection>
        </TabsContent>

        {/* Errors Tab */}
        <TabsContent value="errors" className="mt-6 space-y-6">
          <GlobalInsightsSection
            title="Error Analysis"
            description="Error rates and collections with errors across the system"
          >
            <ErrorAnalysisCard data={data} />
          </GlobalInsightsSection>

          <GlobalInsightsSection
            title="Errors Over Time"
            description="Error trends and patterns across all collections"
          >
            <ErrorsOverTimeChart data={data} />
          </GlobalInsightsSection>
        </TabsContent>

        {/* Temporal Tab */}
        <TabsContent value="temporal" className="mt-6 space-y-6">
          <GlobalInsightsSection
            title="Temporal Analysis"
            description="Collection frequency, timing patterns, and historical trends"
          >
            <TemporalAnalysisCard data={data} />
          </GlobalInsightsSection>

          <GlobalInsightsSection
            title="Collection Frequency"
            description="Daily collection frequency patterns over time"
          >
            <CollectionsFrequencyChart data={data} />
          </GlobalInsightsSection>
        </TabsContent>

        {/* Accounts Tab */}
        <TabsContent value="accounts" className="mt-6 space-y-6">
          <GlobalInsightsSection
            title="Top Accounts by Time"
            description="Accounts with the highest total time taken across all collections"
          >
            <TopAccountsTable data={data} />
          </GlobalInsightsSection>

          <GlobalInsightsSection
            title="Recent Collections"
            description="Most recent data collection activities across all accounts"
          >
            <RecentCollectionsTable data={data} />
          </GlobalInsightsSection>
        </TabsContent>
      </Tabs>
    </div>
  );
}
