"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { H4 } from "@/components/type/titles";
import { P } from "@/components/type/type";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  Layers,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface StageAnalysisCardProps {
  data: AccountStatsResponse;
}

/**
 * StageAnalysisCard Component
 *
 * Displays stage completion analysis including:
 * - Overall Completion Rate (large metric with progress bar)
 * - Fully Completed Collections count
 * - In Progress Collections count
 * - Average Stages Completed vs Average Pending Stages
 * - Most Common Pending Stages list
 */
export default function StageAnalysisCard({ data }: StageAnalysisCardProps) {
  const stageAnalysis = data.data.stageAnalysis;

  // Format percentage
  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Get completion rate color
  const getCompletionColor = (rate: number): string => {
    if (rate >= 0.9) return "text-emerald-600";
    if (rate >= 0.7) return "text-blue-600";
    if (rate >= 0.5) return "text-yellow-600";
    return "text-red-600";
  };

  // Get completion badge variant
  const getCompletionBadgeVariant = (
    rate: number
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (rate >= 0.9) return "default";
    if (rate >= 0.7) return "default";
    if (rate >= 0.5) return "secondary";
    return "destructive";
  };

  // Get progress bar color
  const getProgressColor = (rate: number): string => {
    if (rate >= 0.9) return "bg-emerald-500";
    if (rate >= 0.7) return "bg-blue-500";
    if (rate >= 0.5) return "bg-yellow-500";
    return "bg-red-500";
  };

  const completionRate = stageAnalysis.overallCompletionRate;
  const completionPercent = formatPercent(completionRate);
  const completionColor = getCompletionColor(completionRate);
  const progressColorClass = getProgressColor(completionRate);

  // Calculate total collections (fully completed + in progress)
  const totalCollections =
    stageAnalysis.fullyCompletedCollections +
    stageAnalysis.inProgressCollections;

  // Calculate completion percentage breakdown
  const fullyCompletedPercent =
    totalCollections > 0
      ? (stageAnalysis.fullyCompletedCollections / totalCollections) * 100
      : 0;
  const inProgressPercent =
    totalCollections > 0
      ? (stageAnalysis.inProgressCollections / totalCollections) * 100
      : 0;

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg font-semibold">
              Stage Completion Analysis
            </CardTitle>
          </div>
          <Badge
            variant={getCompletionBadgeVariant(completionRate)}
            className="text-sm"
          >
            {completionRate >= 0.9
              ? "Excellent"
              : completionRate >= 0.7
              ? "Good"
              : completionRate >= 0.5
              ? "Fair"
              : "Poor"}
          </Badge>
        </div>
        <CardDescription>
          Collection stage completion metrics and analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Completion Rate - Large Metric */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Overall Completion Rate
            </span>
            <span className={`text-4xl font-bold ${completionColor}`}>
              {completionPercent}
            </span>
          </div>
          <div className="relative w-full">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all ${progressColorClass}`}
                style={{ width: `${completionRate * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collection Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-2 text-sm text-emerald-900">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Fully Completed</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-700">
                {stageAnalysis.fullyCompletedCollections.toLocaleString()}
              </span>
              <span className="text-sm text-emerald-600">
                ({fullyCompletedPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="text-xs text-emerald-700">
              Collections that completed all stages
            </div>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2 text-sm text-yellow-900">
              <Clock className="w-4 h-4" />
              <span className="font-medium">In Progress</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-yellow-700">
                {stageAnalysis.inProgressCollections.toLocaleString()}
              </span>
              <span className="text-sm text-yellow-600">
                ({inProgressPercent.toFixed(1)}%)
              </span>
            </div>
            <div className="text-xs text-yellow-700">
              Collections with pending stages
            </div>
          </div>
        </div>

        {/* Average Stages Breakdown */}
        <div className="pt-2 border-t">
          <H4 className="text-sm mb-3">Average Stages</H4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Stages Completed</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {stageAnalysis.averageStagesCompleted.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                Average per collection
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span>Stages Pending</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {stageAnalysis.averagePendingStages.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                Average per collection
              </div>
            </div>
          </div>

          {/* Stage Comparison Visual */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Stage Completion Ratio</span>
              <span>
                {stageAnalysis.averageStagesCompleted > 0 &&
                stageAnalysis.averagePendingStages > 0
                  ? (
                      stageAnalysis.averageStagesCompleted /
                      (stageAnalysis.averageStagesCompleted +
                        stageAnalysis.averagePendingStages)
                    ).toFixed(2)
                  : "0.00"}
                :1
              </span>
            </div>
            <div className="relative w-full h-3 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    stageAnalysis.averageStagesCompleted > 0 &&
                    stageAnalysis.averagePendingStages > 0
                      ? (stageAnalysis.averageStagesCompleted /
                          (stageAnalysis.averageStagesCompleted +
                            stageAnalysis.averagePendingStages)) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Most Common Pending Stages */}
        {stageAnalysis.mostCommonPendingStages &&
          stageAnalysis.mostCommonPendingStages.length > 0 && (
            <div className="pt-4 border-t space-y-3">
              <H4 className="text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                Most Common Pending Stages
              </H4>
              <div className="space-y-2">
                {stageAnalysis.mostCommonPendingStages.map((stage, index) => {
                  const stageCount =
                    stageAnalysis.currentStageDistribution[stage] || 0;
                  const stagePercent =
                    totalCollections > 0
                      ? (stageCount / totalCollections) * 100
                      : 0;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded bg-yellow-50 border border-yellow-100"
                    >
                      <span className="text-sm font-medium text-yellow-900">
                        {stage}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {stageCount} collections
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ({stagePercent.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Summary Info */}
        <div className="pt-4 border-t">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <P className="text-sm font-medium text-blue-900">
                  Stage Analysis Summary
                </P>
                <P className="text-xs text-blue-700 mt-1">
                  {stageAnalysis.fullyCompletedCollections} of{" "}
                  {totalCollections} collections (
                  {fullyCompletedPercent.toFixed(1)}%) have completed all
                  stages.{" "}
                  {stageAnalysis.inProgressCollections > 0
                    ? `${
                        stageAnalysis.inProgressCollections
                      } collections are still in progress with an average of ${stageAnalysis.averagePendingStages.toFixed(
                        1
                      )} pending stages each.`
                    : "All collections have completed all stages."}
                </P>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
