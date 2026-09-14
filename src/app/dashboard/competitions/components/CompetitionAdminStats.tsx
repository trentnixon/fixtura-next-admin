"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { BarChart3, CalendarDays, Gauge } from "lucide-react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { ChartConfig } from "@/components/ui/chart";
import { CompetitionAdminStatsResponse } from "@/types/competitionAdminStats";
import { OverviewSection } from "./CompetitionAdminStats/sections/OverviewSection";
import { DistributionsSection } from "./CompetitionAdminStats/sections/DistributionsSection";
import { AvailableCompetitionsSection } from "./CompetitionAdminStats/sections/AvailableCompetitionsSection";
import CompetitionTimelineSection from "./CompetitionTimelineSection";
import { FiltersSection } from "./CompetitionAdminStats/sections/FiltersSection";
import { buildSeasonChartData } from "./CompetitionAdminStats/helpers";

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

interface CompetitionAdminStatsProps {
  data: CompetitionAdminStatsResponse | undefined;
  isInitialLoading: boolean;
  associationInput: string;
  setAssociationInput: Dispatch<SetStateAction<string>>;
  seasonFilter: string | undefined;
  setSeasonFilter: Dispatch<SetStateAction<string | undefined>>;
  seasons: string[];
  isFetching: boolean;
  isAssociationInvalid: boolean;
}

export default function CompetitionAdminStats({
  data,
  isInitialLoading,
  associationInput,
  setAssociationInput,
  seasonFilter,
  setSeasonFilter,
  seasons,
  isFetching,
  isAssociationInvalid,
}: CompetitionAdminStatsProps) {
  const seasonChartData = useMemo(() => {
    if (!data) {
      return [] as Array<{ season: string; count: number }>;
    }

    return buildSeasonChartData(
      data.tables.available,
      data.summary.breakdowns.bySeason,
    );
  }, [data]);

  const statusChartData = useMemo(
    () =>
      data?.charts.byStatus.map((item) => ({
        status: item.status,
        count: item.count,
      })) ?? [],
    [data],
  );

  const timingChartData = useMemo(
    () =>
      data?.charts.byTiming.map((item) => ({
        timing: item.timing,
        count: item.count,
      })) ?? [],
    [data],
  );

  const sizeCategoryChartData = useMemo(
    () =>
      data?.charts.sizeCategories.map((item) => ({
        category: item.category,
        count: item.count,
      })) ?? [],
    [data],
  );

  const statusChartConfig: ChartConfig = useMemo(
    () =>
      statusChartData.reduce(
        (acc, item, index) => ({
          ...acc,
          [item.status]: {
            label: item.status,
            color: `hsl(var(--chart-${(index % 5) + 1}))`,
          },
        }),
        {} as ChartConfig,
      ),
    [statusChartData],
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

  return (
    <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
      <div className="flex flex-col gap-4 pb-8">
        <FiltersSection
          associationInput={associationInput}
          setAssociationInput={setAssociationInput}
          seasonFilter={seasonFilter}
          setSeasonFilter={setSeasonFilter}
          seasons={seasons}
          isFetching={isFetching}
          isAssociationInvalid={isAssociationInvalid}
        />
        <TabsList variant="primary" className={sectionTabListClass}>
          {competitionTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {isInitialLoading && (
        <SectionContainer title="Loading">
          <LoadingState message="Loading competition statistics..." />
        </SectionContainer>
      )}

      {data && !isInitialLoading && (
        <>
          <TabsContent value="snapshot" className="mt-0 space-y-6">
            <OverviewSection
              summary={data.summary}
              competitions={data.tables.available}
            />
            <AvailableCompetitionsSection
              competitions={data.tables.available}
            />
          </TabsContent>

          <TabsContent
            value="timeline"
            className="mt-0 min-w-0 max-w-full overflow-hidden"
          >
            <CompetitionTimelineSection
              competitions={data.tables.available}
            />
          </TabsContent>

          <TabsContent value="coverage" className="mt-0 space-y-6">
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
        </>
      )}
    </Tabs>
  );
}
