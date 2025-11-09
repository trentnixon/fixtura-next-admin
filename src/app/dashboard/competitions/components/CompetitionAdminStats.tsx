"use client";

import { useMemo, useState } from "react";
import {
  CompetitionAdminStatsResponse,
  CompetitionAdminStatsHighlight,
  CompetitionAdminStatsAvailableCompetition,
} from "@/types/competitionAdminStats";
import { useCompetitionAdminStats } from "@/hooks/competitions/useCompetitionAdminStats";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Activity,
  BarChart3,
  CalendarDays,
  Clock,
  PieChart as PieChartIcon,
  Trophy,
} from "lucide-react";
import Link from "next/link";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return value.toLocaleString();
}

function formatDuration(value: number | null): string {
  if (value === null || value === undefined) {
    return "—";
  }
  return `${value} days`;
}

function formatHighlightValue(
  highlight: CompetitionAdminStatsHighlight
): string {
  if (typeof highlight.value === "number") {
    return highlight.value.toLocaleString();
  }
  return highlight.value;
}

function getSeasonsFromSummary(
  data: CompetitionAdminStatsResponse | undefined
): string[] {
  if (!data) {
    return [];
  }

  const seasons = data.summary.breakdowns.bySeason
    .map((item) => item.season)
    .filter((season) => season && season.trim().length > 0);

  return Array.from(new Set(seasons));
}

function sizeCategoryBadge(
  category: CompetitionAdminStatsAvailableCompetition["sizeCategory"]
) {
  const labelMap: Record<
    CompetitionAdminStatsAvailableCompetition["sizeCategory"],
    string
  > = {
    none: "No Grades",
    small: "Small",
    medium: "Medium",
    large: "Large",
  };

  return <Badge variant="secondary">{labelMap[category]}</Badge>;
}

