"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

/**
 * RevenueTrendChart Component
 *
 * Displays revenue trend over time with growth/decline patterns.
 *
 * @param analytics - Account analytics data
 */
export default function RevenueTrendChart({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics?.orderHistory?.orders) {
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

  // Group orders by year and sum revenue
  const revenueByYear = analytics.orderHistory.orders.reduce((acc, order) => {
    try {
      const date = new Date(order.date);
      const yearKey = String(date.getFullYear());

      if (!acc[yearKey]) {
        acc[yearKey] = 0;
      }
      acc[yearKey] += order.amount; // Amount is in cents
      return acc;
    } catch {
      return acc;
    }
  }, {} as Record<string, number>);

  const years = Object.keys(revenueByYear).sort();
  const revenues = years.map((y) => revenueByYear[y] / 100); // Convert to dollars
  const maxRevenue = Math.max(...revenues, 1);

  // Calculate trend
  const firstHalf = revenues.slice(0, Math.floor(revenues.length / 2));
  const secondHalf = revenues.slice(Math.floor(revenues.length / 2));
  const firstHalfAvg =
    firstHalf.reduce((sum, r) => sum + r, 0) / (firstHalf.length || 1);
  const secondHalfAvg =
    secondHalf.reduce((sum, r) => sum + r, 0) / (secondHalf.length || 1);
  const trend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  const isIncreasing = trend > 0;

  const totalRevenue = revenues.reduce((sum, r) => sum + r, 0);
  const averageRevenue = totalRevenue / (years.length || 1);

  const formatYear = (yearKey: string) => {
    return yearKey;
  };

  if (years.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Revenue Trend
          </CardTitle>
          <CardDescription>No revenue data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No revenue data available for this account.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Annual revenue over time</CardDescription>
          </div>
          {!isNaN(trend) && (
            <div
              className={`flex items-center gap-1 ${
                isIncreasing ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncreasing ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {Math.abs(trend).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Chart Bars */}
          <div className="space-y-3">
            {years.map((year, index) => {
              const revenue = revenues[index];
              const percentage = (revenue / maxRevenue) * 100;

              return (
                <div key={year} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{formatYear(year)}</span>
                    <span className="font-semibold">
                      $
                      {revenue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">
                $
                {totalRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                $
                {averageRevenue.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-muted-foreground">Avg Annual</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{years.length}</p>
              <p className="text-xs text-muted-foreground">Years Active</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
