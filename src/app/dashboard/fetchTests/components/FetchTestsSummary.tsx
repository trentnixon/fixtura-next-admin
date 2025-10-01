"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestReport } from "@/types/fetch-test";
import { CheckCircle, XCircle, Clock, Activity } from "lucide-react";

interface FetchTestsSummaryProps {
  summary: TestReport["summary"];
}

export function FetchTestsSummary({ summary }: FetchTestsSummaryProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const successRate =
    summary.totalRuns > 0
      ? ((summary.totalPassed / summary.totalRuns) * 100).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Runs */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalRuns}</div>
          <p className="text-xs text-muted-foreground">Test executions</p>
        </CardContent>
      </Card>

      {/* Passed Tests */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Passed Tests</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {summary.totalPassed}
          </div>
          <p className="text-xs text-muted-foreground">
            {successRate}% success rate
          </p>
        </CardContent>
      </Card>

      {/* Failed Tests */}
      <Card className="bg-slate-50 border-b-4 border-b-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed Tests</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {summary.totalFailed}
          </div>
          <p className="text-xs text-muted-foreground">
            {summary.totalRuns > 0
              ? ((summary.totalFailed / summary.totalRuns) * 100).toFixed(1)
              : "0"}
            % failure rate
          </p>
        </CardContent>
      </Card>

      {/* Average Duration */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatDuration(summary.averageDuration)}
          </div>
          <p className="text-xs text-muted-foreground">Per test run</p>
        </CardContent>
      </Card>
    </div>
  );
}