export default function CompetitionAdminStats() {
  const [associationInput, setAssociationInput] = useState<string>("");
  const [seasonFilter, setSeasonFilter] = useState<string | undefined>(
    undefined
  );

  const associationIdFilter = useMemo(() => {
    if (!associationInput.trim()) {
      return undefined;
    }

    const parsed = Number(associationInput);
    return Number.isNaN(parsed) ? undefined : parsed;
  }, [associationInput]);

  const params = useMemo(
    () => ({
      associationId: associationIdFilter,
      season: seasonFilter,
    }),
    [associationIdFilter, seasonFilter]
  );

  const { data, isLoading, isFetching, isError, error, refetch } =
    useCompetitionAdminStats(params);

  const seasons = useMemo(() => getSeasonsFromSummary(data), [data]);

  const isAssociationInvalid =
    associationInput.trim().length > 0 &&
    Number.isNaN(Number(associationInput));

  if (isLoading && !data) {
    return <LoadingState message="Loading competition statistics..." />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Unable to load competition admin statistics.")
        }
        onRetry={refetch}
      />
    );
  }

  if (!data) {
    return null;
  }

  const seasonChartData = data.summary.breakdowns.bySeason.map((item) => ({
    season: item.season,
    count: item.count,
  }));

  const statusChartData = data.charts.byStatus.map((item) => ({
    status: item.status,
    count: item.count,
  }));

  const timingChartData = data.charts.byTiming.map((item) => ({
    timing: item.timing,
    count: item.count,
  }));

  const sizeCategoryChartData = data.charts.sizeCategories.map((item) => ({
    category: item.category,
    count: item.count,
  }));

  const statusChartConfig: ChartConfig = statusChartData.reduce(
    (config, item) => ({
      ...config,
      [item.status]: {
        label: item.status,
        color: `hsl(var(--chart-${(config.__nextColorIndex || 0) + 1}))`,
      },
      __nextColorIndex: (config.__nextColorIndex || 0) + 1,
    }),
    { __nextColorIndex: 0 } as ChartConfig & { __nextColorIndex?: number }
  );
  delete statusChartConfig.__nextColorIndex;

  const timingChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-1))" },
  };

  const sizeCategoryChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-2))" },
  };

  const seasonChartConfig: ChartConfig = {
    count: { label: "Competitions", color: "hsl(var(--chart-3))" },
  };

  const filterAction = (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="association-filter">Association ID</Label>
        <Input
          id="association-filter"
          type="number"
          placeholder="All associations"
          value={associationInput}
          onChange={(event) => setAssociationInput(event.target.value)}
          className="w-[180px]"
          min={0}
        />
        {isAssociationInvalid && (
          <span className="text-xs text-destructive">
            Enter a valid numeric association ID.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="season-filter">Season</Label>
        <Select
          value={seasonFilter ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setSeasonFilter(undefined);
            } else {
              setSeasonFilter(value);
            }
          }}
        >
          <SelectTrigger id="season-filter" className="w-[180px]">
            <SelectValue placeholder="All seasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isFetching && (
        <Badge variant="outline" className="h-min">
          Refreshing…
        </Badge>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionContainer
        title="Competition Overview"
        description="Summary statistics for competitions currently visible through the CMS admin endpoint."
        action={filterAction}
      >
        <MetricGrid columns={4} gap="lg">
          <StatCard
            title="Total Competitions"
            value={formatNumber(data.summary.totals.competitions)}
            description={`${formatNumber(
              data.summary.totals.active
            )} active • ${formatNumber(data.summary.totals.inactive)} inactive`}
            icon={<Activity className="h-5 w-5" />}
            variant="primary"
          />
          <StatCard
            title="Started"
            value={formatNumber(data.summary.timing.started)}
            description={`${formatNumber(
              data.summary.timing.upcoming
            )} upcoming`}
            icon={<Clock className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            title="No Start Date"
            value={formatNumber(data.summary.timing.withoutStartDate)}
            description="Competitions awaiting kickoff scheduling"
            icon={<CalendarDays className="h-5 w-5" />}
            variant="secondary"
          />
          <StatCard
            title="Average Duration"
            value={formatDuration(data.summary.duration.averageDays)}
            description={`Shortest: ${formatDuration(
              data.summary.duration.shortestDays
            )} • Longest: ${formatDuration(data.summary.duration.longestDays)}`}
            icon={<Trophy className="h-5 w-5" />}
            variant="light"
          />
        </MetricGrid>
      </SectionContainer>

      <SectionContainer
        title="Competition Highlights"
        description="Auto-generated highlights sourced from the admin stats service."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.facts.highlights.map((highlight) => (
            <Card key={`${highlight.title}-${highlight.competitionId ?? "na"}`}>
              <CardHeader>
                <CardTitle className="text-base font-semibold">
                  {highlight.title}
                </CardTitle>
                {highlight.competitionName && (
                  <CardDescription>{highlight.competitionName}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold">
                  {formatHighlightValue(highlight)}
                </div>
                {highlight.competitionId && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Competition ID: {highlight.competitionId}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer
        title="Competition Distributions"
        description="Charts showing competition breakdowns by status, timing, size, and season."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard
            title="Status Distribution"
            description="Competition counts grouped by current status."
            icon={PieChartIcon}
            chartConfig={statusChartConfig}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  nameKey="status"
                  dataKey="count"
                  innerRadius={50}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={entry.status}
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Competition Timing"
            description="Started vs upcoming competitions with unknowns."
            icon={Clock}
            chartConfig={timingChartConfig}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timingChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="timing" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Size Categories"
            description="Competition volume by grade size bucket."
            icon={BarChart3}
            chartConfig={sizeCategoryChartConfig}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sizeCategoryChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="category" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Competitions by Season"
            description="Seasonal breakdown of competitions returned by the API."
            icon={Activity}
            chartConfig={seasonChartConfig}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={seasonChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="season" />
                <YAxis allowDecimals={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="count"
                  fill="hsl(var(--chart-3))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </SectionContainer>

      <SectionContainer
        title="Available Competitions"
        description="Search-friendly data used for tables and selectors."
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Association</TableHead>
                <TableHead className="text-right">Grades</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Weight</TableHead>
                <TableHead className="text-right">Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.tables.available.map((competition) => (
                <TableRow key={competition.id}>
                  <TableCell className="font-medium">
                    {competition.name}
                  </TableCell>
                  <TableCell>{competition.season ?? "—"}</TableCell>
                  <TableCell>{competition.associationName ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(competition.gradeCount)}
                  </TableCell>
                  <TableCell>
                    {sizeCategoryBadge(competition.sizeCategory)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(competition.weight)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {competition.durationDays
                      ? `${competition.durationDays} days`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/dashboard/competitions/${competition.id}`}>
                        View
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionContainer>
    </div>
  );
}
