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
import { BarChart3, TrendingUp } from "lucide-react";

/**
 * OrderFrequencyChart Component
 *
 * Displays order frequency over time with monthly/quarterly breakdown.
 *
 * @param analytics - Account analytics data
 */
export default function OrderFrequencyChart({
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

  // Group orders by year
  const ordersByYear = analytics.orderHistory.orders.reduce((acc, order) => {
    try {
      const date = new Date(order.date);
      const yearKey = String(date.getFullYear());

      if (!acc[yearKey]) {
        acc[yearKey] = 0;
      }
      acc[yearKey]++;
      return acc;
    } catch {
      return acc;
    }
  }, {} as Record<string, number>);

  const years = Object.keys(ordersByYear).sort();
  const maxOrders = Math.max(...Object.values(ordersByYear), 1);

  // Calculate trend
  const firstHalf = years.slice(0, Math.floor(years.length / 2));
  const secondHalf = years.slice(Math.floor(years.length / 2));
  const firstHalfAvg =
    firstHalf.reduce((sum, y) => sum + (ordersByYear[y] || 0), 0) /
    (firstHalf.length || 1);
  const secondHalfAvg =
    secondHalf.reduce((sum, y) => sum + (ordersByYear[y] || 0), 0) /
    (secondHalf.length || 1);
  const trend = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  const isIncreasing = trend > 0;

  const formatYear = (yearKey: string) => {
    return yearKey;
  };

  if (years.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Order Frequency
          </CardTitle>
          <CardDescription>No order data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            No order frequency data available for this account.
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
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Order Frequency
            </CardTitle>
            <CardDescription>Season Pass purchases over time</CardDescription>
          </div>
          {!isNaN(trend) && (
            <div
              className={`flex items-center gap-1 ${
                isIncreasing ? "text-green-600" : "text-red-600"
              }`}
            >
              <TrendingUp
                className={`w-4 h-4 ${isIncreasing ? "" : "rotate-180"}`}
              />
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
            {years.map((year) => {
              const count = ordersByYear[year] || 0;
              const percentage = (count / maxOrders) * 100;

              return (
                <div key={year} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium">{formatYear(year)}</span>
                    <span className="font-semibold">
                      {count} order{count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
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
                {analytics.orderHistory.totalOrders}
              </p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{years.length}</p>
              <p className="text-xs text-muted-foreground">Years Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {years.length > 0
                  ? (analytics.orderHistory.totalOrders / years.length).toFixed(
                      1
                    )
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">Passes/Year</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
