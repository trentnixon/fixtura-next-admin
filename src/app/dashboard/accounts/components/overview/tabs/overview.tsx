"use client";

import { CalendarIcon } from "lucide-react";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import MetricCard from "./components/metricCard";

export default function OverviewTab({
  accountData,
}: {
  accountData: fixturaContentHubAccountDetails;
  accountId?: number;
}) {
  // Metrics configuration array
  const metrics = [
    {
      title: "Total Downloads",
      value: accountData?.metricsOverTime.totalDownloads || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "Last Update: ",
    },
    {
      title: "Total AI Articles",
      value: accountData?.metricsOverTime.totalAiArticles || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "Last Update: ",
    },
    {
      title: "Total Grades",
      value: accountData?.metricsOverTime.totalGrades || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "Last Update: ",
    },
    {
      title: "Total Renders",
      value: accountData?.metricsOverTime.totalCompleteRenders || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: `Total Renders: ${accountData?.metricsOverTime.totalRenders}`,
    },

    {
      title: "Total Game Results",
      value: accountData?.metricsOverTime.totalGameResults || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "Last Update: ",
    },
    {
      title: "Total Upcoming Games",
      value: accountData?.metricsOverTime.totalUpcomingGames || "N/A",
      icon: <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />,
      lastUpdate: "Last Update: ",
    },
  ];

  return (
    <div className="col-span-12 gap-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            lastUpdate={metric.lastUpdate}
          />
        ))}
      </div>
    </div>
  );
}
