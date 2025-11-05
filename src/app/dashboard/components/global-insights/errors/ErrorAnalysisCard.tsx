"use client";

import { GlobalInsightsData } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, TrendingUp } from "lucide-react";
import { formatPercentage } from "../utils/formatters";

interface ErrorAnalysisCardProps {
  data: GlobalInsightsData;
}

/**
 * ErrorAnalysisCard Component
 *
 * Displays error overview with:
 * - Overall Error Rate (large metric with color coding)
 * - Collections with Errors count
 * - Total Errors count
 */
export default function ErrorAnalysisCard({ data }: ErrorAnalysisCardProps) {
  const errorAnalysis = data.errorAnalysis;
  const summary = data.summary;

  // Helper function to get error rate severity
  const getErrorSeverity = (
    errorRate: number
  ): {
    level: "low" | "medium" | "high" | "critical";
    color: string;
    borderColor: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
    description: string;
  } => {
    if (errorRate >= 20) {
      return {
        level: "critical",
        color: "text-red-600",
        borderColor: "border-red-500",
        badgeVariant: "destructive",
        description: "Critical - Immediate attention required",
      };
    } else if (errorRate >= 10) {
      return {
        level: "high",
        color: "text-orange-600",
        borderColor: "border-orange-500",
        badgeVariant: "destructive",
        description: "High - Review and resolve errors",
      };
    } else if (errorRate >= 5) {
      return {
        level: "medium",
        color: "text-yellow-600",
        borderColor: "border-yellow-500",
        badgeVariant: "secondary",
        description: "Medium - Monitor error rates",
      };
    } else {
      return {
        level: "low",
        color: "text-emerald-600",
        borderColor: "border-emerald-500",
        badgeVariant: "default",
        description: "Low - Error rates are acceptable",
      };
    }
  };

  const severity = getErrorSeverity(errorAnalysis.errorRate);
  const errorRatePercent = formatPercentage(errorAnalysis.errorRate);

  // Calculate error percentage of total collections
  const errorCollectionPercentage =
    summary.totalCollections > 0
      ? (errorAnalysis.collectionsWithErrors / summary.totalCollections) * 100
      : 0;

  return (
    <Card
      className={`shadow-none bg-slate-50 border-b-4 ${severity.borderColor} rounded-md`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${severity.color}`} />
            <CardTitle className="text-lg font-semibold">
              Error Analysis
            </CardTitle>
          </div>
          <Badge variant={severity.badgeVariant} className="text-sm">
            {severity.level.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>{severity.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Error Rate - Large Metric */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Error Rate
            </span>
            <span className={`text-4xl font-bold ${severity.color}`}>
              {errorRatePercent}
            </span>
          </div>
          <div className="relative w-full">
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all ${
                  severity.level === "critical"
                    ? "bg-red-500"
                    : severity.level === "high"
                    ? "bg-orange-500"
                    : severity.level === "medium"
                    ? "bg-yellow-500"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${errorAnalysis.errorRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Error Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span>Collections with Errors</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-red-600">
                {errorAnalysis.collectionsWithErrors.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">
                of {summary.totalCollections.toLocaleString()} total
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {errorCollectionPercentage.toFixed(1)}% of collections affected
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>Total Errors</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-orange-600">
                {errorAnalysis.totalErrors.toLocaleString()}
              </span>
              {errorAnalysis.totalErrors > 0 && (
                <TrendingUp className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Across all collections
            </div>
          </div>
        </div>

        {/* Summary */}
        {errorAnalysis.totalErrors > 0 && (
          <div className="pt-4 border-t">
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-900">
                    Action Required
                  </p>
                  <p className="text-xs text-red-700 mt-1">
                    {errorAnalysis.totalErrors} error
                    {errorAnalysis.totalErrors !== 1 ? "s" : ""} detected across{" "}
                    {errorAnalysis.collectionsWithErrors} collection
                    {errorAnalysis.collectionsWithErrors !== 1 ? "s" : ""}.{" "}
                    {errorAnalysis.errorRate >= 10
                      ? "Review error logs and resolve issues to improve data collection reliability."
                      : "Monitor error rates to ensure they remain within acceptable thresholds."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
