"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Calendar, Activity, BarChart3, Clock } from "lucide-react";

/**
 * UsagePatterns Component
 *
 * Displays account usage patterns including order frequency, seasonal patterns,
 * peak usage months, and average days between orders.
 *
 * @param analytics - Account analytics data
 */
export default function UsagePatterns({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.usagePatterns) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const {
    orderFrequency,
    seasonalPatterns,
    peakUsageMonths,
    averageDaysBetweenOrders,
  } = analytics.usagePatterns;

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFrequencyDescription = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "high":
        return "Very active account with frequent orders";
      case "medium":
        return "Moderate activity level with regular orders";
      case "low":
        return "Lower activity with infrequent orders";
      default:
        return "Activity level assessment";
    }
  };

  const formatMonth = (monthKey: string) => {
    // Handle formats like "2025-10" or "2025-Q4"
    if (monthKey.includes("-Q")) {
      return monthKey;
    }
    try {
      const [year, month] = monthKey.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      return monthKey;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-500" />
          Usage Patterns
        </CardTitle>
        <CardDescription>
          Account activity patterns and usage insights
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Frequency */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Order Frequency</span>
            </div>
            <Badge className={getFrequencyColor(orderFrequency)}>
              {orderFrequency.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {getFrequencyDescription(orderFrequency)}
          </p>
        </div>

        {/* Peak Usage Months */}
        {peakUsageMonths && peakUsageMonths.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Peak Usage Months</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {peakUsageMonths.map((month, index) => (
                <Badge key={index} variant="secondary">
                  {formatMonth(month)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Seasonal Patterns */}
        {seasonalPatterns && seasonalPatterns.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Seasonal Patterns</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {seasonalPatterns.map((pattern, index) => (
                <Badge key={index} variant="outline">
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Average Days Between Orders */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">
                  Average Days Between Orders
                </p>
                <p className="text-xs text-muted-foreground">
                  Time span between consecutive orders
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                {averageDaysBetweenOrders.toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">days</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
