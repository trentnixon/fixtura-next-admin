"use client";

import { Render } from "@/types/fixturaContentHubAccountDetails";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  Clock,
  Calendar,
  TrendingUp,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

interface RenderChartsProps {
  renders: Render[];
}

// Parse formatted date string (reuse logic from ListRendersInTable)
const parseFormattedDate = (dateStr: string, timeStr: string): Date | null => {
  try {
    const withoutDayOfWeek = dateStr.replace(
      /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/i,
      ""
    );
    const match = withoutDayOfWeek.match(/^(\d+)(st|nd|rd|th)\s+(.+)$/i);
    if (!match) return null;

    const day = parseInt(match[1], 10);
    const monthName = match[3].trim();
    const monthMap: Record<string, number> = {
      january: 0,
      february: 1,
      march: 2,
      april: 3,
      may: 4,
      june: 5,
      july: 6,
      august: 7,
      september: 8,
      october: 9,
      november: 10,
      december: 11,
    };

    const month = monthMap[monthName.toLowerCase()];
    if (month === undefined) return null;

    const now = new Date();
    const currentYear = now.getFullYear();
    let year = currentYear;
    const testDate = new Date(year, month, day);

    if (
      testDate > now &&
      testDate.getTime() - now.getTime() > 30 * 24 * 60 * 60 * 1000
    ) {
      year = currentYear - 1;
    }

    let hours = 0;
    let minutes = 0;
    if (timeStr) {
      const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      if (timeMatch) {
        hours = parseInt(timeMatch[1], 10);
        minutes = parseInt(timeMatch[2], 10);
      }
    }

    const parsedDate = new Date(year, month, day, hours, minutes);
    if (isNaN(parsedDate.getTime())) return null;

    const yearsDiff =
      (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearsDiff > 10 || yearsDiff < -1) return null;

    return parsedDate;
  } catch {
    return null;
  }
};

