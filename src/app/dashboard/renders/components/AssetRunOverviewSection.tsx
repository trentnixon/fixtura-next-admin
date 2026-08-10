"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { useAccountAssetRunGlobalStatus } from "@/hooks/account-asset-run/useAccountAssetRunGlobalStatus";
import { useAssetRunStepMetricsSample } from "@/hooks/account-asset-run/useAssetRunStepMetricsSample";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import {
  computeAssetRunAtAGlanceMetrics,
} from "@/lib/account-asset-run/globalRunAnalytics";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import { AssetRunTimingRollup } from "./AssetRunTimingRollup";
import { AssetRunStepDurationChart } from "./AssetRunStepDurationChart";

export const ASSET_RUN_ANALYTICS_LIMIT = 100;

export function AssetRunOverviewSection() {
  const { data, isLoading, error, refetch, isError } =
    useAccountAssetRunGlobalStatus(ASSET_RUN_ANALYTICS_LIMIT);

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const hasActive = rows.some((row) => isAssetRunActive(row.status));
  const nowMs = useLiveRunClock(hasActive);

  const glanceMetrics = useMemo(
    () => computeAssetRunAtAGlanceMetrics(rows, nowMs),
    [rows, nowMs],
  );

  const {
    stepAggregates,
    isLoading: stepSampleLoading,
    sampleCount,
  } = useAssetRunStepMetricsSample(rows, !isLoading && rows.length > 0);

  const windowLabel = `last ${ASSET_RUN_ANALYTICS_LIMIT} runs`;

  if (isLoading) {
    return (
      <SectionContainer
        title="Asset run timing"
        description={`Run-level metrics from the ${windowLabel}`}
        variant="compact"
      >
        <LoadingState variant="default" message="Loading asset runs..." />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Asset run timing"
        description={`Run-level metrics from the ${windowLabel}`}
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load asset runs"
          variant="default"
        />
        <Button
          type="button"
          onClick={() => refetch()}
          className="mt-2"
          size="sm"
          variant="outline"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </SectionContainer>
    );
  }

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Asset run timing"
        description={`Run-level metrics from the ${windowLabel}. Open any run for step-by-step detail.`}
        variant="compact"
      >
        <AssetRunTimingRollup
          metrics={glanceMetrics}
          windowLabel={windowLabel}
        />
      </SectionContainer>

      <AssetRunStepDurationChart
        aggregates={stepAggregates}
        sampleCount={sampleCount}
        isLoading={stepSampleLoading}
      />
    </div>
  );
}
