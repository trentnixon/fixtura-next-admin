import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, Clock, PieChart as PieChartIcon } from "lucide-react";

interface DistributionsSectionProps {
  statusChartData: Array<{ status: string; count: number }>;
  timingChartData: Array<{ timing: string; count: number }>;
  sizeCategoryChartData: Array<{ category: string; count: number }>;
  seasonChartData: Array<{ season: string; count: number }>;
  statusChartConfig: ChartConfig;
  timingChartConfig: ChartConfig;
  sizeCategoryChartConfig: ChartConfig;
  seasonChartConfig: ChartConfig;
}

export function DistributionsSection({
  statusChartData,
  timingChartData,
  sizeCategoryChartData,
  seasonChartData,
  statusChartConfig,
  timingChartConfig,
  sizeCategoryChartConfig,
  seasonChartConfig,
}: DistributionsSectionProps) {
  return (
    <SectionContainer
      title="Competition Distributions"
      description="Charts showing competition breakdowns by status, timing, size, and season."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <ChartCard
          title="Status Distribution"
          description="Competition counts grouped by current status."
          icon={PieChartIcon}
          chartConfig={statusChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusChartData}
                nameKey="status"
                dataKey="count"
                innerRadius={50}
                outerRadius={100}
                paddingAngle={4}
              >
                {statusChartData.map((entry, index) => (
                  <Cell
                    key={entry.status}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                  />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Competition Timing"
          description="Started vs upcoming competitions with unknowns."
          icon={Clock}
          chartConfig={timingChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timingChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="timing" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Size Categories"
          description="Competition volume by grade size bucket."
          icon={BarChart3}
          chartConfig={sizeCategoryChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sizeCategoryChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Competitions by Season"
          description="Seasonal breakdown of competitions returned by the API."
          icon={Activity}
          chartConfig={seasonChartConfig}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="season" />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </SectionContainer>
  );
}
