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
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertCircle,
} from "lucide-react";

interface TemporalAnalysisCardProps {
  data: AccountStatsResponse;
}

/**
 * TemporalAnalysisCard Component
 *
 * Displays temporal analysis and collection frequency including:
 * - Total Collections count
 * - Last Collection Date (formatted with relative time)
 * - Days Since Last Collection
 * - Collection Frequency (collections per day)
 * - Frequency status indicator
 */
export default function TemporalAnalysisCard({
  data,
}: TemporalAnalysisCardProps) {
  const temporal = data.data.temporalAnalysis;

  // Format date to readable string
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // Get relative time string (e.g., "2 days ago")
  const getRelativeTime = (days: number): string => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    if (days < 7) return `${days} days ago`;
    if (days < 30) {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
    }
    if (days < 365) {
      const months = Math.floor(days / 30);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.floor(days / 365);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  };

  // Get frequency status (good/fair/poor)
  const getFrequencyStatus = (
    frequency: number
  ): {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    color: string;
    icon: React.ReactNode;
  } => {
    if (frequency >= 1) {
      return {
        label: "Excellent",
        variant: "default",
        color: "text-emerald-600",
        icon: <TrendingUp className="w-4 h-4" />,
      };
    }
    if (frequency >= 0.5) {
      return {
        label: "Good",
        variant: "default",
        color: "text-blue-600",
        icon: <Activity className="w-4 h-4" />,
      };
    }
    if (frequency >= 0.25) {
      return {
        label: "Fair",
        variant: "secondary",
        color: "text-yellow-600",
        icon: <TrendingDown className="w-4 h-4" />,
      };
    }
    return {
      label: "Poor",
      variant: "destructive",
      color: "text-red-600",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  // Get days since last collection status
  const getDaysStatus = (
    days: number
  ): {
    label: string;
    color: string;
    icon: React.ReactNode;
  } => {
    if (days <= 1) {
      return {
        label: "Recent",
        color: "text-emerald-600",
        icon: <TrendingUp className="w-4 h-4" />,
      };
    }
    if (days <= 7) {
      return {
        label: "Acceptable",
        color: "text-blue-600",
        icon: <Activity className="w-4 h-4" />,
      };
    }
    if (days <= 30) {
      return {
        label: "Stale",
        color: "text-yellow-600",
        icon: <TrendingDown className="w-4 h-4" />,
      };
    }
    return {
      label: "Very Stale",
      color: "text-red-600",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  const frequencyStatus = getFrequencyStatus(temporal.collectionFrequency);
  const daysStatus = getDaysStatus(temporal.daysSinceLastCollection);
  const relativeTime = getRelativeTime(temporal.daysSinceLastCollection);

  return (
    <Card className="shadow-none bg-slate-50 border rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-500" />
            <CardTitle className="text-lg font-semibold">
              Collection Frequency Analysis
            </CardTitle>
          </div>
          <Badge variant={frequencyStatus.variant} className="text-sm">
            <div className="flex items-center gap-1">
              {frequencyStatus.icon}
              <span>{frequencyStatus.label} Frequency</span>
            </div>
          </Badge>
        </div>
        <CardDescription>
          Temporal patterns and collection frequency metrics
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Total Collections - Large Metric */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Total Collections
            </span>
            <span className="text-4xl font-bold text-indigo-600">
              {temporal.totalCollections.toLocaleString()}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Total data collection runs tracked
          </div>
        </div>

        {/* Last Collection Date */}
        <div className="pt-2 border-t space-y-3">
          <H4 className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            Last Collection
          </H4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-xs text-blue-900 font-medium">
                Last Collection Date
              </div>
              <div className="text-lg font-semibold text-blue-700">
                {formatDate(temporal.lastCollectionDate)}
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Clock className="w-3 h-3" />
                <span>{relativeTime}</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-orange-50 border border-orange-200">
              <div className="flex items-center gap-2 text-xs text-orange-900 font-medium">
                {daysStatus.icon}
                <span>Days Since Last Collection</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${daysStatus.color}`}>
                  {temporal.daysSinceLastCollection}
                </span>
                <span className="text-xs text-orange-600">
                  {temporal.daysSinceLastCollection === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant={
                    temporal.daysSinceLastCollection <= 7
                      ? "default"
                      : temporal.daysSinceLastCollection <= 30
                      ? "secondary"
                      : "destructive"
                  }
                  className="text-xs"
                >
                  {daysStatus.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Frequency */}
        <div className="pt-2 border-t space-y-3">
          <H4 className="text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            Collection Frequency
          </H4>
          <div className="space-y-4">
            {/* Frequency Metric */}
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-indigo-900">
                  Collections Per Day
                </span>
                <div className="flex items-center gap-2">
                  {frequencyStatus.icon}
                  <span
                    className={`text-2xl font-bold ${frequencyStatus.color}`}
                  >
                    {temporal.collectionFrequency.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-indigo-700">
                Average number of collections per day based on total collections
                and date range
              </div>
            </div>

            {/* Frequency Interpretation */}
            <div className="rounded-lg bg-slate-100 border border-slate-200 p-3">
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-slate-600 mt-0.5" />
                <div className="flex-1">
                  <P className="text-sm font-medium text-slate-900 mb-1">
                    Frequency Status
                  </P>
                  <P className="text-xs text-slate-700">
                    {temporal.collectionFrequency >= 1
                      ? "Excellent frequency - collections are happening daily or more frequently."
                      : temporal.collectionFrequency >= 0.5
                      ? "Good frequency - collections occur multiple times per week."
                      : temporal.collectionFrequency >= 0.25
                      ? "Fair frequency - collections occur weekly. Consider increasing frequency for better data freshness."
                      : "Poor frequency - collections are infrequent. Data may be stale and require attention."}
                  </P>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Estimated Next Collection
              </div>
              <div className="text-sm font-semibold">
                {temporal.collectionFrequency > 0
                  ? `~${(1 / temporal.collectionFrequency).toFixed(1)} days`
                  : "Unknown"}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Collections Per Week
              </div>
              <div className="text-sm font-semibold">
                {(temporal.collectionFrequency * 7).toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Alert Section (if stale) */}
        {temporal.daysSinceLastCollection > 7 && (
          <div className="pt-2 border-t">
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <P className="text-sm font-medium text-yellow-900 mb-1">
                    Collection Staleness Warning
                  </P>
                  <P className="text-xs text-yellow-700">
                    Last collection was {temporal.daysSinceLastCollection} days
                    ago. Consider triggering a manual collection to ensure data
                    freshness.
                  </P>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
