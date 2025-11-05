"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Database,
  AlertCircle,
  Clock,
  MemoryStick,
  XCircle,
  Calendar,
} from "lucide-react";
import {
  formatDuration,
  formatMemory,
  formatPercentage,
  formatDate,
} from "../utils/formatters";

interface SummaryCardsProps {
  data: GlobalInsightsData;
}

/**
 * SummaryCards Component
 *
 * Displays key summary metrics for global data collection insights in a table format.
 * Shows: Total Collections, Error Rate, Incomplete Collections, Average Time, Average Memory, Date Range.
 */
export default function SummaryCards({ data }: SummaryCardsProps) {
  const summary = data.summary;
  const { earliest, latest } = summary.dateRange;

  const metrics = [
    {
      title: "Total Collections",
      value: summary.totalCollections?.toLocaleString() || "0",
      icon: Database,
      iconColor: "text-blue-500",
      details: `${summary.collectionsWithErrors || 0} with errors`,
    },
    {
      title: "Error Rate",
      value: formatPercentage(summary.errorRate),
      icon: AlertCircle,
      iconColor: "text-red-500",
      details: `${summary.collectionsWithErrors || 0} collections affected`,
    },
    {
      title: "Incomplete Collections",
      value: data.incompleteCollections.count?.toLocaleString() || "0",
      icon: XCircle,
      iconColor: "text-orange-500",
      details: `${formatPercentage(
        data.incompleteCollections.percentage
      )} of total`,
    },
    {
      title: "Average Time Taken",
      value: formatDuration(summary.averageTimeTaken || 0),
      icon: Clock,
      iconColor: "text-purple-500",
      details: "Per collection",
    },
    {
      title: "Average Memory Usage",
      value: formatMemory(summary.averageMemoryUsage || 0),
      icon: MemoryStick,
      iconColor: "text-cyan-500",
      details: "Per collection",
    },
    {
      title: "Date Range",
      value:
        earliest && latest
          ? `${formatDate(earliest)} - ${formatDate(latest)}`
          : "N/A",
      icon: Calendar,
      iconColor: "text-emerald-500",
      details: earliest
        ? `Earliest: ${formatDate(earliest)}`
        : "No collections found",
    },
  ];

  return (
    <div className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">Metric</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric, index) => {
            const IconComponent = metric.icon;
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-5 h-5 ${metric.iconColor}`} />
                    <span className="font-medium">{metric.title}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {metric.details}
                </TableCell>
                <TableCell className="font-semibold text-right">
                  {metric.value}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
