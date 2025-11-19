"use client";

import { ReactNode } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

interface DataWrapperProps {
  isLoading: boolean;
  error: Error | null;
  data: unknown;
  onRetry?: () => void;
  children: ReactNode;
}

/**
 * DataWrapper Component
 *
 * Wraps content components and ensures they only render when data is available.
 * Handles loading, error, and no-data states.
 */
export default function DataWrapper({
  isLoading,
  error,
  data,
  onRetry,
  children,
}: DataWrapperProps) {
  // Loading State
  if (isLoading) {
    return (
      <SectionContainer
        title="Loading Association Insights"
        description="Fetching data from the API..."
      >
        <LoadingState message="Loading association insights..." />
      </SectionContainer>
    );
  }

  // Error State
  if (error) {
    return (
      <SectionContainer
        title="Error Loading Data"
        description="Unable to fetch association insights"
      >
        <ErrorState
          variant="card"
          title="Unable to load association insights"
          error={error}
          onRetry={onRetry}
        />
      </SectionContainer>
    );
  }

  // No Data State
  if (!data) {
    return (
      <SectionContainer
        title="No Data Available"
        description="Unable to load association insights"
      >
        <p className="text-sm text-muted-foreground">No data available</p>
      </SectionContainer>
    );
  }

  // Data Available - Render Children
  return <>{children}</>;
}
