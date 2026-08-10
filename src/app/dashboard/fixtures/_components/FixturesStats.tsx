"use client";

import type { ElementType } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  Building2,
  Trophy,
  GraduationCap,
  MapPin,
  BarChart3,
} from "lucide-react";
import { useFixtureInsights } from "@/hooks/fixtures/useFixtureInsights";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { cn } from "@/lib/utils";

interface CompactMetric {
  title: string;
  value: string | number;
  icon: ElementType;
  description: string;
}

function MetricStrip({ metrics }: { metrics: CompactMetric[] }) {
  return (
    <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.title}
            className={cn(
              "flex min-h-24 items-center gap-3 border-slate-200 p-4",
              index < metrics.length - 1 && "border-b sm:border-r",
              index === 1 && "sm:border-r-0 lg:border-r",
              index >= 2 && "sm:border-b-0",
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {metric.title}
              </p>
              <p className="text-xl font-semibold tabular-nums text-slate-900">
                {metric.value}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {metric.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function FixturesStats() {
  const { data, isLoading, error, refetch } = useFixtureInsights();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionContainer
          title="Fixture Snapshot"
          description="Loading fixture coverage..."
        >
          <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 border-slate-200 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </SectionContainer>
        <SectionContainer
          title="System Scope"
          description="Loading entity coverage..."
        >
          <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 border-slate-200 p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <SectionContainer title="Fixture Statistics">
        <ErrorState
          error={error}
          title="Failed to load fixture statistics"
          onRetry={() => refetch()}
          variant="card"
        />
      </SectionContainer>
    );
  }

  // Extract stats from API data
  const overview = data?.data?.overview;
  const distributions = data?.data?.distributions;

  if (!overview || !distributions) {
    return null;
  }

  const stats = {
    total: overview.totalFixtures,
    scheduled: distributions.byStatus.upcoming,
    inProgress: distributions.byStatus.inProgress,
    completed: distributions.byStatus.finished,
    associations: overview.uniqueAssociations,
    competitions: overview.uniqueCompetitions,
    grades: overview.uniqueGrades,
    grounds: overview.uniqueGrounds,
    avgPerComp: overview.averages.fixturesPerCompetition,
    avgPerAssoc: overview.averages.fixturesPerAssociation,
  };

  const statusCards = [
    {
      title: "Total Fixtures",
      value: stats.total,
      icon: Calendar,
      description: "All fixtures in system",
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: Clock,
      description: "Upcoming fixtures",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: PlayCircle,
      description: "Currently active",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      description: "Finished fixtures",
    },
  ];

  const scopeCards = [
    {
      title: "Associations",
      value: stats.associations,
      icon: Building2,
      description: "Active associations",
    },
    {
      title: "Competitions",
      value: stats.competitions,
      icon: Trophy,
      description: "Active competitions",
    },
    {
      title: "Grades",
      value: stats.grades,
      icon: GraduationCap,
      description: "Active grades",
    },
    {
      title: "Grounds",
      value: stats.grounds,
      icon: MapPin,
      description: "Venues used",
    },
  ];

  const averageCards = [
    {
      title: "Fixtures / Competition",
      value: stats.avgPerComp.toFixed(1),
      icon: BarChart3,
      description: "Average fixtures per comp",
    },
    {
      title: "Fixtures / Association",
      value: stats.avgPerAssoc.toFixed(1),
      icon: BarChart3,
      description: "Average fixtures per assoc",
    },
  ];

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Fixture Snapshot"
        description="Current fixture status across the system."
      >
        <MetricStrip metrics={statusCards} />
      </SectionContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionContainer
            title="System Scope"
            description="Total entities in the system"
          >
            <MetricStrip metrics={scopeCards} />
          </SectionContainer>
        </div>
        <div>
          <SectionContainer title="Averages" description="System wide averages">
            <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-1">
              {averageCards.map((metric, index) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.title}
                    className={cn(
                      "flex items-center gap-3 border-slate-200 p-4",
                      index === 0 &&
                        "border-b sm:border-b-0 sm:border-r lg:border-b lg:border-r-0",
                    )}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-xl font-semibold tabular-nums text-slate-900">
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
}
