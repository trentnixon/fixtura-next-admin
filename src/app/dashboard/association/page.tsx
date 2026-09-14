"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Gauge,
  Link2,
  RefreshCcw,
  Trophy,
  Users,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
  siteNavigationCtaClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { useAssociationInsights } from "@/hooks/association/useAssociationInsights";
import {
  AssociationInsightsResponse,
  SportFilter,
} from "@/types/associationInsights";

import SportFilterComponent from "./components/SportFilter";
import AssociationCoverageSection from "./components/AssociationCoverageSection";
import AssociationCompetitionsSection from "./components/AssociationCompetitionsSection";
import AssociationsTable from "./components/AssociationsTable";
import AssociationTimelineSection from "./components/AssociationTimelineSection";

const associationTabs = [
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
  {
    value: "competitions",
    label: "Competitions",
    icon: Trophy,
  },
];

export default function AssociationData() {
  const [selectedSport, setSelectedSport] = useState<SportFilter | undefined>(
    "Cricket",
  );
  const { data, isLoading, error, refetch } =
    useAssociationInsights(selectedSport);

  return (
    <>
      <CreatePageTitle
        title="Associations"
        byLine="Association directory and operational insight"
        byLineBottom="Compact view of linked accounts, competitions, clubs, and grades"
      >
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-end">
          <SportFilterComponent
            selectedSport={selectedSport}
            onSportChange={setSelectedSport}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
            disabled={isLoading}
            className={cn(siteNavigationCtaClass, "shrink-0 self-end sm:self-auto")}
          >
            <RefreshCcw className="h-4 w-4 shrink-0 text-current" aria-hidden />
            Refresh
          </Button>
        </div>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        {isLoading && (
          <SectionContainer title="Loading">
            <LoadingState message="Loading association insights..." />
          </SectionContainer>
        )}

        {error && !isLoading && (
          <SectionContainer title="Error">
            <ErrorState
              error={error}
              title="Failed to load association insights"
              onRetry={() => refetch()}
            />
          </SectionContainer>
        )}

        {data?.data && (
          <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
            <div className="pb-8">
              <TabsList variant="primary" className={sectionTabListClass}>
                {associationTabs.map((tab) => {
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

            <TabsContent value="snapshot" className="mt-0 space-y-6">
              <AssociationSnapshot insights={data} />
              <AssociationsTable associations={data.data.associations} />
            </TabsContent>

            <TabsContent
              value="timeline"
              className="mt-0 min-w-0 max-w-full overflow-hidden"
            >
              <AssociationTimelineSection
                associations={data.data.associations}
              />
            </TabsContent>

            <TabsContent value="coverage" className="mt-0">
              {data.data.overview && data.data.gradesAndClubs && (
                <AssociationCoverageSection
                  overview={data.data.overview}
                  gradesAndClubs={data.data.gradesAndClubs}
                />
              )}
            </TabsContent>

            <TabsContent value="competitions" className="mt-0">
              {data.data.competitions && (
                <AssociationCompetitionsSection
                  competitions={data.data.competitions}
                />
              )}
            </TabsContent>
          </Tabs>
        )}
      </PageContainer>
    </>
  );
}

function AssociationSnapshot({
  insights,
}: {
  insights: AssociationInsightsResponse;
}) {
  const { overview, gradesAndClubs, competitions, associations, meta } =
    insights.data;
  const linkedAccountPercent =
    overview.totalAssociations > 0
      ? Math.round(
          (overview.associationsWithAccounts / overview.totalAssociations) *
            100,
        )
      : 0;
  const datedAssociations = associations.filter(
    (association) => association.competitionDateRange,
  ).length;

  return (
    <SectionContainer
      title="Association Snapshot"
      description="Current scope and coverage for the selected sport filter."
      action={
        <Badge variant="outline" className="w-fit bg-slate-50">
          {meta.filters.sport ?? "All sports"}
        </Badge>
      }
      contentClassName="p-0"
    >
      <div className="grid overflow-hidden bg-white sm:grid-cols-2 xl:grid-cols-4">
        <SnapshotMetric
          title="Associations"
          value={overview.totalAssociations.toLocaleString()}
          detail={`${overview.activeAssociations.toLocaleString()} active`}
          supporting={`${overview.inactiveAssociations.toLocaleString()} inactive`}
          detailLabel="status"
          supportingLabel="status"
          icon={<Building2 className="h-4 w-4" />}
          tone="blue"
        />
        <SnapshotMetric
          title="Linked Accounts"
          value={`${linkedAccountPercent}%`}
          detail={`${overview.associationsWithAccounts.toLocaleString()} linked`}
          supporting={`${overview.associationsWithoutAccounts.toLocaleString()} missing`}
          detailLabel="coverage"
          supportingLabel="gap"
          icon={<Link2 className="h-4 w-4" />}
          tone="emerald"
        />
        <SnapshotMetric
          title="Competitions"
          value={competitions.totalCompetitions.toLocaleString()}
          detail={`${competitions.activeCompetitions.toLocaleString()} active`}
          supporting={`${datedAssociations.toLocaleString()} with dates`}
          detailLabel="status"
          supportingLabel="timeline"
          icon={<ClipboardList className="h-4 w-4" />}
          tone="amber"
        />
        <SnapshotMetric
          title="Grades & Clubs"
          value={gradesAndClubs.totalGrades.toLocaleString()}
          detail={`${gradesAndClubs.totalClubs.toLocaleString()} clubs`}
          supporting={`${meta.dataPoints.teams.toLocaleString()} teams`}
          detailLabel="network"
          supportingLabel="teams"
          icon={<Users className="h-4 w-4" />}
          tone="slate"
        />
      </div>
      <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.associations.toLocaleString()} associations
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.competitions.toLocaleString()} competitions
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1">
            {meta.dataPoints.grades.toLocaleString()} grades
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500">
          API time {meta.performance.totalTimeMs}ms
        </span>
      </div>
    </SectionContainer>
  );
}

function SnapshotMetric({
  title,
  value,
  detail,
  supporting,
  detailLabel,
  supportingLabel,
  icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  supporting: string;
  detailLabel: string;
  supportingLabel: string;
  icon: ReactNode;
  tone: "blue" | "emerald" | "amber" | "slate";
}) {
  const toneClassNames = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="min-w-0 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:[&:nth-child(odd)]:border-r xl:border-b-0 xl:border-r xl:last:border-r-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium uppercase text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-2xl font-semibold leading-none text-slate-950">
            {value}
          </p>
        </div>
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${toneClassNames[tone]}`}
        >
          {icon}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-md bg-slate-50 px-2.5 py-2">
          <div className="font-semibold text-slate-800">{detail}</div>
          <div className="mt-0.5 text-slate-500">{detailLabel}</div>
        </div>
        <div className="rounded-md bg-slate-50 px-2.5 py-2">
          <div className="font-semibold text-slate-800">{supporting}</div>
          <div className="mt-0.5 text-slate-500">{supportingLabel}</div>
        </div>
      </div>
    </div>
  );
}
