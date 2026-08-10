"use client";

import { ClubInsights } from "@/types/clubAdminDetail";
import { Activity, BarChart3, CalendarClock, TrendingUp } from "lucide-react";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "@/components/ui-library/states/EmptyState";

interface InsightsSectionProps {
  insights: ClubInsights;
}

const timelineConfig = {
  competitions: {
    label: "Active competitions",
    color: "hsl(var(--chart-1))",
    icon: Activity,
  },
  starting: {
    label: "Starting",
    color: "hsl(var(--chart-2))",
  },
  ending: {
    label: "Ending",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const activityConfig = {
  competitionsActive: {
    label: "Active",
    color: "hsl(var(--chart-1))",
  },
  competitionsStarted: {
    label: "Started",
    color: "hsl(var(--chart-2))",
  },
  competitionsEnded: {
    label: "Ended",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const growthConfig = {
  competitions: {
    label: "Competitions",
    color: "hsl(var(--chart-1))",
  },
  teams: {
    label: "Teams",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function InsightsSection({ insights }: InsightsSectionProps) {
  const hasTimeline = insights.competitionTimeline?.length > 0;
  const hasActivityByMonth = insights.activityPatterns.byMonth?.length > 0;
  const hasGrowthTrends =
    insights.growthTrends.competitionsOverTime?.length > 0 ||
    insights.growthTrends.teamsOverTime?.length > 0;
  const hasStartDates =
    insights.competitionStartDates.upcoming?.length > 0 ||
    insights.competitionStartDates.recent?.length > 0;

  const hasInsightsData =
    hasTimeline || hasActivityByMonth || hasGrowthTrends || hasStartDates;

  if (!hasInsightsData) {
    return (
      <EmptyState
        title="Insights Coming Soon"
        description="Analytics and insights for this club will include competition timelines, activity patterns, and growth trends."
        icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
        variant="card"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {hasTimeline && (
        <ChartCard
          title="Competition Timeline"
          description="Active competitions per day, with start and end events."
          icon={CalendarClock}
          chartConfig={timelineConfig}
          chartClassName="h-64"
        >
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={insights.competitionTimeline}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-AU", {
                    month: "short",
                    year: "2-digit",
                  });
                }}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Area
                dataKey="competitions"
                type="step"
                fill="var(--color-competitions)"
                fillOpacity={0.4}
                stroke="var(--color-competitions)"
              />
              <Bar
                dataKey="starting"
                stackId="events"
                fill="var(--color-starting)"
                radius={[4, 4, 0, 0]}
                barSize={4}
              />
              <Bar
                dataKey="ending"
                stackId="events"
                fill="var(--color-ending)"
                radius={[4, 4, 0, 0]}
                barSize={4}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {hasActivityByMonth && (
        <ChartCard
          title="Activity by Month"
          description="Monthly breakdown of competitions started, ended, and active."
          icon={Activity}
          chartConfig={activityConfig}
          chartClassName="h-64"
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={insights.activityPatterns.byMonth}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
                minTickGap={24}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar
                dataKey="competitionsActive"
                fill="var(--color-competitionsActive)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="competitionsStarted"
                fill="var(--color-competitionsStarted)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="competitionsEnded"
                fill="var(--color-competitionsEnded)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {hasGrowthTrends && (
        <ChartCard
          title="Growth Trends"
          description="Year-over-year growth in competitions and teams."
          icon={TrendingUp}
          chartConfig={growthConfig}
          chartClassName="h-64"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={mergeGrowthSeries(
                insights.growthTrends.competitionsOverTime,
                insights.growthTrends.teamsOverTime,
              )}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={8}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="competitions"
                stroke="var(--color-competitions)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="teams"
                stroke="var(--color-teams)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {hasStartDates && (
        <ChartCard
          title="Competition Start Dates"
          description="Upcoming and recent competition starts for this club."
          icon={CalendarClock}
          chartConfig={{}}
          chartClassName="h-auto"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <CompetitionDateList
              title="Upcoming"
              emptyLabel="No upcoming competitions."
              items={insights.competitionStartDates.upcoming
                .slice(0, 5)
                .map((item) => ({
                  key: `upcoming-${item.competitionId}-${item.startDate}`,
                  name: item.competitionName,
                  detail: `${item.daysUntilStart} days until start${
                    item.association ? ` - ${item.association.name}` : ""
                  }`,
                }))}
            />
            <CompetitionDateList
              title="Recent"
              emptyLabel="No recent competition starts."
              items={insights.competitionStartDates.recent
                .slice(0, 5)
                .map((item) => ({
                  key: `recent-${item.competitionId}-${item.startDate}`,
                  name: item.competitionName,
                  detail: `Started ${item.daysSinceStart} days ago${
                    item.association ? ` - ${item.association.name}` : ""
                  }`,
                }))}
            />
          </div>
        </ChartCard>
      )}
    </div>
  );
}

function CompetitionDateList({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: { key: string; name: string; detail: string }[];
}) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.key} className="flex flex-col">
            <span className="font-medium">{item.name}</span>
            <span className="text-xs text-muted-foreground">{item.detail}</span>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-xs text-muted-foreground">{emptyLabel}</li>
        )}
      </ul>
    </div>
  );
}

function mergeGrowthSeries(
  competitions: { year: number; count: number }[],
  teams: { year: number; count: number }[],
) {
  const byYear = new Map<
    number,
    { year: number; competitions?: number; teams?: number }
  >();

  for (const competition of competitions ?? []) {
    const existing = byYear.get(competition.year) ?? {
      year: competition.year,
    };
    existing.competitions = competition.count;
    byYear.set(competition.year, existing);
  }

  for (const team of teams ?? []) {
    const existing = byYear.get(team.year) ?? { year: team.year };
    existing.teams = team.count;
    byYear.set(team.year, existing);
  }

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}
