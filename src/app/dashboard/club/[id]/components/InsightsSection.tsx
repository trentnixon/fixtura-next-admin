"use client";

import { ClubInsights } from "@/types/clubAdminDetail";
import {
  BarChart3,
  TrendingUp,
  CalendarClock,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ComposedChart,
  Area,
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
    <div className="grid gap-6 lg:grid-cols-2">
      {hasTimeline && (
        <ChartCard
          title="Competition Timeline"
          description="Active competitions per day, with start and end events."
          icon={CalendarClock}
          chartConfig={timelineConfig}
          chartClassName="h-64"
        >
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
                return date.toLocaleDateString("en-US", {
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
          <LineChart
            data={mergeGrowthSeries(
              insights.growthTrends.competitionsOverTime,
              insights.growthTrends.teamsOverTime
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
        </ChartCard>
      )}

      {hasStartDates && (
        <Card className="shadow-none bg-slate-50 border rounded-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg font-semibold">
                Competition Start Dates
              </CardTitle>
            </div>
            <CardDescription>
              Upcoming and recent competition starts for this club.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold mb-2">Upcoming</h4>
              <ul className="space-y-2 text-sm">
                {insights.competitionStartDates.upcoming.slice(0, 5).map(
                  (item) => (
                    <li
                      key={`upcoming-${item.competitionId}-${item.startDate}`}
                      className="flex flex-col"
                    >
                      <span className="font-medium">
                        {item.competitionName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {item.daysUntilStart} days until start
                        {item.association
                          ? ` • ${item.association.name}`
                          : ""}
                      </span>
                    </li>
                  )
                )}
                {insights.competitionStartDates.upcoming.length === 0 && (
                  <li className="text-xs text-muted-foreground">
                    No upcoming competitions.
                  </li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Recent</h4>
              <ul className="space-y-2 text-sm">
                {insights.competitionStartDates.recent.slice(0, 5).map(
                  (item) => (
                    <li
                      key={`recent-${item.competitionId}-${item.startDate}`}
                      className="flex flex-col"
                    >
                      <span className="font-medium">
                        {item.competitionName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Started {item.daysSinceStart} days ago
                        {item.association
                          ? ` • ${item.association.name}`
                          : ""}
                      </span>
                    </li>
                  )
                )}
                {insights.competitionStartDates.recent.length === 0 && (
                  <li className="text-xs text-muted-foreground">
                    No recent competition starts.
                  </li>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function mergeGrowthSeries(
  competitions: { year: number; count: number }[],
  teams: { year: number; count: number }[]
) {
  const byYear = new Map<
    number,
    { year: number; competitions?: number; teams?: number }
  >();

  for (const c of competitions ?? []) {
    const existing = byYear.get(c.year) ?? { year: c.year };
    existing.competitions = c.count;
    byYear.set(c.year, existing);
  }

  for (const t of teams ?? []) {
    const existing = byYear.get(t.year) ?? { year: t.year };
    existing.teams = t.count;
    byYear.set(t.year, existing);
  }

  return Array.from(byYear.values()).sort((a, b) => a.year - b.year);
}