export default function RenderCharts({ renders }: RenderChartsProps) {
  // Process renders data
  const processedRenders = renders
    .map((render) => {
      const date = parseFormattedDate(render.created, render.time);
      if (!date) return null;

      // Extract day of week
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });

      // Extract hour of day
      const hour = date.getHours();

      // Extract month-year for grouping
      const monthYear = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      return {
        ...render,
        parsedDate: date,
        dayOfWeek,
        hour,
        monthYear,
      };
    })
    .filter((r) => r !== null) as Array<
    Render & {
      parsedDate: Date;
      dayOfWeek: string;
      hour: number;
      monthYear: string;
    }
  >;

  if (processedRenders.length === 0) {
    return null;
  }

  // 1. Time of Day Chart (Line chart showing renders by hour)
  const timeOfDayData = Array.from({ length: 24 }, (_, hour) => {
    const count = processedRenders.filter((r) => r.hour === hour).length;
    // Format hour with AM/PM
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour < 12 ? "AM" : "PM";
    const hourLabel = `${hour12}:00 ${ampm}`;
    return {
      hour: hourLabel,
      hourNum: hour,
      count,
    };
  });

  const timeOfDayConfig = {
    count: {
      label: "Renders",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const peakHour = timeOfDayData.reduce(
    (max, item) => (item.count > max.count ? item : max),
    timeOfDayData[0]
  );
  const totalRenders = processedRenders.length;
  const avgPerHour = totalRenders / 24;

  const timeOfDayStats: ChartSummaryStat[] = [
    {
      icon: Clock,
      label: "Peak Hour",
      value: peakHour.hour,
    },
    {
      icon: TrendingUp,
      label: "Total Renders",
      value: formatNumber(totalRenders),
    },
    {
      icon: Clock,
      label: "Avg/Hour",
      value: formatNumber(Math.round(avgPerHour * 10) / 10),
    },
  ];

  // 2. Day of Week Pie Chart
  const dayOfWeekCounts: Record<string, number> = {};
  processedRenders.forEach((render) => {
    dayOfWeekCounts[render.dayOfWeek] =
      (dayOfWeekCounts[render.dayOfWeek] || 0) + 1;
  });

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayOfWeekData = dayOrder
    .map((day) => ({
      name: day.substring(0, 3), // Short form: Mon, Tue, etc.
      fullName: day,
      value: dayOfWeekCounts[day] || 0,
    }))
    .filter((item) => item.value > 0);

  const dayOfWeekConfig: ChartConfig = {};
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
  ];

  dayOfWeekData.forEach((item, index) => {
    dayOfWeekConfig[item.fullName] = {
      label: item.fullName,
      color: COLORS[index % COLORS.length],
    };
  });

  const totalDayOfWeek = dayOfWeekData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const topDay = dayOfWeekData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    dayOfWeekData[0]
  );
  const topDayPercentage =
    totalDayOfWeek > 0 ? (topDay.value / totalDayOfWeek) * 100 : 0;

  const dayOfWeekStats: ChartSummaryStat[] = [
    {
      icon: Calendar,
      label: "Total",
      value: formatNumber(totalDayOfWeek),
    },
    {
      icon: Calendar,
      label: "Top Day",
      value: topDay.fullName,
    },
    {
      icon: TrendingUp,
      label: "Top %",
      value: formatPercentage(topDayPercentage),
    },
  ];

  // 3. Completion Rate Over Time (Monthly)
  const monthlyData: Record<string, { total: number; complete: number }> = {};
  processedRenders.forEach((render) => {
    if (!monthlyData[render.monthYear]) {
      monthlyData[render.monthYear] = { total: 0, complete: 0 };
    }
    monthlyData[render.monthYear].total++;
    if (render.Complete) {
      monthlyData[render.monthYear].complete++;
    }
  });

  const completionOverTimeData = Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      complete: data.complete,
      incomplete: data.total - data.complete,
      completionRate: data.total > 0 ? (data.complete / data.total) * 100 : 0,
    }))
    .sort((a, b) => {
      // Sort by date
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  const completionConfig = {
    complete: {
      label: "Complete",
      color: "hsl(var(--chart-1))",
    },
    incomplete: {
      label: "Incomplete",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const overallComplete = processedRenders.filter((r) => r.Complete).length;
  const overallIncomplete = processedRenders.length - overallComplete;
  const overallCompletionRate =
    processedRenders.length > 0
      ? (overallComplete / processedRenders.length) * 100
      : 0;

  const completionStats: ChartSummaryStat[] = [
    {
      icon: CheckCircle,
      label: "Complete",
      value: formatNumber(overallComplete),
    },
    {
      icon: XCircle,
      label: "Incomplete",
      value: formatNumber(overallIncomplete),
    },
    {
      icon: TrendingUp,
      label: "Success Rate",
      value: formatPercentage(overallCompletionRate),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Time of Day Chart */}
      <ChartCard
        title="Renders by Time of Day"
        description="Distribution of renders throughout the day"
        summaryStats={timeOfDayStats}
        chartConfig={timeOfDayConfig}
        icon={Clock}
      >
        <LineChart data={timeOfDayData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" tick={{ fontSize: 12 }} interval={2} />
          <YAxis tick={{ fontSize: 12 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--chart-1))"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ChartCard>

      {/* Day of Week Pie Chart */}
      <ChartCard
        title="Renders by Day of Week"
        description="Distribution of renders across days"
        summaryStats={dayOfWeekStats}
        chartConfig={dayOfWeekConfig}
        icon={Calendar}
      >
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={dayOfWeekData}
            dataKey="value"
            nameKey="fullName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {dayOfWeekData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartCard>

      {/* Completion Rate Over Time */}
      {completionOverTimeData.length > 0 && (
        <ChartCard
          title="Completion Rate Over Time"
          description="Render completion status by month"
          summaryStats={completionStats}
          chartConfig={completionConfig}
          icon={TrendingUp}
          cardClassName="lg:col-span-2"
        >
          <BarChart data={completionOverTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="complete"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="incomplete"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartCard>
      )}
    </div>
  );
}
