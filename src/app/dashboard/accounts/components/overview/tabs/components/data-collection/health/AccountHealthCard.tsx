"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Badge } from "@/components/ui/badge";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import {
  formatDuration,
  formatPercentage,
  formatRelativeTime,
  formatDate,
} from "@/utils/chart-formatters";
import {
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
} from "lucide-react";

interface AccountHealthCardProps {
  data: AccountStatsResponse;
}

/**
 * AccountHealthCard Component
 *
 * Displays primary health indicator for account data collection with:
 * - Health Score (0-100) with visual progress bar
 * - Needs Attention badge/alert (if healthScore < 70)
 * - Key health indicators breakdown
 * - Last collection date with relative time
 * - Actionable recommendations based on health score
 */
export default function AccountHealthCard({ data }: AccountHealthCardProps) {
  const insights = data.data.accountInsights;
  const healthScore = insights.healthScore || 0;
  const needsAttention = insights.needsAttention || false;

  // Get health level and color
  const getHealthLevel = (
    score: number
  ): {
    level: string;
    color: string;
    borderColor: string;
    badgeColor: string;
  } => {
    if (score >= 90) {
      return {
        level: "Excellent",
        color: "text-emerald-600",
        borderColor: "border-emerald-500",
        badgeColor: "bg-success-500",
      };
    } else if (score >= 70) {
      return {
        level: "Good",
        color: "text-blue-600",
        borderColor: "border-blue-500",
        badgeColor: "bg-info-500",
      };
    } else if (score >= 50) {
      return {
        level: "Fair",
        color: "text-yellow-600",
        borderColor: "border-yellow-500",
        badgeColor: "bg-warning-500",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        borderColor: "border-red-500",
        badgeColor: "bg-error-500",
      };
    }
  };

  // Get progress bar color based on health score
  const getProgressColor = (score: number): string => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Get recommendations based on health score
  const getRecommendations = (
    score: number,
    errorRate: number,
    completionRate: number,
    daysSinceLastCollection: number
  ): string[] => {
    const recommendations: string[] = [];

    if (score < 70) {
      if (errorRate > 0.1) {
        recommendations.push(
          "Review error logs and resolve data collection errors"
        );
      }
      if (completionRate < 0.8) {
        recommendations.push(
          "Investigate incomplete collections and pending stages"
        );
      }
      if (daysSinceLastCollection > 3) {
        recommendations.push("Schedule more frequent data collections");
      }
      recommendations.push(
        "Review performance metrics and optimize collection process"
      );
    } else if (score >= 70 && score < 90) {
      if (errorRate > 0.05) {
        recommendations.push("Monitor and reduce error rates");
      }
      recommendations.push("Continue monitoring collection performance");
    } else {
      recommendations.push(
        "Account health is excellent. Maintain current practices."
      );
    }

    return recommendations;
  };

  const temporalAnalysis = data.data.temporalAnalysis;
  const healthLevel = getHealthLevel(healthScore);
  const errorRatePercent = formatPercentage((insights.errorRate || 0) * 100);
  const completionRatePercent = formatPercentage(
    (insights.completionRate || 0) * 100
  );
  const lastCollectionRelative = formatRelativeTime(
    insights.lastCollectionDate
  );
  const lastCollectionFormatted = formatDate(insights.lastCollectionDate);
  const recommendations = getRecommendations(
    healthScore,
    insights.errorRate,
    insights.completionRate,
    temporalAnalysis.daysSinceLastCollection
  );

  // Get progress bar color class
  const progressColorClass = getProgressColor(healthScore);

  return (
    <ElementContainer
      variant="dark"
      border
      padding="md"
      className={`border-b-4 ${healthLevel.borderColor}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Heart className={`w-5 h-5 ${healthLevel.color}`} />
          <SubsectionTitle className="m-0">
            Account Health Score
          </SubsectionTitle>
        </div>
        <div className="flex items-center gap-2">
          {needsAttention && (
            <Badge className="bg-error-500 text-white border-0 rounded-full text-xs flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Needs Attention
            </Badge>
          )}
          <Badge
            className={`${healthLevel.badgeColor} text-white border-0 rounded-full text-sm`}
          >
            {healthLevel.level}
          </Badge>
        </div>
      </div>
      <ByLine className="mb-4">
        Overall account data collection health assessment
      </ByLine>

      <div className="space-y-6">
        {/* Health Score with Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm m-0">Health Score</Label>
            <H4 className={`text-3xl font-bold m-0 ${healthLevel.color}`}>
              {healthScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </H4>
          </div>
          <div className="relative w-full">
            <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full transition-all ${progressColorClass}`}
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Key Health Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-1">
            <Label className="text-sm m-0 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Error Rate
            </Label>
            <div className="flex items-baseline gap-2">
              <H4
                className={`text-2xl font-bold m-0 ${
                  insights.errorRate > 0.1
                    ? "text-error-600"
                    : insights.errorRate > 0.05
                    ? "text-warning-600"
                    : "text-success-600"
                }`}
              >
                {errorRatePercent}
              </H4>
              {insights.errorRate > 0.1 ? (
                <TrendingDown className="w-4 h-4 text-error-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-success-500" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm m-0 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Completion Rate
            </Label>
            <div className="flex items-baseline gap-2">
              <H4
                className={`text-2xl font-bold m-0 ${
                  insights.completionRate >= 0.9
                    ? "text-success-600"
                    : insights.completionRate >= 0.7
                    ? "text-info-600"
                    : "text-warning-600"
                }`}
              >
                {completionRatePercent}
              </H4>
              {insights.completionRate >= 0.9 ? (
                <TrendingUp className="w-4 h-4 text-success-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-warning-500" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-sm m-0 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Last Collection
            </Label>
            <H4 className="text-2xl font-bold m-0 text-muted-foreground">
              {lastCollectionRelative}
            </H4>
            <ByLine className="text-xs m-0">{lastCollectionFormatted}</ByLine>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div className="space-y-1">
            <Label className="text-xs m-0">Total Collections</Label>
            <H4 className="text-lg font-semibold m-0">
              {insights.totalCollections?.toLocaleString() || "0"}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs m-0">Avg Time Taken</Label>
            <H4 className="text-lg font-semibold m-0">
              {formatDuration(insights.averageTimeTaken || 0, "milliseconds")}
            </H4>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <SubsectionTitle className="text-sm m-0 flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  needsAttention ? "text-error-500" : "text-warning-500"
                }`}
              />
              Recommendations
            </SubsectionTitle>
            <ul className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-start gap-2"
                >
                  <span className="text-primary mt-0.5">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
