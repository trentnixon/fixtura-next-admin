"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartSummaryStats, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartSummaryStats";
import { SubsectionTitle } from "@/components/type/titles";
import { Clock, TrendingUp, Activity, BarChart3, MemoryStick } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { CHART_TOKENS } from "./chartTokens";
import { formatNumber, formatPercentage, formatDuration } from "@/utils/chart-formatters";

const stats2Col: ChartSummaryStat[] = [
  { icon: TrendingUp, label: "Total Sales", value: formatNumber(15420) },
  { icon: Activity, label: "Growth Rate", value: formatPercentage(12.5) },
];

const stats3Col: ChartSummaryStat[] = [
  { icon: Clock, label: "Avg Time", value: formatDuration(2.5, "seconds") },
  { icon: MemoryStick, label: "Avg Memory", value: "128MB" },
  { icon: BarChart3, label: "Total Requests", value: formatNumber(15420) },
];

const stats4Col: ChartSummaryStat[] = [
  { icon: TrendingUp, label: "Total Sales", value: formatNumber(15420) },
  { icon: Activity, label: "Active Users", value: formatNumber(1250) },
  { icon: BarChart3, label: "Conversion Rate", value: formatPercentage(3.2) },
  { icon: Clock, label: "Avg Session", value: formatDuration(180, "seconds") },
];

/**
 * ChartSummaryStats showcase — stat grids above charts
 */
export default function ChartSummaryStatsShowcase() {
  return (
    <SectionContainer
      title="Chart Summary Stats"
      description="Reusable component for displaying summary statistics above charts"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>2 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">columns=2</span>
          </div>
          <ChartSummaryStats stats={stats2Col} columns={2} />
          <ComponentRef token={CHART_TOKENS.summaryStats.cols2} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>3 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">columns=3</span>
          </div>
          <ChartSummaryStats stats={stats3Col} columns={3} />
          <ComponentRef token={CHART_TOKENS.summaryStats.cols3} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>4 Columns</SubsectionTitle>
            <span className="text-xs text-muted-foreground">columns=4 · default</span>
          </div>
          <ChartSummaryStats stats={stats4Col} columns={4} />
          <ComponentRef token={CHART_TOKENS.summaryStats.cols4} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>No Border</SubsectionTitle>
            <span className="text-xs text-muted-foreground">showBorder=false</span>
          </div>
          <ChartSummaryStats stats={stats2Col} showBorder={false} />
          <ComponentRef token={CHART_TOKENS.summaryStats.noBorder} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Without Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">label · value only</span>
          </div>
          <ChartSummaryStats
            stats={[
              { label: "Total", value: formatNumber(15420) },
              { label: "Average", value: formatNumber(3855) },
              { label: "Max", value: formatNumber(12500) },
              { label: "Min", value: formatNumber(500) },
            ]}
          />
          <ComponentRef token={CHART_TOKENS.summaryStats.noIcons} />
        </div>
      </div>
    </SectionContainer>
  );
}
