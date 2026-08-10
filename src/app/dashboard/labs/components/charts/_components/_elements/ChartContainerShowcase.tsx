"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import { basicChartConfig, sampleBarData } from "./chartSampleData";

function SampleBarChart({ data = sampleBarData.slice(0, 5) }) {
  return (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="value" fill="var(--color-value)" />
    </BarChart>
  );
}

/**
 * ChartContainer showcase — wrapper with responsive sizing and theme support
 */
export default function ChartContainerShowcase() {
  return (
    <SectionContainer
      title="Chart Container"
      description="Wrapper component for chart components with responsive sizing and theme support"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Basic</SubsectionTitle>
            <span className="text-xs text-muted-foreground">h-[300px]</span>
          </div>
          <ChartContainer config={basicChartConfig} className="h-[300px]">
            <SampleBarChart />
          </ChartContainer>
          <ComponentRef token={CHART_TOKENS.container.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Custom Height</SubsectionTitle>
            <span className="text-xs text-muted-foreground">h-[200px]</span>
          </div>
          <ChartContainer config={basicChartConfig} className="h-[200px]">
            <SampleBarChart />
          </ChartContainer>
          <ComponentRef token={CHART_TOKENS.container.customHeight} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Elevated</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant elevated</span>
          </div>
          <ChartContainer
            config={basicChartConfig}
            variant="elevated"
            className="h-[200px]"
          >
            <SampleBarChart />
          </ChartContainer>
          <ComponentRef token={CHART_TOKENS.container.elevated} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Configuration</SubsectionTitle>
            <span className="text-xs text-muted-foreground">ChartConfig type</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Pass a <code className="text-xs">config</code> prop mapping data keys
            to labels and colors for theme-aware chart styling.
          </p>
          <ComponentRef
            token={CHART_TOKENS.container.config}
            note="ChartConfig: label, color, optional icon"
          />
        </div>
      </div>
    </SectionContainer>
  );
}
