"use client";

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
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function FixturesStats() {
  const { data, isLoading, error, refetch } = useFixtureInsights();

  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionContainer
          title="Fixture Statistics"
          description="Overview of fixture status"
        >
          <MetricGrid columns={4}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </MetricGrid>
        </SectionContainer>
        <SectionContainer
          title="System Scope"
          description="Total entities in the system"
        >
          <MetricGrid columns={4}>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </MetricGrid>
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
      icon: <Calendar className="h-4 w-4" />,
      description: "All fixtures in system",
      variant: "primary" as const,
    },
    {
      title: "Scheduled",
      value: stats.scheduled,
      icon: <Clock className="h-4 w-4" />,
      description: "Upcoming fixtures",
      variant: "accent" as const,
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: <PlayCircle className="h-4 w-4" />,
      description: "Currently active",
      variant: "secondary" as const,
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle2 className="h-4 w-4" />,
      description: "Finished fixtures",
      variant: "light" as const,
    },
  ];

  const scopeCards = [
    {
      title: "Associations",
      value: stats.associations,
      icon: <Building2 className="h-4 w-4" />,
      description: "Active associations",
      variant: "light" as const,
    },
    {
      title: "Competitions",
      value: stats.competitions,
      icon: <Trophy className="h-4 w-4" />,
      description: "Active competitions",
      variant: "light" as const,
    },
    {
      title: "Grades",
      value: stats.grades,
      icon: <GraduationCap className="h-4 w-4" />,
      description: "Active grades",
      variant: "light" as const,
    },
    {
      title: "Grounds",
      value: stats.grounds,
      icon: <MapPin className="h-4 w-4" />,
      description: "Venues used",
      variant: "light" as const,
    },
  ];

  const averageCards = [
    {
      title: "Fixtures / Competition",
      value: stats.avgPerComp.toFixed(1),
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Average fixtures per comp",
      variant: "light" as const,
    },
    {
      title: "Fixtures / Association",
      value: stats.avgPerAssoc.toFixed(1),
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Average fixtures per assoc",
      variant: "light" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Fixture Statistics"
        description="Overview of fixture status"
      >
        <MetricGrid columns={4}>
          {statusCards.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              description={stat.description}
              variant={stat.variant}
            />
          ))}
        </MetricGrid>
      </SectionContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionContainer
            title="System Scope"
            description="Total entities in the system"
          >
            <MetricGrid columns={4}>
              {scopeCards.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  description={stat.description}
                  variant={stat.variant}
                />
              ))}
            </MetricGrid>
          </SectionContainer>
        </div>
        <div>
          <SectionContainer
            title="Averages"
            description="System wide averages"
          >
            <MetricGrid columns={2}>
              {averageCards.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  description={stat.description}
                  variant={stat.variant}
                />
              ))}
            </MetricGrid>
          </SectionContainer>
        </div>
      </div>
    </div>
  );
}
