"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ByIDResponse } from "@/types/fetch-test";
import {
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  AlertTriangle,
  Database,
  Cpu,
  MemoryStick,
} from "lucide-react";

interface TestStatsCardsProps {
  data: ByIDResponse;
}

export function TestStatsCards({ data }: TestStatsCardsProps) {
  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  const formatMemory = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const successRate =
    data.totalTests > 0
      ? ((data.passedTests / data.totalTests) * 100).toFixed(1)
      : "0";

  const memoryPeak = data.performanceMetrics.systemMetrics.memoryPeak;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Test Results */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Test Results</CardTitle>
          <Activity className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalTests}</div>
          <p className="text-xs text-muted-foreground">
            {data.passedTests} passed, {data.failedTests} failed
          </p>
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card
        className={`bg-slate-50 border-b-4 ${
          data.failedTests === 0 ? "border-b-green-500" : "border-b-red-500"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          {data.failedTests === 0 ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              data.failedTests === 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {successRate}%
          </div>
          <p className="text-xs text-muted-foreground">
            {data.failedTests === 0
              ? "All tests passed"
              : `${data.failedTests} test(s) failed`}
          </p>
        </CardContent>
      </Card>

      {/* Duration */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Duration</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {formatDuration(data.testDuration)}
          </div>
          <p className="text-xs text-muted-foreground">Total execution time</p>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Memory Peak</CardTitle>
          <MemoryStick className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {formatMemory(memoryPeak * 1024 * 1024)}
          </div>
          <p className="text-xs text-muted-foreground">Peak memory usage</p>
        </CardContent>
      </Card>

      {/* CPU Usage */}
      <Card className="bg-slate-50 border-b-4 border-b-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
          <Cpu className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-600">
            {(
              (data.performanceMetrics.systemMetrics.cpuUsage.user +
                data.performanceMetrics.systemMetrics.cpuUsage.system) /
              1000000
            ).toFixed(2)}
            s
          </div>
          <p className="text-xs text-muted-foreground">User + System time</p>
        </CardContent>
      </Card>

      {/* Discrepancies */}
      <Card className="bg-slate-50 border-b-4 border-b-yellow-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">
            {data.detailedResults.reduce(
              (acc, result) => acc + result.discrepancies.length,
              0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Total discrepancies found
          </p>
        </CardContent>
      </Card>

      {/* Data Quality */}
      <Card className="bg-slate-50 border-b-4 border-b-indigo-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Extraction Rate</CardTitle>
          <Database className="h-4 w-4 text-indigo-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-indigo-600">
            {(data.dataQualityMetrics.extractionSuccessRate * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Data extraction success
          </p>
        </CardContent>
      </Card>

      {/* Environment */}
      <Card className="bg-slate-50 border-b-4 border-b-gray-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Environment</CardTitle>
          <Database className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600 capitalize">
            {data.environment}
          </div>
          <p className="text-xs text-muted-foreground">{data.testInitiator}</p>
        </CardContent>
      </Card>
    </div>
  );
}
