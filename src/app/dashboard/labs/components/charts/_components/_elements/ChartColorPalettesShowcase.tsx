"use client";

import type { ReactNode } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { ChartContainer } from "@/components/ui/chart";
import { SubsectionTitle } from "@/components/type/titles";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import { sampleBarData } from "./chartSampleData";
import {
  getBrandThemeColorArray,
  getPrimaryShadesColorArray,
  getStandardChartColorArray,
  getChartConfigByPalette,
  brandThemeColors,
  primaryShadesColors,
  standardChartColors,
} from "@/utils/chart-colors";

function PaletteSwatches({
  colors,
  labels,
}: {
  colors: string[];
  labels: ReactNode[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color, index) => (
        <div key={index} className="flex items-center gap-2 p-2 border rounded">
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs">{labels[index] ?? `Color ${index + 1}`}</span>
        </div>
      ))}
    </div>
  );
}

function MiniBarChart({ fill }: { fill: string }) {
  return (
    <BarChart data={sampleBarData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar dataKey="value" fill={fill} radius={[4, 4, 0, 0]} />
    </BarChart>
  );
}

/**
 * Chart color palette showcase — brand, primary shades, and standard colors
 */
export default function ChartColorPalettesShowcase() {
  const brandThemeConfig = getChartConfigByPalette("brand-theme");
  const primaryShadesConfig = getChartConfigByPalette("primary-shades");
  const standardConfig = getChartConfigByPalette("standard");
  const brandColors = getBrandThemeColorArray();

  return (
    <SectionContainer
      title="Chart Color Palettes"
      description="Different color palette options for charts"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Theme</SubsectionTitle>
            <span className="text-xs text-muted-foreground">brand-theme palette</span>
          </div>
          <div className="space-y-4">
            <PaletteSwatches
              colors={brandColors}
              labels={Object.values(brandThemeColors).map((c) => c.label)}
            />
            <ChartContainer config={brandThemeConfig} className="h-[200px]">
              <MiniBarChart fill={brandColors[0]} />
            </ChartContainer>
          </div>
          <ComponentRef token={CHART_TOKENS.palette.brandTheme} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Primary Shades</SubsectionTitle>
            <span className="text-xs text-muted-foreground">primary-shades palette</span>
          </div>
          <div className="space-y-4">
            <PaletteSwatches
              colors={getPrimaryShadesColorArray()}
              labels={Object.values(primaryShadesColors).map((c) => c.label)}
            />
            <ChartContainer config={primaryShadesConfig} className="h-[200px]">
              <MiniBarChart fill={getPrimaryShadesColorArray()[2]} />
            </ChartContainer>
          </div>
          <ComponentRef token={CHART_TOKENS.palette.primaryShades} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Standard</SubsectionTitle>
            <span className="text-xs text-muted-foreground">--chart-1 … --chart-5</span>
          </div>
          <div className="space-y-4">
            <PaletteSwatches
              colors={getStandardChartColorArray()}
              labels={Object.values(standardChartColors).map((c) => c.label)}
            />
            <ChartContainer config={standardConfig} className="h-[200px]">
              <MiniBarChart fill={getStandardChartColorArray()[0]} />
            </ChartContainer>
          </div>
          <ComponentRef token={CHART_TOKENS.palette.standard} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Multi-Series</SubsectionTitle>
            <span className="text-xs text-muted-foreground">color array per series</span>
          </div>
          <ChartContainer config={brandThemeConfig} className="h-[200px]">
            <BarChart data={sampleBarData.slice(0, 4)}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="value" fill={brandColors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
          <ComponentRef token={CHART_TOKENS.palette.multiSeries} />
        </div>
      </div>
    </SectionContainer>
  );
}
