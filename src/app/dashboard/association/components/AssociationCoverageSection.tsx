"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  AssociationInsightsGradesAndClubs,
  AssociationInsightsOverview,
} from "@/types/associationInsights";
import OverviewStatsCard from "./OverviewStatsCard";
import GradesAndClubsStatsCard from "./GradesAndClubsStatsCard";

interface AssociationCoverageSectionProps {
  overview: AssociationInsightsOverview;
  gradesAndClubs: AssociationInsightsGradesAndClubs;
}

export default function AssociationCoverageSection({
  overview,
  gradesAndClubs,
}: AssociationCoverageSectionProps) {
  const linkedPercent =
    overview.totalAssociations > 0
      ? Math.round(
          (overview.associationsWithAccounts / overview.totalAssociations) *
            100,
        )
      : 0;

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Coverage at a glance"
        description="Account linkage and participation depth for the selected sport."
        variant="compact"
        contentClassName="p-0"
      >
        <div className="grid overflow-hidden sm:grid-cols-2 xl:grid-cols-4">
          <RollupStat
            label="Associations"
            value={overview.totalAssociations.toLocaleString()}
            detail={`${overview.activeAssociations.toLocaleString()} active · ${overview.inactiveAssociations.toLocaleString()} inactive`}
          />
          <RollupStat
            label="Account linkage"
            value={`${linkedPercent}%`}
            detail={`${overview.associationsWithAccounts.toLocaleString()} linked · ${overview.associationsWithoutAccounts.toLocaleString()} missing`}
          />
          <RollupStat
            label="Grades"
            value={gradesAndClubs.totalGrades.toLocaleString()}
            detail={`${gradesAndClubs.averageGradesPerAssociation.toFixed(1)} avg per association`}
          />
          <RollupStat
            label="Clubs"
            value={gradesAndClubs.totalClubs.toLocaleString()}
            detail={`${gradesAndClubs.averageClubsPerAssociation.toFixed(1)} avg per association`}
          />
        </div>
      </SectionContainer>

      <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <SectionContainer
          title="Account linkage"
          description="How associations map to Fixtura accounts and account-count buckets."
          variant="compact"
        >
          <OverviewStatsCard data={overview} hideSummary />
        </SectionContainer>

        <SectionContainer
          title="Grades & clubs"
          description="How grade and club volume is distributed across associations."
          variant="compact"
        >
          <GradesAndClubsStatsCard data={gradesAndClubs} hideSummary />
        </SectionContainer>
      </div>
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
