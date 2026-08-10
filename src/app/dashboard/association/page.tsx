"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ClipboardList,
  Gauge,
  Home,
  Link2,
  RefreshCcw,
  Trophy,
  Users,
} from "lucide-react";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssociationInsights } from "@/hooks/association/useAssociationInsights";
import {
  AssociationInsightsResponse,
  SportFilter,
} from "@/types/associationInsights";

// Component imports
import DataWrapper from "./components/DataWrapper";
import SportFilterComponent from "./components/SportFilter";
import OverviewStatsCard from "./components/OverviewStatsCard";
import GradesAndClubsStatsCard from "./components/GradesAndClubsStatsCard";
import CompetitionStatsCard from "./components/CompetitionStatsCard";
import CompetitionDatePatternsCard from "./components/CompetitionDatePatternsCard";
import AssociationsTable from "./components/AssociationsTable";
import { AssociationGanttSection } from "./components/AssociationGanttSection";

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
      />
      <PageContainer padding="xs" spacing="lg">
        <SectionContainer
          title="Association Workspace"
          description="Route context, active filter, and endpoint health for the association insight workflow."
          variant="compact"
          contentClassName="space-y-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="flex items-center gap-1"
                      href="/dashboard"
                    >
                      <Home className="h-3.5 w-3.5" />
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Associations</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div>
                <h2 className="text-lg font-semibold leading-tight text-slate-950">
                  Association insight workspace
                </h2>
                <p className="text-sm text-muted-foreground">
                  Review association coverage, operational scale, and
                  competition activity from one filtered dataset.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:justify-end">
              <SportFilterComponent
                selectedSport={selectedSport}
                onSportChange={setSelectedSport}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3">
            <WorkspaceStatus
              label="Sport filter"
              value={selectedSport ?? "All sports"}
            />
            <WorkspaceStatus
              label="Records"
              value={
                data?.data?.associations
                  ? data.data.associations.length.toLocaleString()
                  : isLoading
                    ? "Loading"
                    : "No data"
              }
            />
            <WorkspaceStatus
              label="Generated"
              value={
                data?.data?.meta.generatedAt
                  ? new Date(data.data.meta.generatedAt).toLocaleString()
                  : "Pending"
              }
            />
          </div>
        </SectionContainer>

        <DataWrapper
          isLoading={isLoading}
          error={error}
          data={data}
          onRetry={() => refetch()}
        >
          <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
            <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1">
              {associationTabs.map((tab) => {
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

            <TabsContent value="snapshot" className="mt-6 space-y-6">
              {data?.data && <AssociationSnapshot insights={data} />}
              {data?.data?.associations && (
                <SectionContainer
                  title="Associations"
                  description="Search, sort, and open association detail records."
                >
                  <AssociationsTable associations={data.data.associations} />
                </SectionContainer>
              )}
            </TabsContent>

            <TabsContent
              value="timeline"
              className="mt-6 min-w-0 max-w-full overflow-hidden"
            >
              {data?.data?.associations && (
                <AssociationGanttSection
                  associations={data.data.associations}
                />
              )}
            </TabsContent>

            <TabsContent value="coverage" className="mt-6 space-y-6">
              {data?.data?.overview && (
                <SectionContainer
                  title="Account Coverage"
                  description="How many associations exist, how many are linked to accounts, and where the largest account gaps are."
                >
                  <OverviewStatsCard data={data.data.overview} />
                </SectionContainer>
              )}

              {data?.data?.gradesAndClubs && (
                <SectionContainer
                  title="Participation Structure"
                  description="Grade and club depth across associations so sparse and high-volume groups are easier to spot."
                >
                  <GradesAndClubsStatsCard data={data.data.gradesAndClubs} />
                </SectionContainer>
              )}
            </TabsContent>

            <TabsContent value="competitions" className="mt-6 space-y-6">
              {data?.data?.competitions && (
                <SectionContainer
                  title="Competition Mix"
                  description="Status, team size, and grade depth across competitions for the selected sport."
                >
                  <CompetitionStatsCard data={data.data.competitions} />
                </SectionContainer>
              )}

              {data?.data?.competitions?.datePatterns && (
                <SectionContainer
                  title="Competition Timing"
                  description="Start and end timing, duration, and near-term activity for competitions with valid dates."
                >
                  <CompetitionDatePatternsCard
                    data={data.data.competitions.datePatterns}
                  />
                </SectionContainer>
              )}
            </TabsContent>
          </Tabs>
        </DataWrapper>
      </PageContainer>
    </>
  );
}

function WorkspaceStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-slate-50 px-3 py-2">
      <div className="text-xs font-medium uppercase text-slate-500">
        {label}
      </div>
      <div className="mt-1 truncate font-semibold text-slate-900">{value}</div>
    </div>
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
