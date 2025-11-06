"use client";

import { useGlobalInsights } from "@/hooks/data-collection/useGlobalInsights";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import GlobalInsightsDashboard from "./global-insights/GlobalInsightsDashboard";

/**
 * GlobalDataCollectionInsights Component
 *
 * Main component that displays global data collection insights with high-level
 * performance and monitoring metrics across all data collections in the system.
 */
export function GlobalDataCollectionInsights() {
  const { data, isLoading, error } = useGlobalInsights();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (error) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load global insights")
        }
        variant="default"
      />
    );
  }

  if (!data) {
    return (
      <div className="text-sm text-muted-foreground">No data available</div>
    );
  }

  return <GlobalInsightsDashboard data={data} />;
}
