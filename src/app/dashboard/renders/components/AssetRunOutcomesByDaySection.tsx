"use client";

import { useMemo } from "react";
import { useAccountAssetRunGlobalStatus } from "@/hooks/account-asset-run/useAccountAssetRunGlobalStatus";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { assetRunsByDay } from "@/lib/account-asset-run/globalRunAnalytics";
import {
  ASSET_RUN_ANALYTICS_LIMIT,
} from "./AssetRunOverviewSection";
import { AssetRunOutcomesByDayChart } from "./AssetRunOutcomesByDayChart";

export function AssetRunOutcomesByDaySection() {
  const { data, isLoading, isError, error } = useAccountAssetRunGlobalStatus(
    ASSET_RUN_ANALYTICS_LIMIT,
  );

  const chartData = useMemo(
    () => assetRunsByDay(data?.data ?? []),
    [data?.data],
  );

  if (isLoading) {
    return <LoadingState message="Loading asset run trends..." />;
  }

  if (isError) {
    return <ErrorState error={error} title="Asset run trends error" />;
  }

  if (chartData.length < 1) {
    return null;
  }

  return <AssetRunOutcomesByDayChart data={chartData} />;
}
