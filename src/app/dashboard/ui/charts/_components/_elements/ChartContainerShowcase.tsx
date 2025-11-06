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
 * Chart Container Showcase
 *
 * Displays examples of ChartContainer component usage
 */
export default function ChartContainerShowcase() {
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
      title="Chart Container"
      description="Wrapper component for chart components with responsive sizing and theme support"
    >
      <div className="space-y-6">
        <ElementContainer
          title="Basic Chart Container"
          subtitle="Simple bar chart wrapped in ChartContainer"
        >
          <ChartContainer config={chartConfig} className="h-[300px]">
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
              code={`import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

<ChartContainer config={chartConfig} className="h-[300px]">
  <BarChart data={sampleData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="value" fill="var(--color-value)" />
  </BarChart>
</ChartContainer>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Chart Container with Custom Height"
          subtitle="Chart containers support custom height via className"
        >
          <ChartContainer config={chartConfig} className="h-[200px]">
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
              code={`<ChartContainer config={chartConfig} className="h-[200px]">
  {/* Chart content */}
</ChartContainer>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer
          title="Chart Container Variants"
          subtitle="ChartContainer supports different background variants for elevated appearance"
        >
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Default Variant</h4>
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
              <div>
                <h4 className="text-sm font-medium mb-2">Elevated Variant</h4>
                <ChartContainer
                  config={chartConfig}
                  variant="elevated"
                  className="h-[200px]"
                >
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
                code={`// Default variant (transparent background)
<ChartContainer config={chartConfig} className="h-[200px]">
  {/* Chart content */}
</ChartContainer>

// Elevated variant (darker background, matches data insights pattern)
<ChartContainer config={chartConfig} variant="elevated" className="h-[200px]">
  {/* Chart content */}
</ChartContainer>`}
              />
            </div>
          </div>
        </ElementContainer>

        <ElementContainer
          title="Chart Container Configuration"
          subtitle="ChartConfig defines colors, labels, and themes for chart data"
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The ChartContainer requires a config prop that follows the ChartConfig type:
            </p>
            <CodeExample
              code={`type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<"light" | "dark", string> }
  );
}`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

