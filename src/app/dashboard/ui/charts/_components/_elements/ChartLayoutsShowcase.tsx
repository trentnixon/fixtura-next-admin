"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import CodeExample from "./CodeExample";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * Chart Layouts Showcase
 *
 * Displays different layout patterns for charts
 */
export default function ChartLayoutsShowcase() {
  const sampleData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
  ];

  const chartConfig = {
    value: {
      label: "Value",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <SectionContainer
      title="Chart Layouts"
      description="Different layout patterns for organizing charts in your application"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Single Chart Layout"
          subtitle="Single chart taking full width"
        >
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" />
            </BarChart>
          </ChartContainer>
          <div className="mt-6">
            <CodeExample
              code={`<ChartContainer config={chartConfig} className="h-[300px] w-full">
  {/* Chart content */}
</ChartContainer>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Grid Layout - 2 Columns"
          subtitle="Charts arranged in a 2-column grid"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <ChartContainer config={chartConfig} className="h-[250px]">
    {/* Chart content */}
  </ChartContainer>
  <ChartContainer config={chartConfig} className="h-[250px]">
    {/* Chart content */}
  </ChartContainer>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Grid Layout - 3 Columns"
          subtitle="Charts arranged in a 3-column grid"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--color-value)" />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <ChartContainer config={chartConfig} className="h-[200px]">
    {/* Chart content */}
  </ChartContainer>
  <ChartContainer config={chartConfig} className="h-[200px]">
    {/* Chart content */}
  </ChartContainer>
  <ChartContainer config={chartConfig} className="h-[200px]">
    {/* Chart content */}
  </ChartContainer>
</div>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Responsive Layout"
          subtitle="Charts that adapt to different screen sizes"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-[200px]">
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartContainer>
            </div>
            <div className="space-y-4">
              <ChartContainer config={chartConfig} className="h-[200px]">
                <BarChart data={sampleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Responsive: 1 column on mobile, 2 columns on large screens */}
  <ChartContainer config={chartConfig} className="h-[200px]">
    {/* Chart content */}
  </ChartContainer>
</div>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
