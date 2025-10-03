"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestRun } from "@/types/fetch-account-scrape-test";
import {
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Target,
  Activity,
} from "lucide-react";

interface AccountTestStatsCardsProps {
  data: TestRun;
}

export function AccountTestStatsCards({ data }: AccountTestStatsCardsProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const validationSuccessRate = data.validation.successRate.toFixed(1);

  const scrapedItemSuccessRate =
    data.dataComparison.expectedItemCount > 0
      ? (
          (data.dataComparison.scrapedItemCount /
            data.dataComparison.expectedItemCount) *
          100
        ).toFixed(1)
      : "0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Test Status */}
      <Card
        className={`${
          data.testPassed
            ? "bg-green-50 border-green-200"
            : "bg-red-50 border-red-200"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Status</CardTitle>
          {data.testPassed ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              data.testPassed ? "text-green-600" : "text-red-600"
            }`}
          >
            {data.testPassed ? "Passed" : "Failed"}
          </div>
          <p className="text-xs text-muted-foreground">
            {data.regressionDetected ? "Regression detected" : "No regression"}
          </p>
        </CardContent>
      </Card>

      {/* Test Duration */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duration</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(data.testDuration)}
          </div>
          <p className="text-xs text-muted-foreground">Test execution time</p>
        </CardContent>
      </Card>

      {/* Validations */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Validations</CardTitle>
          <Target className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{validationSuccessRate}%</div>
          <p className="text-xs text-muted-foreground">
            {data.validation.passedValidations} /{" "}
            {data.validation.totalValidations} passed
          </p>
        </CardContent>
      </Card>

      {/* Items Scraped */}
      <Card className="bg-slate-50 border-b-4 border-b-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Items Scraped</CardTitle>
          <Database className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scrapedItemSuccessRate}%</div>
          <p className="text-xs text-muted-foreground">
            {data.dataComparison.scrapedItemCount} /{" "}
            {data.dataComparison.expectedItemCount} expected
          </p>
        </CardContent>
      </Card>

      {/* Test Entity */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Entity</CardTitle>
          <Activity className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{data.testEntity}</div>
          <p className="text-xs text-muted-foreground">
            ID: {data.testEntityId}
          </p>
        </CardContent>
      </Card>

      {/* Scraper Type */}
      <Card className="bg-slate-50 border-b-4 border-b-indigo-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Scraper Type</CardTitle>
          <Database className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{data.scraperType}</div>
          <p className="text-xs text-muted-foreground">
            {data.environment} environment
          </p>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Environment</CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{data.environment}</div>
          <p className="text-xs text-muted-foreground">Test environment</p>
        </CardContent>
      </Card>

      {/* Test Initiator */}
      <Card className="bg-slate-50 border-b-4 border-b-pink-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Initiator</CardTitle>
          <Activity className="h-4 w-4 text-pink-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{data.testInitiator}</div>
          <p className="text-xs text-muted-foreground">Test trigger source</p>
        </CardContent>
      </Card>
    </div>
  );
}
