"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import DataCollectionSection from "./DataCollectionSection";
import AccountHealthCard from "./health/AccountHealthCard";
import SummaryCards from "./summary/SummaryCards";
import ErrorAnalysisCard from "./errors/ErrorAnalysisCard";
import ErrorRateByEntityChart from "./errors/ErrorRateByEntityChart";
import EntityStatisticsTable from "./entities/EntityStatisticsTable";
import PerformanceMetricsCards from "./performance/PerformanceMetricsCards";
import PerformanceOverTimeChart from "./performance/PerformanceOverTimeChart";
import PerformanceDistributionChart from "./performance/PerformanceDistributionChart";
import StageAnalysisCard from "./stages/StageAnalysisCard";
import StageDistributionChart from "./stages/StageDistributionChart";
import TemporalAnalysisCard from "./temporal/TemporalAnalysisCard";
import CollectionsOverTimeChart from "./charts/CollectionsOverTimeChart";
import ItemsProcessedOverTimeChart from "./charts/ItemsProcessedOverTimeChart";
import ErrorsOverTimeChart from "./charts/ErrorsOverTimeChart";
import CompletionRateOverTimeChart from "./charts/CompletionRateOverTimeChart";
import EntityStatsOverTimeChart from "./charts/EntityStatsOverTimeChart";
import DataVolumeCard from "./volume/DataVolumeCard";

interface DataCollectionDashboardProps {
  data: AccountStatsResponse;
}

/**
 * DataCollectionDashboard Component
 *
 * Main container component that organizes all data collection components
 * into logical sections for a comprehensive dashboard view.
 */
export default function DataCollectionDashboard({
  data,
}: DataCollectionDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="space-y-6">
        <AccountHealthCard data={data} />
        <SummaryCards data={data} />
      </div>

      {/* Error Analysis Section */}
      <DataCollectionSection
        title="Error Analysis"
        description="Error rates, patterns, and entity-specific error breakdowns"
      >
        <ErrorAnalysisCard data={data} />
        <ErrorRateByEntityChart data={data} />
      </DataCollectionSection>

      {/* Entity Statistics Section */}
      <DataCollectionSection
        title="Entity Statistics"
        description="Detailed statistics for competitions, teams, and games"
      >
        <EntityStatisticsTable data={data} />
      </DataCollectionSection>

      {/* Performance Metrics Section */}
      <DataCollectionSection
        title="Performance Metrics"
        description="Time taken and memory usage metrics with distribution analysis"
      >
        <PerformanceMetricsCards data={data} />
        <PerformanceOverTimeChart data={data} />
        <PerformanceDistributionChart data={data} />
      </DataCollectionSection>

      {/* Stage Analysis Section */}
      <DataCollectionSection
        title="Stage Analysis"
        description="Collection stage completion and distribution patterns"
      >
        <StageAnalysisCard data={data} />
        <StageDistributionChart data={data} />
      </DataCollectionSection>

      {/* Temporal Analysis Section */}
      <DataCollectionSection
        title="Temporal Analysis"
        description="Collection frequency, timing patterns, and historical trends"
      >
        <TemporalAnalysisCard data={data} />
        <CollectionsOverTimeChart data={data} />
      </DataCollectionSection>

      {/* Time Series Charts Section */}
      <DataCollectionSection
        title="Time Series Analysis"
        description="Trends and patterns over time for various metrics"
      >
        <ItemsProcessedOverTimeChart data={data} />
        <ErrorsOverTimeChart data={data} />
        <CompletionRateOverTimeChart data={data} />
        <EntityStatsOverTimeChart data={data} />
      </DataCollectionSection>

      {/* Data Volume Section */}
      <DataCollectionSection
        title="Data Volume"
        description="Volume statistics and processing breakdowns"
      >
        <DataVolumeCard data={data} />
      </DataCollectionSection>
    </div>
  );
}
