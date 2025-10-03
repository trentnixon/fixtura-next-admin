"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestSummary } from "@/types/fetch-account-scrape-test";
import {
  CheckCircle,
  Clock,
  Activity,
  AlertTriangle,
  Database,
} from "lucide-react";

interface FetchAccountTestsSummaryProps {
  summary: TestSummary;
}

export function FetchAccountTestsSummary({
  summary,
}: FetchAccountTestsSummaryProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const successRate =
    summary.totalRuns > 0
      ? ((summary.totalPassed / summary.totalRuns) * 100).toFixed(1)
      : "0";

  const validationSuccessRate =
    summary.totalValidations > 0
      ? (
          (summary.totalPassedValidations / summary.totalValidations) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Tests */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalTests}</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalRuns} total runs
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate}%</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalPassed} passed, {summary.totalFailed} failed
          </p>
        </CardContent>
      </Card>

      {/* Validation Success Rate */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Validation Success
          </CardTitle>
          <Database className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{validationSuccessRate}%</div>
          <p className="text-xs text-muted-foreground">
            {summary.totalPassedValidations} / {summary.totalValidations}{" "}
            validations
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
          <div className="text-2xl font-bold">
            {formatDuration(summary.averageDuration)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total: {formatDuration(summary.totalDuration)}
          </p>
        </CardContent>
      </Card>

      {/* Regression Count */}
      <Card className="bg-slate-50 border-b-4 border-b-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Regressions</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.regressionCount}</div>
          <p className="text-xs text-muted-foreground">Detected regressions</p>
        </CardContent>
      </Card>

      {/* Scraped Items */}
      <Card className="bg-slate-50 border-b-4 border-b-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Scraped</CardTitle>
          <Database className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary.totalScrapedItems.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Expected: {summary.totalExpectedItems.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
