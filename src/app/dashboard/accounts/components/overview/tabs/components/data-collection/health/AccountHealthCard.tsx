"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Format date to relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

      if (diffInDays > 0) {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
      } else if (diffInHours > 0) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
      } else if (diffInMinutes > 0) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
      } else {
        return "Just now";
      }
    } catch {
      return dateString;
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Get health level and color
  const getHealthLevel = (
    score: number
  ): {
    level: string;
    color: string;
    borderColor: string;
    badgeVariant: "default" | "secondary" | "destructive" | "outline";
  } => {
    if (score >= 90) {
      return {
        level: "Excellent",
        color: "text-emerald-600",
        borderColor: "border-emerald-500",
        badgeVariant: "default",
      };
    } else if (score >= 70) {
      return {
        level: "Good",
        color: "text-blue-600",
        borderColor: "border-blue-500",
        badgeVariant: "default",
      };
    } else if (score >= 50) {
      return {
        level: "Fair",
        color: "text-yellow-600",
        borderColor: "border-yellow-500",
        badgeVariant: "secondary",
      };
    } else {
      return {
        level: "Poor",
        color: "text-red-600",
        borderColor: "border-red-500",
        badgeVariant: "destructive",
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
  const errorRatePercent = (insights.errorRate * 100).toFixed(1);
  const completionRatePercent = (insights.completionRate * 100).toFixed(1);
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
    <Card
      className={`shadow-none bg-slate-50 border-b-4 ${healthLevel.borderColor} rounded-md`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className={`w-5 h-5 ${healthLevel.color}`} />
            <CardTitle className="text-lg font-semibold">
              Account Health Score
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {needsAttention && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Needs Attention
              </Badge>
            )}
            <Badge variant={healthLevel.badgeVariant} className="text-sm">
              {healthLevel.level}
            </Badge>
          </div>
        </div>
        <CardDescription>
          Overall account data collection health assessment
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Health Score with Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Health Score
            </span>
            <span className={`text-3xl font-bold ${healthLevel.color}`}>
              {healthScore}
              <span className="text-lg text-muted-foreground">/100</span>
            </span>
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Error Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  insights.errorRate > 0.1
                    ? "text-red-600"
                    : insights.errorRate > 0.05
                    ? "text-yellow-600"
                    : "text-emerald-600"
                }`}
              >
                {errorRatePercent}%
              </span>
              {insights.errorRate > 0.1 ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-4 h-4" />
              <span>Completion Rate</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-2xl font-bold ${
                  insights.completionRate >= 0.9
                    ? "text-emerald-600"
                    : insights.completionRate >= 0.7
                    ? "text-blue-600"
                    : "text-yellow-600"
                }`}
              >
                {completionRatePercent}%
              </span>
              {insights.completionRate >= 0.9 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-yellow-500" />
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last Collection</span>
            </div>
            <div className="text-2xl font-bold text-muted-foreground">
              {lastCollectionRelative}
            </div>
            <div className="text-xs text-muted-foreground">
              {lastCollectionFormatted}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Total Collections
            </div>
            <div className="text-lg font-semibold">
              {insights.totalCollections?.toLocaleString() || "0"}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              Avg Time Taken
            </div>
            <div className="text-lg font-semibold">
              {insights.averageTimeTaken < 1000
                ? `${insights.averageTimeTaken.toFixed(0)}ms`
                : insights.averageTimeTaken < 60000
                ? `${(insights.averageTimeTaken / 1000).toFixed(1)}s`
                : `${Math.floor(
                    insights.averageTimeTaken / 60000
                  )}m ${Math.floor(
                    (insights.averageTimeTaken % 60000) / 1000
                  )}s`}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="pt-4 border-t space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertTriangle
                className={`w-4 h-4 ${
                  needsAttention ? "text-red-500" : "text-yellow-500"
                }`}
              />
              Recommendations
            </h4>
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
      </CardContent>
    </Card>
  );
}
