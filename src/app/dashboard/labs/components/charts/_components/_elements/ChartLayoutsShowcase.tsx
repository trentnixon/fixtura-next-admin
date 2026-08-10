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

function MiniChart({ className }: { className?: string }) {
  return (
    <ChartContainer config={basicChartConfig} className={className}>
      <BarChart data={sampleBarData.slice(0, 5)}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--color-value)" />
      </BarChart>
    </ChartContainer>
  );
}

/**
 * Chart layout showcase — grid patterns for organizing charts
 */
export default function ChartLayoutsShowcase() {
  return (
    <SectionContainer
      title="Chart Layouts"
      description="Different layout patterns for organizing charts in your application"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Single</SubsectionTitle>
            <span className="text-xs text-muted-foreground">full width</span>
          </div>
          <MiniChart className="h-[300px] w-full" />
          <ComponentRef token={CHART_TOKENS.layout.single} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>2-Column Grid</SubsectionTitle>
            <span className="text-xs text-muted-foreground">md:grid-cols-2</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MiniChart className="h-[250px]" />
            <MiniChart className="h-[250px]" />
          </div>
          <ComponentRef token={CHART_TOKENS.layout.grid2} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>3-Column Grid</SubsectionTitle>
            <span className="text-xs text-muted-foreground">md:grid-cols-3</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MiniChart className="h-[200px]" />
            <MiniChart className="h-[200px]" />
            <MiniChart className="h-[200px]" />
          </div>
          <ComponentRef token={CHART_TOKENS.layout.grid3} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Responsive</SubsectionTitle>
            <span className="text-xs text-muted-foreground">lg:grid-cols-2</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MiniChart className="h-[200px]" />
            <MiniChart className="h-[200px]" />
          </div>
          <ComponentRef token={CHART_TOKENS.layout.responsive} />
        </div>
      </div>
    </SectionContainer>
  );
}
