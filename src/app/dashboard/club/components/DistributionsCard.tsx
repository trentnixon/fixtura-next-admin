"use client";

import { useMemo } from "react";
import { Distributions } from "@/types/clubInsights";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
    ].filter((item) => item.value > 0);
  }, [data.clubsByAccountCoverage]);

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
      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Clubs by Teams"
          description="Number of clubs by team count"
          chartConfig={teamsChartConfig}
          chartClassName="h-[260px]"
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

        <ChartCard
          title="Clubs by Competitions"
          description="Number of clubs by competition count"
          chartConfig={competitionsChartConfig}
          chartClassName="h-[260px]"
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

        <ChartCard
          title="Clubs by Associations"
          description="Number of clubs by association count"
          chartConfig={associationsChartConfig}
          chartClassName="h-[260px]"
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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {accountCoverageChartData.length > 0 ? (
          <ChartCard
            title="Clubs by Account Coverage"
            description="Distribution of clubs by account coverage"
            chartConfig={accountCoverageChartConfig}
            chartClassName="h-[260px]"
            emptyStateMessage="No account coverage data available"
            cardClassName="lg:col-span-2"
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

        <BucketTable title="Team Buckets" rows={teamsChartData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BucketTable title="Competition Buckets" rows={competitionsChartData} />
        <BucketTable title="Association Buckets" rows={associationsChartData} />
        <BucketTable title="Account Coverage" rows={accountCoverageChartData} />
      </div>
    </div>
  );
}

function BucketTable({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ name: string; label?: string; value: number }>;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Bucket</TableHead>
            <TableHead className="text-right">Clubs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell className="text-sm font-medium text-slate-900">
                {row.label ?? row.name}
              </TableCell>
              <TableCell className="text-right">
                {row.value.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
