"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { PieChart, Pie, Cell } from "recharts";
import { PieChart as PieChartIcon, Activity } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

const sampleData = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 278 },
  { name: "Product E", value: 189 },
];

const chartConfig = {
  "Product A": { label: "Product A", color: "hsl(var(--chart-1))" },
  "Product B": { label: "Product B", color: "hsl(var(--chart-2))" },
  "Product C": { label: "Product C", color: "hsl(var(--chart-3))" },
  "Product D": { label: "Product D", color: "hsl(var(--chart-4))" },
  "Product E": { label: "Product E", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const total = sampleData.reduce((sum, item) => sum + item.value, 0);
const maxValue = Math.max(...sampleData.map((item) => item.value));
const maxItem = sampleData.find((item) => item.value === maxValue);

const summaryStats: ChartSummaryStat[] = [
  { icon: PieChartIcon, label: "Total", value: formatNumber(total) },
  { icon: Activity, label: "Top Item", value: maxItem?.name || "N/A" },
  {
    icon: PieChartIcon,
    label: "Top %",
    value: formatPercentage((maxValue / total) * 100),
  },
];

function PieChartContent({ innerRadius = 0 }: { innerRadius?: number }) {
  return (
    <PieChart>
      <Pie
        data={sampleData}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) =>
          `${name}: ${formatPercentage(percent * 100)}`
        }
        outerRadius={100}
        innerRadius={innerRadius}
        fill="#8884d8"
        dataKey="value"
      >
        {sampleData.map((entry, index) => (
          <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <ChartTooltip
        content={<ChartTooltipContent />}
        formatter={(value: number, name: string) => [
          formatNumber(value),
          chartConfig[name as keyof typeof chartConfig]?.label || name,
        ]}
      />
    </PieChart>
  );
}

/**
 * Pie chart showcase — pie and donut charts
 */
export default function PieChartShowcase() {
  return (
    <SectionContainer
      title="Pie Charts"
      description="Pie chart examples showing proportional data"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">labels · tooltip</span>
          </div>
          <ChartCard
            title="Sales Distribution"
            description="Sales by product category"
            icon={PieChartIcon}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
            <PieChartContent />
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.pie.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Donut</SubsectionTitle>
            <span className="text-xs text-muted-foreground">innerRadius=60</span>
          </div>
          <ChartCard
            title="Market Share"
            description="Market share by segment"
            chartConfig={chartConfig}
          >
            <PieChartContent innerRadius={60} />
          </ChartCard>
          <ComponentRef token={CHART_TOKENS.pie.donut} />
        </div>
      </div>
    </SectionContainer>
  );
}
