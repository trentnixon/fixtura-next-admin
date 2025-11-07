"use client";

import { useMemo } from "react";
import { ContactFormSubmission } from "@/types/contact-form";
import StatCard from "@/components/ui-library/metrics/StatCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

interface ContactFormStatsProps {
  submissions: ContactFormSubmission[];
}

/**
 * Contact Form Stats Component
 *
 * Displays statistics cards and charts for contact form submissions.
 * Shows overview metrics, status distributions, and time-based trends.
 */
export default function ContactFormStats({
  submissions,
}: ContactFormStatsProps) {
  // Calculate stats
  const stats = useMemo(() => {
    const total = submissions.length;
    const seen = submissions.filter((s) => s.hasSeen).length;
    const unseen = total - seen;
    const acknowledged = submissions.filter((s) => s.Acknowledged).length;
    const notAcknowledged = total - acknowledged;

    // Recent submissions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recent = submissions.filter((s) => {
      if (!s.timestamp) return false;
      const date = new Date(s.timestamp);
      return date >= sevenDaysAgo;
    }).length;

    // Age distribution
    const ageDistribution = {
      fresh: 0, // 0-1 days
      recent: 0, // 2-7 days
      stale: 0, // 8-30 days
      veryStale: 0, // 31+ days
    };

    submissions.forEach((s) => {
      if (!s.timestamp) {
        ageDistribution.veryStale++;
        return;
      }
      const date = new Date(s.timestamp);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) ageDistribution.fresh++;
      else if (diffDays <= 7) ageDistribution.recent++;
      else if (diffDays <= 30) ageDistribution.stale++;
      else ageDistribution.veryStale++;
    });

    // Submissions over time (last 2 years)
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const recentSubmissions = submissions.filter((s) => {
      if (!s.timestamp) return false;
      const date = new Date(s.timestamp);
      return date >= twoYearsAgo;
    });

    // Group by month for better readability over 2 years
    const submissionsByMonth: Record<string, number> = {};
    recentSubmissions.forEach((s) => {
      if (!s.timestamp) return;
      const date = new Date(s.timestamp);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
      submissionsByMonth[monthKey] = (submissionsByMonth[monthKey] || 0) + 1;
    });

    // Convert to array for chart
    const submissionsOverTime = Object.entries(submissionsByMonth)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });

    // Submissions by hour of day (0-23)
    const submissionsByHour: Record<number, number> = {};
    submissions.forEach((s) => {
      if (!s.timestamp) return;
      const date = new Date(s.timestamp);
      const hour = date.getHours(); // Already rounded down to nearest hour (0-23)
      submissionsByHour[hour] = (submissionsByHour[hour] || 0) + 1;
    });

    // Convert to array for chart, ensuring all 24 hours are represented
    const submissionsByHourArray = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      hourLabel: `${hour.toString().padStart(2, "0")}:00`,
      count: submissionsByHour[hour] || 0,
    }));

    return {
      total,
      seen,
      unseen,
      acknowledged,
      notAcknowledged,
      recent,
      ageDistribution,
      submissionsOverTime,
      submissionsByHour: submissionsByHourArray,
    };
  }, [submissions]);

  // Chart configurations
  const pieChartConfig: ChartConfig = {
    seen: {
      label: "Seen",
      color: "hsl(var(--chart-1))",
    },
    unseen: {
      label: "Unseen",
      color: "hsl(var(--chart-2))",
    },
    acknowledged: {
      label: "Acknowledged",
      color: "hsl(var(--chart-1))",
    },
    notAcknowledged: {
      label: "Not Acknowledged",
      color: "hsl(var(--chart-2))",
    },
  };

  const barChartConfig: ChartConfig = {
    count: {
      label: "Submissions",
      color: "hsl(var(--chart-1))",
    },
  };

  const hourChartConfig: ChartConfig = {
    count: {
      label: "Submissions",
      color: "hsl(var(--chart-1))",
    },
  };

  const ageChartConfig: ChartConfig = {
    fresh: {
      label: "Fresh (0-1 days)",
      color: "hsl(142, 76%, 36%)", // green-600
    },
    recent: {
      label: "Recent (2-7 days)",
      color: "hsl(45, 93%, 47%)", // yellow-500
    },
    stale: {
      label: "Stale (8-30 days)",
      color: "hsl(25, 95%, 53%)", // orange-500
    },
    veryStale: {
      label: "Very Stale (31+ days)",
      color: "hsl(0, 84%, 60%)", // red-500
    },
  };

  // Pie chart data
  const seenPieData = [
    { name: "Seen", value: stats.seen, color: "hsl(142, 76%, 36%)" },
    { name: "Unseen", value: stats.unseen, color: "hsl(217, 91%, 60%)" },
  ];

  const acknowledgedPieData = [
    {
      name: "Acknowledged",
      value: stats.acknowledged,
      color: "hsl(142, 76%, 36%)",
    },
    {
      name: "Not Acknowledged",
      value: stats.notAcknowledged,
      color: "hsl(217, 91%, 60%)",
    },
  ];

  // Age distribution bar chart data
  const ageBarData = [
    {
      category: "Fresh",
      count: stats.ageDistribution.fresh,
      color: "hsl(142, 76%, 36%)",
    },
    {
      category: "Recent",
      count: stats.ageDistribution.recent,
      color: "hsl(45, 93%, 47%)",
    },
    {
      category: "Stale",
      count: stats.ageDistribution.stale,
      color: "hsl(25, 95%, 53%)",
    },
    {
      category: "Very Stale",
      count: stats.ageDistribution.veryStale,
      color: "hsl(0, 84%, 60%)",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <MetricGrid columns={4} gap="md">
        <StatCard
          title="Total Submissions"
          value={stats.total}
          icon={<Mail className="w-5 h-5" />}
          description={`${stats.recent} in last 7 days`}
          variant="primary"
        />
        <StatCard
          title="Unseen"
          value={stats.unseen}
          icon={<EyeOff className="w-5 h-5" />}
          description={`${stats.total > 0 ? Math.round((stats.unseen / stats.total) * 100) : 0}% of total`}
          variant={stats.unseen > 0 ? "accent" : "light"}
        />
        <StatCard
          title="Acknowledged"
          value={stats.acknowledged}
          icon={<CheckCircle2 className="w-5 h-5" />}
          description={`${stats.total > 0 ? Math.round((stats.acknowledged / stats.total) * 100) : 0}% of total`}
          variant="secondary"
        />
        <StatCard
          title="Recent (7 days)"
          value={stats.recent}
          icon={<TrendingUp className="w-5 h-5" />}
          description="New submissions"
          variant="light"
        />
      </MetricGrid>

      {/* Charts Grid */}
      <MetricGrid columns={2} gap="lg">
        {/* Seen vs Unseen Pie Chart */}
        <ChartCard
          title="Seen Status"
          description="Distribution of seen vs unseen submissions"
          icon={Eye}
          chartConfig={pieChartConfig}
          chartClassName="h-[250px]"
        >
          <PieChart>
            <Pie
              data={seenPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {seenPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartCard>

        {/* Acknowledged vs Not Acknowledged Pie Chart */}
        <ChartCard
          title="Acknowledged Status"
          description="Distribution of acknowledged vs not acknowledged submissions"
          icon={CheckCircle2}
          chartConfig={pieChartConfig}
          chartClassName="h-[250px]"
        >
          <PieChart>
            <Pie
              data={acknowledgedPieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {acknowledgedPieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartCard>
      </MetricGrid>

      {/* Age Distribution and Time Series Charts */}
      <MetricGrid columns={2} gap="lg">
        {/* Age Distribution Bar Chart */}
        <ChartCard
          title="Age Distribution"
          description="Distribution of submissions by age (days)"
          icon={Clock}
          chartConfig={ageChartConfig}
          chartClassName="h-[250px]"
        >
          <BarChart data={ageBarData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {ageBarData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartCard>

        {/* Submissions Over Time Line Chart */}
        <ChartCard
          title="Submissions Over Time"
          description="Monthly submissions for the last 2 years"
          icon={Calendar}
          chartConfig={barChartConfig}
          chartClassName="h-[250px]"
        >
          {stats.submissionsOverTime.length > 0 ? (
            <LineChart data={stats.submissionsOverTime}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              />
            </LineChart>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No submissions in the last 2 years
            </div>
          )}
        </ChartCard>
      </MetricGrid>

      {/* Time of Day Chart */}
      <MetricGrid columns={1} gap="lg">
        <ChartCard
          title="Submissions by Time of Day"
          description="Distribution of submissions by hour of day (24-hour format)"
          icon={Clock}
          chartConfig={hourChartConfig}
          chartClassName="h-[300px]"
        >
          {stats.submissionsByHour.some((h) => h.count > 0) ? (
            <BarChart data={stats.submissionsByHour}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="hourLabel"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="count"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No submission timestamps available
            </div>
          )}
        </ChartCard>
      </MetricGrid>
    </div>
  );
}

