"use client";

import { Download, Sparkles, Image, BarChart3 } from "lucide-react";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MetricsTableProps {
  accountData: fixturaContentHubAccountDetails;
}

export default function MetricsTable({ accountData }: MetricsTableProps) {
  // Metrics configuration array
  const metrics = [
    {
      title: "Total Renders",
      value: accountData?.metricsOverTime.totalCompleteRenders || "N/A",
      icon: (
        <Image className="w-5 h-5 text-indigo-500" aria-label="Renders icon" />
      ),
      lastUpdate: `Total Renders: ${accountData?.metricsOverTime.totalRenders}`,
    },
    {
      title: "Total Downloads",
      value: accountData?.metricsOverTime.totalDownloads || "N/A",
      icon: <Download className="w-5 h-5 text-blue-500" />,
      lastUpdate: "Last Update: ",
    },
    {
      title: "Total AI Articles",
      value: accountData?.metricsOverTime.totalAiArticles || "N/A",
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      lastUpdate: "Last Update: ",
    },
  ];

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-600" />
          <CardTitle className="text-lg font-semibold">
            Account Metrics
          </CardTitle>
        </div>
        <CardDescription>
          Overview of key account metrics and performance indicators
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Icon</TableHead>
                <TableHead>Metric</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Last Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric, index) => (
                <TableRow key={index}>
                  <TableCell>{metric.icon}</TableCell>
                  <TableCell className="font-medium">{metric.title}</TableCell>
                  <TableCell className="text-right">{metric.value}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {metric.lastUpdate}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
