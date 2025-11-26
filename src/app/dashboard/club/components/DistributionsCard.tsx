"use client";

import { useMemo } from "react";
import { Distributions } from "@/types/clubInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * DistributionsCard Component
 *
 * Displays distribution analytics for clubs:
 * - Clubs by Teams Distribution (zero, oneToFive, sixToTen, elevenToTwenty, twentyOnePlus)
 * - Clubs by Competitions Distribution (zero, one, twoToThree, fourToSix, sevenPlus)
 * - Clubs by Associations Distribution (zero, one, twoToThree, fourPlus)
 * - Clubs by Account Coverage Distribution (withAccounts, withoutAccounts, withTrials)
 */
interface DistributionsCardProps {
  data: Distributions;
}

export default function DistributionsCard({ data }: DistributionsCardProps) {
  // Prepare data for teams distribution chart
  const teamsChartData = useMemo(() => {
    return [
      {
        name: "Zero",
        label: "Zero teams",
        value: data.clubsByTeams.zero,
      },
      {
        name: "1-5",
        label: "1-5 teams",
        value: data.clubsByTeams.oneToFive,
      },
      {
        name: "6-10",
        label: "6-10 teams",
        value: data.clubsByTeams.sixToTen,
      },
      {
        name: "11-20",
        label: "11-20 teams",
        value: data.clubsByTeams.elevenToTwenty,
      },
      {
        name: "21+",
        label: "21+ teams",
        value: data.clubsByTeams.twentyOnePlus,
      },
    ];
  }, [data.clubsByTeams]);

  // Prepare data for competitions distribution chart
  const competitionsChartData = useMemo(() => {
    return [
      {
        name: "Zero",
        label: "Zero competitions",
        value: data.clubsByCompetitions.zero,
      },
      {
        name: "One",
        label: "One competition",
        value: data.clubsByCompetitions.one,
      },
      {
        name: "2-3",
        label: "2-3 competitions",
        value: data.clubsByCompetitions.twoToThree,
      },
      {
        name: "4-6",
        label: "4-6 competitions",
        value: data.clubsByCompetitions.fourToSix,
      },
      {
        name: "7+",
        label: "7+ competitions",
        value: data.clubsByCompetitions.sevenPlus,
      },
    ];
  }, [data.clubsByCompetitions]);

  // Prepare data for associations distribution chart
  const associationsChartData = useMemo(() => {
    return [
      {
        name: "Zero",
        label: "Zero associations",
        value: data.clubsByAssociations.zero,
      },
      {
        name: "One",
        label: "One association",
        value: data.clubsByAssociations.one,
      },
      {
        name: "2-3",
        label: "2-3 associations",
        value: data.clubsByAssociations.twoToThree,
      },
      {
        name: "4+",
        label: "4+ associations",
        value: data.clubsByAssociations.fourPlus,
      },
    ];
  }, [data.clubsByAssociations]);

  // Prepare data for account coverage pie chart
  const accountCoverageChartData = useMemo(() => {
    return [
      {
        name: "With Accounts",
        value: data.clubsByAccountCoverage.withAccounts,
      },
      {
        name: "Without Accounts",
        value: data.clubsByAccountCoverage.withoutAccounts,
      },
      {
        name: "With Trials",
        value: data.clubsByAccountCoverage.withTrials,
      },
    ].filter((item) => item.value > 0); // Only show segments with data
  }, [data.clubsByAccountCoverage]);

  // Create chart configs
  const teamsChartConfig: ChartConfig = {
    value: {
      label: "Clubs",
      color: "hsl(var(--chart-1))",
    },
  };

  const competitionsChartConfig: ChartConfig = {
    value: {
      label: "Clubs",
      color: "hsl(var(--chart-2))",
    },
  };

  const associationsChartConfig: ChartConfig = {
    value: {
      label: "Clubs",
      color: "hsl(var(--chart-3))",
    },
  };

  // Create chart config for account coverage pie chart
  const accountCoverageChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    accountCoverageChartData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [accountCoverageChartData]);

  return (
    <div className="space-y-6">
      {/* Charts Grid Layout - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teams Distribution Chart */}
        <ChartCard
          title="Clubs by Teams"
          description="Number of clubs by team count"
          chartConfig={teamsChartConfig}
          chartClassName="h-[300px]"
        >
          <BarChart data={teamsChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatNumber(value), "Clubs"]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>

        {/* Competitions Distribution Chart */}
        <ChartCard
          title="Clubs by Competitions"
          description="Number of clubs by competition count"
          chartConfig={competitionsChartConfig}
          chartClassName="h-[300px]"
        >
          <BarChart data={competitionsChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatNumber(value), "Clubs"]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>

        {/* Associations Distribution Chart */}
        <ChartCard
          title="Clubs by Associations"
          description="Number of clubs by association count"
          chartConfig={associationsChartConfig}
          chartClassName="h-[300px]"
        >
          <BarChart data={associationsChartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatNumber(value)}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatNumber(value), "Clubs"]}
            />
            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>

        {/* Account Coverage Distribution Pie Chart */}
        {accountCoverageChartData.length > 0 ? (
          <ChartCard
            title="Clubs by Account Coverage"
            description="Distribution of clubs by account coverage"
            chartConfig={accountCoverageChartConfig}
            chartClassName="h-[300px]"
            emptyStateMessage="No account coverage data available"
          >
            <PieChart>
              <Pie
                data={accountCoverageChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${formatPercentage(percent * 100)}`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {accountCoverageChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      accountCoverageChartConfig[entry.name]?.color ||
                      `hsl(var(--chart-${(index % 5) + 1}))`
                    }
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  formatNumber(value),
                  accountCoverageChartConfig[
                    name as keyof typeof accountCoverageChartConfig
                  ]?.label || name,
                ]}
              />
            </PieChart>
          </ChartCard>
        ) : null}
      </div>
    </div>
  );
}
