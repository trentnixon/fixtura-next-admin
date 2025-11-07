"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { Badge } from "@/components/ui/badge";
import { formatPercentage } from "@/utils/chart-formatters";
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

  // Get completion rate color (rate is 0-1 range)
  const getCompletionColor = (rate: number): string => {
    if (rate >= 0.9) return "text-success-600";
    if (rate >= 0.7) return "text-info-600";
    if (rate >= 0.5) return "text-warning-600";
    return "text-error-600";
  };

  // Get completion badge color (rate is 0-1 range)
  const getCompletionBadgeColor = (rate: number): string => {
    if (rate >= 0.9) return "bg-success-500";
    if (rate >= 0.7) return "bg-info-500";
    if (rate >= 0.5) return "bg-warning-500";
    return "bg-error-500";
  };

  // Get progress bar color (rate is 0-1 range)
  const getProgressColor = (rate: number): string => {
    if (rate >= 0.9) return "bg-success-500";
    if (rate >= 0.7) return "bg-info-500";
    if (rate >= 0.5) return "bg-warning-500";
    return "bg-error-500";
  };

  // overallCompletionRate is in 0-100 range, convert to 0-1 for helper functions
  const completionRateDecimal = stageAnalysis.overallCompletionRate / 100;
  const completionPercent = formatPercentage(
    stageAnalysis.overallCompletionRate
  );
  const completionColor = getCompletionColor(completionRateDecimal);
  const progressColorClass = getProgressColor(completionRateDecimal);

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
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-500" />
          <SubsectionTitle className="m-0">
            Stage Completion Analysis
          </SubsectionTitle>
        </div>
        <Badge
          className={`${getCompletionBadgeColor(
            completionRateDecimal
          )} text-white border-0 rounded-full text-sm`}
        >
          {completionRateDecimal >= 0.9
            ? "Excellent"
            : completionRateDecimal >= 0.7
            ? "Good"
            : completionRateDecimal >= 0.5
            ? "Fair"
            : "Poor"}
        </Badge>
      </div>
      <ByLine className="mb-4">
        Collection stage completion metrics and analysis
      </ByLine>

      <div className="space-y-6">
        {/* Overall Completion Rate - Large Metric */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium m-0">
              Overall Completion Rate
            </Label>
            <H4 className={`text-4xl font-bold m-0 ${completionColor}`}>
              {completionPercent}
            </H4>
          </div>
          <div className="relative w-full">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all ${progressColorClass}`}
                style={{ width: `${stageAnalysis.overallCompletionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Collection Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 p-4 rounded-lg bg-success-50 border border-success-200">
            <div className="flex items-center gap-2 text-sm text-success-900">
              <CheckCircle className="w-4 h-4" />
              <Label className="font-medium m-0">Fully Completed</Label>
            </div>
            <div className="flex items-baseline gap-2">
              <H4 className="text-3xl font-bold m-0 text-success-700">
                {stageAnalysis.fullyCompletedCollections.toLocaleString()}
              </H4>
              <ByLine className="text-sm m-0 text-success-600">
                ({formatPercentage(fullyCompletedPercent)})
              </ByLine>
            </div>
            <ByLine className="text-xs m-0 text-success-700">
              Collections that completed all stages
            </ByLine>
          </div>

          <div className="space-y-2 p-4 rounded-lg bg-warning-50 border border-warning-200">
            <div className="flex items-center gap-2 text-sm text-warning-900">
              <Clock className="w-4 h-4" />
              <Label className="font-medium m-0">In Progress</Label>
            </div>
            <div className="flex items-baseline gap-2">
              <H4 className="text-3xl font-bold m-0 text-warning-700">
                {stageAnalysis.inProgressCollections.toLocaleString()}
              </H4>
              <ByLine className="text-sm m-0 text-warning-600">
                ({formatPercentage(inProgressPercent)})
              </ByLine>
            </div>
            <ByLine className="text-xs m-0 text-warning-700">
              Collections with pending stages
            </ByLine>
          </div>
        </div>

        {/* Average Stages Breakdown */}
        <div className="pt-2 border-t">
          <SubsectionTitle className="text-sm mb-3 m-0">
            Average Stages
          </SubsectionTitle>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success-500" />
                <Label className="text-sm m-0">Stages Completed</Label>
              </div>
              <H4 className="text-2xl font-bold m-0 text-success-600">
                {stageAnalysis.averageStagesCompleted.toFixed(1)}
              </H4>
              <ByLine className="text-xs m-0">Average per collection</ByLine>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning-500" />
                <Label className="text-sm m-0">Stages Pending</Label>
              </div>
              <H4 className="text-2xl font-bold m-0 text-warning-600">
                {stageAnalysis.averagePendingStages.toFixed(1)}
              </H4>
              <ByLine className="text-xs m-0">Average per collection</ByLine>
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
                className="h-full bg-success-500 transition-all"
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
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning-500" />
                <SubsectionTitle className="text-sm m-0">
                  Most Common Pending Stages
                </SubsectionTitle>
              </div>
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
                      className="flex items-center justify-between p-2 rounded bg-warning-50 border border-warning-100"
                    >
                      <Label className="text-sm font-medium m-0 text-warning-900">
                        {stage}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-500 text-white border-0 rounded-full text-xs">
                          {stageCount} collections
                        </Badge>
                        <ByLine className="text-xs m-0">
                          ({formatPercentage(stagePercent)})
                        </ByLine>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        {/* Summary Info */}
        <div className="pt-4 border-t">
          <div className="rounded-lg bg-info-50 border border-info-200 p-3">
            <div className="flex items-start gap-2">
              <Layers className="w-4 h-4 text-info-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <Label className="text-sm font-medium m-0 text-info-900">
                  Stage Analysis Summary
                </Label>
                <ByLine className="text-xs m-0 text-info-700">
                  {stageAnalysis.fullyCompletedCollections} of{" "}
                  {totalCollections} collections (
                  {formatPercentage(fullyCompletedPercent)}) have completed all
                  stages.{" "}
                  {stageAnalysis.inProgressCollections > 0
                    ? `${
                        stageAnalysis.inProgressCollections
                      } collections are still in progress with an average of ${stageAnalysis.averagePendingStages.toFixed(
                        1
                      )} pending stages each.`
                    : "All collections have completed all stages."}
                </ByLine>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElementContainer>
  );
}
