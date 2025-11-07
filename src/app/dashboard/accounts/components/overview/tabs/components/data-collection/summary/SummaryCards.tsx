"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatDuration,
  formatMemory,
  formatPercentage,
} from "@/utils/chart-formatters";
import {
  Database,
  AlertCircle,
  CheckCircle,
  Clock,
  MemoryStick,
  Package,
  Calendar,
} from "lucide-react";

interface SummaryCardsProps {
  data: AccountStatsResponse;
}

/**
 * SummaryCards Component
 *
 * Displays key summary metrics for account data collection in a table format.
 * Shows: Total Collections, Error Rate, Completion Rate, Performance metrics, and Date Range.
 */
export default function SummaryCards({ data }: SummaryCardsProps) {
  const summary = data.data.summary;
  const { earliest, latest } = summary.dateRange;

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const metrics = [
    {
      title: "Total Collections",
      value: summary.totalCollections?.toLocaleString() || "0",
      icon: <Database className="w-5 h-5 text-blue-500" />,
      lastUpdate: `${summary.collectionsWithErrors || 0} with errors`,
    },
    {
      title: "Error Rate",
      value: formatPercentage((summary.errorRate || 0) * 100),
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      lastUpdate: `${
        summary.collectionsWithErrors || 0
      } collections with errors`,
    },
    {
      title: "Completion Rate",
      value: formatPercentage((summary.averageCompletionRate || 0) * 100),
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      lastUpdate: `Average across ${summary.totalCollections || 0} collections`,
    },
    {
      title: "Average Time Taken",
      value: formatDuration(summary.averageTimeTaken || 0, "milliseconds"),
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      lastUpdate: "Per collection",
    },
    {
      title: "Average Memory Usage",
      value: formatMemory(summary.averageMemoryUsage || 0, "bytes"),
      icon: <MemoryStick className="w-5 h-5 text-orange-500" />,
      lastUpdate: "Per collection",
    },
    {
      title: "Total Items Processed",
      value: summary.totalItemsProcessed?.toLocaleString() || "0",
      icon: <Package className="w-5 h-5 text-indigo-500" />,
      lastUpdate: `Across all collections`,
    },
    {
      title: "Collection Date Range",
      value:
        earliest && latest
          ? `${formatDate(earliest)} - ${formatDate(latest)}`
          : "N/A",
      icon: <Calendar className="w-5 h-5 text-cyan-500" />,
      lastUpdate: earliest
        ? `Earliest: ${formatDate(earliest)}`
        : "No collections found",
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-left">Metric</TableHead>
          <TableHead className="text-left">Details</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-2">
                {metric.icon}
                <span className="font-medium">{metric.title}</span>
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {metric.lastUpdate}
            </TableCell>
            <TableCell className="text-right font-semibold">
              {metric.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
