"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { Label, H4, SubsectionTitle, ByLine } from "@/components/type/titles";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime } from "@/utils/chart-formatters";
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

  // Get frequency status (good/fair/poor)
  const getFrequencyStatus = (
    frequency: number
  ): {
    label: string;
    badgeColor: string;
    color: string;
    icon: React.ReactNode;
  } => {
    if (frequency >= 1) {
      return {
        label: "Excellent",
        badgeColor: "bg-success-500",
        color: "text-success-600",
        icon: <TrendingUp className="w-4 h-4" />,
      };
    }
    if (frequency >= 0.5) {
      return {
        label: "Good",
        badgeColor: "bg-info-500",
        color: "text-info-600",
        icon: <Activity className="w-4 h-4" />,
      };
    }
    if (frequency >= 0.25) {
      return {
        label: "Fair",
        badgeColor: "bg-warning-500",
        color: "text-warning-600",
        icon: <TrendingDown className="w-4 h-4" />,
      };
    }
    return {
      label: "Poor",
      badgeColor: "bg-error-500",
      color: "text-error-600",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  // Get days since last collection status
  const getDaysStatus = (
    days: number
  ): {
    label: string;
    badgeColor: string;
    color: string;
    icon: React.ReactNode;
  } => {
    if (days <= 1) {
      return {
        label: "Recent",
        badgeColor: "bg-success-500",
        color: "text-success-600",
        icon: <TrendingUp className="w-4 h-4" />,
      };
    }
    if (days <= 7) {
      return {
        label: "Acceptable",
        badgeColor: "bg-info-500",
        color: "text-info-600",
        icon: <Activity className="w-4 h-4" />,
      };
    }
    if (days <= 30) {
      return {
        label: "Stale",
        badgeColor: "bg-warning-500",
        color: "text-warning-600",
        icon: <TrendingDown className="w-4 h-4" />,
      };
    }
    return {
      label: "Very Stale",
      badgeColor: "bg-error-500",
      color: "text-error-600",
      icon: <AlertCircle className="w-4 h-4" />,
    };
  };

  const frequencyStatus = getFrequencyStatus(temporal.collectionFrequency);
  const daysStatus = getDaysStatus(temporal.daysSinceLastCollection);
  const relativeTime = formatRelativeTime(temporal.lastCollectionDate);

  return (
    <ElementContainer variant="dark" border padding="md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          <SubsectionTitle className="m-0">
            Collection Frequency Analysis
          </SubsectionTitle>
        </div>
        <Badge
          className={`${frequencyStatus.badgeColor} text-white border-0 rounded-full text-sm`}
        >
          <div className="flex items-center gap-1">
            {frequencyStatus.icon}
            <span>{frequencyStatus.label} Frequency</span>
          </div>
        </Badge>
      </div>
      <ByLine className="mb-4">
        Temporal patterns and collection frequency metrics
      </ByLine>

      <div className="space-y-6">
        {/* Total Collections - Large Metric */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium m-0">Total Collections</Label>
            <H4 className="text-4xl font-bold m-0 text-indigo-600">
              {temporal.totalCollections.toLocaleString()}
            </H4>
          </div>
          <ByLine className="text-xs m-0">
            Total data collection runs tracked
          </ByLine>
        </div>

        {/* Last Collection Date */}
        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <SubsectionTitle className="text-sm m-0">
              Last Collection
            </SubsectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 p-4 rounded-lg bg-info-50 border border-info-200">
              <Label className="text-xs m-0 text-info-900">
                Last Collection Date
              </Label>
              <H4 className="text-lg font-semibold m-0 text-info-700">
                {formatDate(temporal.lastCollectionDate)}
              </H4>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-info-600" />
                <ByLine className="text-xs m-0 text-info-600">
                  {relativeTime}
                </ByLine>
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-lg bg-warning-50 border border-warning-200">
              <div className="flex items-center gap-2">
                {daysStatus.icon}
                <Label className="text-xs m-0 text-warning-900">
                  Days Since Last Collection
                </Label>
              </div>
              <div className="flex items-baseline gap-2">
                <H4 className={`text-2xl font-bold m-0 ${daysStatus.color}`}>
                  {temporal.daysSinceLastCollection}
                </H4>
                <ByLine className="text-xs m-0 text-warning-600">
                  {temporal.daysSinceLastCollection === 1 ? "day" : "days"}
                </ByLine>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  className={`${daysStatus.badgeColor} text-white border-0 rounded-full text-xs`}
                >
                  {daysStatus.label}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Collection Frequency */}
        <div className="pt-2 border-t space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            <SubsectionTitle className="text-sm m-0">
              Collection Frequency
            </SubsectionTitle>
          </div>
          <div className="space-y-4">
            {/* Frequency Metric */}
            <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium m-0 text-indigo-900">
                  Collections Per Day
                </Label>
                <div className="flex items-center gap-2">
                  {frequencyStatus.icon}
                  <H4
                    className={`text-2xl font-bold m-0 ${frequencyStatus.color}`}
                  >
                    {temporal.collectionFrequency.toFixed(2)}
                  </H4>
                </div>
              </div>
              <ByLine className="text-xs m-0 text-indigo-700">
                Average number of collections per day based on total collections
                and date range
              </ByLine>
            </div>

            {/* Frequency Interpretation */}
            <div className="rounded-lg bg-slate-100 border border-slate-200 p-3">
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-slate-600 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Label className="text-sm font-medium m-0 text-slate-900">
                    Frequency Status
                  </Label>
                  <ByLine className="text-xs m-0 text-slate-700">
                    {temporal.collectionFrequency >= 1
                      ? "Excellent frequency - collections are happening daily or more frequently."
                      : temporal.collectionFrequency >= 0.5
                      ? "Good frequency - collections occur multiple times per week."
                      : temporal.collectionFrequency >= 0.25
                      ? "Fair frequency - collections occur weekly. Consider increasing frequency for better data freshness."
                      : "Poor frequency - collections are infrequent. Data may be stale and require attention."}
                  </ByLine>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="pt-2 border-t">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs m-0">Estimated Next Collection</Label>
              <H4 className="text-sm font-semibold m-0">
                {temporal.collectionFrequency > 0
                  ? `~${(1 / temporal.collectionFrequency).toFixed(1)} days`
                  : "Unknown"}
              </H4>
            </div>
            <div className="space-y-1">
              <Label className="text-xs m-0">Collections Per Week</Label>
              <H4 className="text-sm font-semibold m-0">
                {(temporal.collectionFrequency * 7).toFixed(1)}
              </H4>
            </div>
          </div>
        </div>

        {/* Alert Section (if stale) */}
        {temporal.daysSinceLastCollection > 7 && (
          <div className="pt-2 border-t">
            <div className="rounded-lg bg-warning-50 border border-warning-200 p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <Label className="text-sm font-medium m-0 text-warning-900">
                    Collection Staleness Warning
                  </Label>
                  <ByLine className="text-xs m-0 text-warning-700">
                    Last collection was {temporal.daysSinceLastCollection} days
                    ago. Consider triggering a manual collection to ensure data
                    freshness.
                  </ByLine>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ElementContainer>
  );
}
