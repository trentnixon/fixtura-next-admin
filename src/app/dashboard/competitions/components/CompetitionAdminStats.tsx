"use client";

import { useMemo, useState } from "react";

import { useCompetitionAdminStats } from "@/hooks/competitions/useCompetitionAdminStats";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { FiltersSection } from "./CompetitionAdminStats/sections/FiltersSection";
import { OverviewSection } from "./CompetitionAdminStats/sections/OverviewSection";
import { HighlightsSection } from "./CompetitionAdminStats/sections/HighlightsSection";
import { DistributionsSection } from "./CompetitionAdminStats/sections/DistributionsSection";
import { AvailableCompetitionsSection } from "./CompetitionAdminStats/sections/AvailableCompetitionsSection";
import {
  buildSeasonChartData,
  getSeasonsFromSummary,
} from "./CompetitionAdminStats/helpers";
import { ChartConfig } from "@/components/ui/chart";

export default function CompetitionAdminStats() {
  const [associationInput, setAssociationInput] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<string | undefined>(
    undefined
  );

  const associationIdFilter = useMemo(() => {
    if (!associationInput.trim()) {
      return undefined;
    }

    const parsed = Number(associationInput);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [associationInput]);

  const params = useMemo(
    () => ({
      associationId: associationIdFilter,
      season: seasonFilter,
    }),
    [associationIdFilter, seasonFilter]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminStats(params);

  const seasons = useMemo(() => getSeasonsFromSummary(data), [data]);

  const seasonChartData = useMemo(() => {
    if (!data) {
      return [] as Array<{ season: string; count: number }>;
    }

    return buildSeasonChartData(
      data.tables.available,
      data.summary.breakdowns.bySeason
    );
  }, [data]);

  const isAssociationInvalid =
    associationInput.trim().length > 0 &&
    Number.isNaN(Number(associationInput));

  if (isLoading && !data) {
    return <LoadingState message="Loading competition statistics..." />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Unable to load competition admin statistics.")
        }
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return null;
  }

  const statusChartData = data.charts.byStatus.map((item) => ({
    status: item.status,
    count: item.count,
  }));

  const timingChartData = data.charts.byTiming.map((item) => ({
    timing: item.timing,
    count: item.count,
  }));

  const sizeCategoryChartData = data.charts.sizeCategories.map((item) => ({
    category: item.category,
    count: item.count,
  }));

  const statusChartConfig: ChartConfig = statusChartData.reduce(
    (acc, item, index) => ({
      ...acc,
      [item.status]: {
        label: item.status,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      },
    }),
    {} as ChartConfig
  );

  const timingChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-1))" },
  };

  const sizeCategoryChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-2))" },
  };

  const seasonChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-3))" },
  };

  const filters = (
    <FiltersSection
      associationInput={associationInput}
      setAssociationInput={setAssociationInput}
      seasonFilter={seasonFilter}
      setSeasonFilter={setSeasonFilter}
      seasons={seasons}
      isFetching={isFetching}
      isAssociationInvalid={isAssociationInvalid}
    />
  );

  return (
    <div className="space-y-6">
      <AvailableCompetitionsSection competitions={data.tables.available} />
      <OverviewSection
        summary={data.summary}
        filters={filters}
        competitions={data.tables.available}
      />
      <HighlightsSection highlights={data.facts.highlights} />
      <DistributionsSection
        statusChartData={statusChartData}
        timingChartData={timingChartData}
        sizeCategoryChartData={sizeCategoryChartData}
        seasonChartData={seasonChartData}
        statusChartConfig={statusChartConfig}
        timingChartConfig={timingChartConfig}
        sizeCategoryChartConfig={sizeCategoryChartConfig}
        seasonChartConfig={seasonChartConfig}
      />
    </div>
  );
}
