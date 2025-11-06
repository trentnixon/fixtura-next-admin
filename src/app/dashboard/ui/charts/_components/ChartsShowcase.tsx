"use client";

import ChartContainerShowcase from "./_elements/ChartContainerShowcase";
import ChartLayoutsShowcase from "./_elements/ChartLayoutsShowcase";
import ChartCardShowcase from "./_elements/ChartCardShowcase";
import ChartFormattingShowcase from "./_elements/ChartFormattingShowcase";
import ChartSummaryStatsShowcase from "./_elements/ChartSummaryStatsShowcase";
import ChartColorPalettesShowcase from "./_elements/ChartColorPalettesShowcase";
import BarChartShowcase from "./_elements/BarChartShowcase";
import MultiBarChartShowcase from "./_elements/MultiBarChartShowcase";
import LineChartShowcase from "./_elements/LineChartShowcase";
import MultipleLineChartShowcase from "./_elements/MultipleLineChartShowcase";
import StackedLineChartShowcase from "./_elements/StackedLineChartShowcase";
import PieChartShowcase from "./_elements/PieChartShowcase";

/**
 * Charts Showcase Component
 *
 * Displays all chart-related components, containers, and layouts
 */
export default function ChartsShowcase() {
  return (
    <>
      <ChartContainerShowcase />
      <ChartCardShowcase />
      <ChartSummaryStatsShowcase />
      <ChartColorPalettesShowcase />
      <ChartFormattingShowcase />
      <BarChartShowcase />
      <MultiBarChartShowcase />
      <LineChartShowcase />
      <MultipleLineChartShowcase />
      <StackedLineChartShowcase />
      <PieChartShowcase />
      <ChartLayoutsShowcase />
    </>
  );
}
