"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import { PieChart as PieChartIcon, Activity } from "lucide-react";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

/**
 * Pie Chart Showcase
 *
 * Displays examples of pie chart usage
 */
export default function PieChartShowcase() {
  const sampleData = [
    { name: "Product A", value: 400 },
    { name: "Product B", value: 300 },
    { name: "Product C", value: 200 },
    { name: "Product D", value: 278 },
    { name: "Product E", value: 189 },
  ];

  const chartConfig = {
    "Product A": {
      label: "Product A",
      color: "hsl(var(--chart-1))",
    },
    "Product B": {
      label: "Product B",
      color: "hsl(var(--chart-2))",
    },
    "Product C": {
      label: "Product C",
      color: "hsl(var(--chart-3))",
    },
    "Product D": {
      label: "Product D",
      color: "hsl(var(--chart-4))",
    },
    "Product E": {
      label: "Product E",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  const total = sampleData.reduce((sum, item) => sum + item.value, 0);
  const maxValue = Math.max(...sampleData.map((item) => item.value));
  const maxItem = sampleData.find((item) => item.value === maxValue);
  const maxPercentage = (maxValue / total) * 100;

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: PieChartIcon,
      label: "Total",
      value: formatNumber(total),
    },
    {
      icon: Activity,
      label: "Top Item",
      value: maxItem?.name || "N/A",
    },
    {
      icon: PieChartIcon,
      label: "Top %",
      value: formatPercentage(maxPercentage),
    },
  ];

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <SectionContainer
      title="Pie Charts"
      description="Pie chart examples showing proportional data"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic Pie Chart"
          subtitle="Simple pie chart with ChartCard"
        >
          <ChartCard
            title="Sales Distribution"
            description="Sales by product category"
            icon={PieChartIcon}
            chartConfig={chartConfig}
            summaryStats={summaryStats}
          >
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
                fill="#8884d8"
                dataKey="value"
              >
                {sampleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`import ChartCard from "@/components/modules/charts/ChartCard";
import { PieChart, Pie, Cell } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
];

const chartConfig = {
  "Product A": {
    label: "Product A",
    color: "hsl(var(--chart-1))",
  },
  // ... other products
} satisfies ChartConfig;

<ChartCard
  title="Sales Distribution"
  chartConfig={chartConfig}
>
  <PieChart>
    <Pie
      data={data}
      cx="50%"
      cy="50%"
      outerRadius={100}
      dataKey="value"
      label={({ name, percent }) => \`\${name}: \${formatPercentage(percent * 100)}\`}
    >
      {data.map((entry, index) => (
        <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <ChartTooltip content={<ChartTooltipContent />} />
  </PieChart>
</ChartCard>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Donut Chart"
          subtitle="Pie chart with inner radius to create donut chart"
        >
          <ChartCard
            title="Market Share"
            description="Market share by segment"
            chartConfig={chartConfig}
          >
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
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {sampleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
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
          </ChartCard>
          <div className="mt-6">
            <CodeExample
              code={`<PieChart>
  <Pie
    data={data}
    cx="50%"
    cy="50%"
    outerRadius={100}
    innerRadius={60} // Inner radius creates donut effect
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
</PieChart>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
