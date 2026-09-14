"use client";

import { useMemo } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AssociationDetail } from "@/types/associationInsights";
import { AssociationGanttSection } from "./AssociationGanttSection";
import AssociationMissingDatesPanel from "./AssociationMissingDatesPanel";
import {
  computeSportWeightThresholds,
  computeTimelineDiscoveryStats,
  getAssociationsMissingDates,
  TIMELINE_STARTING_SOON_DAYS,
} from "./associationTimelineUtils";

interface AssociationTimelineSectionProps {
  associations: AssociationDetail[];
}

export default function AssociationTimelineSection({
  associations,
}: AssociationTimelineSectionProps) {
  const thresholds = useMemo(
    () => computeSportWeightThresholds(associations),
    [associations],
  );

  const stats = useMemo(
    () => computeTimelineDiscoveryStats(associations, thresholds),
    [associations, thresholds],
  );

  const missingDates = useMemo(
    () => getAssociationsMissingDates(associations),
    [associations],
  );

  const dateCoveragePercent =
    stats.total > 0
      ? Math.round((stats.withValidDates / stats.total) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Campaign discovery"
        description={`Outreach targets: seasons starting within ${TIMELINE_STARTING_SOON_DAYS} days or top size band for the sport.`}
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Marketing picks"
            value={stats.marketingPicks.toLocaleString()}
            detail="Starting soon or high competition + grade volume"
          />
          <RollupStat
            label="Starting soon"
            value={stats.startingSoon.toLocaleString()}
            detail={`Season start within ${TIMELINE_STARTING_SOON_DAYS} days`}
          />
          <RollupStat
            label="High value"
            value={stats.highValue.toLocaleString()}
            detail="Top quartile size within sport"
          />
          <RollupStat
            label="Timeline coverage"
            value={`${dateCoveragePercent}%`}
            detail={`${stats.withValidDates.toLocaleString()} with dates · ${stats.withoutDates.toLocaleString()} missing`}
          />
        </div>
      </SectionContainer>

      <AssociationGanttSection associations={associations} embedded />

      {missingDates.length > 0 && (
        <SectionContainer
          title="Missing timeline data"
          description="Secondary — data-quality follow-up. These records are excluded from the chart above."
          variant="compact"
        >
          <AssociationMissingDatesPanel associations={missingDates} />
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
