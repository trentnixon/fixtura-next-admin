"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Database } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

interface EntityStatsOverTimeChartProps {
  data: AccountStatsResponse;
}

/**
 * EntityStatsOverTimeChart Component
 *
 * Displays entity statistics over time with:
 * - Multi-series line chart for competitions, teams, and games
 * - Items found trends for each entity type
 * - Visual comparison of entity processing volumes
 */
export default function EntityStatsOverTimeChart({
  data,
}: EntityStatsOverTimeChartProps) {
  const entityStats = data.data.timeSeries.entityStatsOverTime;

  // Combine all entity data points by date
  // We'll use competitions as the base and add teams/games data
  const competitions = entityStats?.competitions || [];
  const teams = entityStats?.teams || [];
  const games = entityStats?.games || [];

  // Get all unique dates
  const allDates = new Set<string>();
  competitions.forEach((point) => allDates.add(point.date));
  teams.forEach((point) => allDates.add(point.date));
  games.forEach((point) => allDates.add(point.date));

  // Create combined data points
  const chartData = Array.from(allDates)
    .sort()
    .map((date) => {
      const comp = competitions.find((p) => p.date === date);
      const team = teams.find((p) => p.date === date);
      const game = games.find((p) => p.date === date);

      return {
        date,
        competitionsItemsFound: comp?.itemsFound || 0,
        competitionsItemsUpdated: comp?.itemsUpdated || 0,
        competitionsItemsNew: comp?.itemsNew || 0,
        competitionsErrors: comp?.errorsDetected || 0,
        teamsItemsFound: team?.itemsFound || 0,
        teamsItemsUpdated: team?.itemsUpdated || 0,
        teamsItemsNew: team?.itemsNew || 0,
        teamsErrors: team?.errorsDetected || 0,
        gamesItemsFound: game?.itemsFound || 0,
        gamesItemsUpdated: game?.itemsUpdated || 0,
        gamesItemsNew: game?.itemsNew || 0,
        gamesErrors: game?.errorsDetected || 0,
      };
    });

  // Chart configuration
  const chartConfig = {
    competitionsItemsFound: {
      label: "Competitions - Items Found",
      color: "hsl(221, 83%, 53%)", // indigo-600
    },
    teamsItemsFound: {
      label: "Teams - Items Found",
      color: "hsl(262, 83%, 58%)", // purple-600
    },
    gamesItemsFound: {
      label: "Games - Items Found",
      color: "hsl(142, 76%, 36%)", // emerald-600
    },
  } satisfies ChartConfig;

  // Format date for display
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Calculate statistics for display
  const totalCompetitionsFound = competitions.reduce(
    (sum, point) => sum + point.itemsFound,
    0
  );
  const totalTeamsFound = teams.reduce(
    (sum, point) => sum + point.itemsFound,
    0
  );
  const totalGamesFound = games.reduce(
    (sum, point) => sum + point.itemsFound,
    0
  );

  const totalCompetitionsUpdated = competitions.reduce(
    (sum, point) => sum + point.itemsUpdated,
    0
  );
  const totalTeamsUpdated = teams.reduce(
    (sum, point) => sum + point.itemsUpdated,
    0
  );
  const totalGamesUpdated = games.reduce(
    (sum, point) => sum + point.itemsUpdated,
    0
  );

  const totalCompetitionsNew = competitions.reduce(
    (sum, point) => sum + point.itemsNew,
    0
  );
  const totalTeamsNew = teams.reduce((sum, point) => sum + point.itemsNew, 0);
  const totalGamesNew = games.reduce((sum, point) => sum + point.itemsNew, 0);

  const totalCompetitionsErrors = competitions.reduce(
    (sum, point) => sum + point.errorsDetected,
    0
  );
  const totalTeamsErrors = teams.reduce(
    (sum, point) => sum + point.errorsDetected,
    0
  );
  const totalGamesErrors = games.reduce(
    (sum, point) => sum + point.errorsDetected,
    0
  );

  if (chartData.length === 0) {
    return (
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-500" />
            Entity Statistics Over Time
          </CardTitle>
          <CardDescription>
            Entity processing trends for competitions, teams, and games
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No entity statistics data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-500" />
          <CardTitle className="text-lg font-semibold">
            Entity Statistics Over Time
          </CardTitle>
        </div>
        <CardDescription>
          Items found trends for competitions, teams, and games over time
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4 border-b">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">
              Competitions Total
            </div>
            <div className="text-lg font-semibold text-indigo-600">
              {totalCompetitionsFound.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Updated: {totalCompetitionsUpdated.toLocaleString()} | New:{" "}
              {totalCompetitionsNew.toLocaleString()} | Errors:{" "}
              {totalCompetitionsErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Teams Total</div>
            <div className="text-lg font-semibold text-purple-600">
              {totalTeamsFound.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Updated: {totalTeamsUpdated.toLocaleString()} | New:{" "}
              {totalTeamsNew.toLocaleString()} | Errors:{" "}
              {totalTeamsErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Games Total</div>
            <div className="text-lg font-semibold text-emerald-600">
              {totalGamesFound.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              Updated: {totalGamesUpdated.toLocaleString()} | New:{" "}
              {totalGamesNew.toLocaleString()} | Errors:{" "}
              {totalGamesErrors.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Total Entities</div>
            <div className="text-lg font-semibold">
              {(
                totalCompetitionsFound +
                totalTeamsFound +
                totalGamesFound
              ).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              All entity types combined
            </div>
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              label={{
                value: "Items Found",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => {
                return [
                  value.toLocaleString(),
                  chartConfig[name as keyof typeof chartConfig]?.label || name,
                ];
              }}
              labelFormatter={(label) => formatDate(label)}
            />
            <Legend
              wrapperStyle={{ paddingTop: "20px" }}
              iconType="line"
              formatter={(value) => {
                return (
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                );
              }}
            />
            {/* Competitions Line */}
            <Line
              type="monotone"
              dataKey="competitionsItemsFound"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Teams Line */}
            <Line
              type="monotone"
              dataKey="teamsItemsFound"
              stroke="hsl(262, 83%, 58%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            {/* Games Line */}
            <Line
              type="monotone"
              dataKey="gamesItemsFound"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2 border-t flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-indigo-600" />
            <span>Competitions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-purple-600" />
            <span>Teams</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-emerald-600" />
            <span>Games</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
