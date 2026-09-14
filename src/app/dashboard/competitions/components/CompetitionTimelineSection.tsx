"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";
import { CompetitionGanttSection } from "./CompetitionGanttSection";
import CompetitionMissingDatesPanel from "./CompetitionMissingDatesPanel";
import {
  computeSportWeightThresholds,
  computeTimelineDiscoveryStats,
  getCompetitionsMissingDates,
  TIMELINE_STARTING_SOON_DAYS,
} from "./competitionTimelineUtils";

interface CompetitionTimelineSectionProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
}

export default function CompetitionTimelineSection({
  competitions,
}: CompetitionTimelineSectionProps) {
  const thresholds = useMemo(
    () => computeSportWeightThresholds(competitions),
    [competitions],
  );

  const stats = useMemo(
    () => computeTimelineDiscoveryStats(competitions, thresholds),
    [competitions, thresholds],
  );

  const missingDates = useMemo(
    () => getCompetitionsMissingDates(competitions),
    [competitions],
  );

  const dateCoveragePercent =
    stats.total > 0
      ? Math.round((stats.withValidDates / stats.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Campaign discovery"
        description={`Outreach targets: competitions starting within ${TIMELINE_STARTING_SOON_DAYS} days or top grade volume for the sport.`}
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Marketing picks"
            value={stats.marketingPicks.toLocaleString()}
            detail="Starting soon or high grade count within sport"
          />
          <RollupStat
            label="Starting soon"
            value={stats.startingSoon.toLocaleString()}
            detail={`Start within ${TIMELINE_STARTING_SOON_DAYS} days`}
          />
          <RollupStat
            label="High value"
            value={stats.highValue.toLocaleString()}
            detail="Top quartile grades within sport"
          />
          <RollupStat
            label="Timeline coverage"
            value={`${dateCoveragePercent}%`}
            detail={`${stats.withValidDates.toLocaleString()} with dates · ${stats.withoutDates.toLocaleString()} missing`}
          />
        </div>
      </SectionContainer>

      <CompetitionGanttSection competitions={competitions} embedded />

      {missingDates.length > 0 && (
        <SectionContainer
          title="Missing timeline data"
          description="Secondary — data-quality follow-up. These records are excluded from the chart above."
          variant="compact"
        >
          <CompetitionMissingDatesPanel competitions={missingDates} />
        </SectionContainer>
      )}
    </div>
  );
}

function RollupStat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold leading-none text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}
