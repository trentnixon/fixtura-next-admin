"use client";

import { useMemo, useState } from "react";

import { useCompetitionAdminStats } from "@/hooks/competitions/useCompetitionAdminStats";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { FiltersSection } from "./CompetitionAdminStats/sections/FiltersSection";
import { OverviewSection } from "./CompetitionAdminStats/sections/OverviewSection";
import { DistributionsSection } from "./CompetitionAdminStats/sections/DistributionsSection";
import { AvailableCompetitionsSection } from "./CompetitionAdminStats/sections/AvailableCompetitionsSection";
import { GanttSection } from "./CompetitionAdminStats/sections/GanttSection";
import {
  buildSeasonChartData,
  getSeasonsFromSummary,
} from "./CompetitionAdminStats/helpers";
import { ChartConfig } from "@/components/ui/chart";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CalendarDays, Gauge } from "lucide-react";

const competitionTabs = [
  {
    value: "snapshot",
    label: "Snapshot",
    icon: Gauge,
  },
  {
    value: "timeline",
    label: "Timeline",
    icon: CalendarDays,
  },
  {
    value: "coverage",
    label: "Coverage",
    icon: BarChart3,
  },
] as const;

export default function CompetitionAdminStats() {
  const [associationInput, setAssociationInput] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<string | undefined>(
    undefined,
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
    [associationIdFilter, seasonFilter],
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
      data.summary.breakdowns.bySeason,
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
    {} as ChartConfig,
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
    <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
          {competitionTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="min-h-10 gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="flex justify-start lg:justify-end">{filters}</div>
      </div>

      <TabsContent value="snapshot" className="mt-6 space-y-6">
        <OverviewSection
          summary={data.summary}
          competitions={data.tables.available}
        />
        <AvailableCompetitionsSection competitions={data.tables.available} />
      </TabsContent>

      <TabsContent
        value="timeline"
        className="mt-6 min-w-0 max-w-full overflow-hidden"
      >
        <GanttSection competitions={data.tables.available} />
      </TabsContent>

      <TabsContent value="coverage" className="mt-6 space-y-6">
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
      </TabsContent>
    </Tabs>
  );
}
