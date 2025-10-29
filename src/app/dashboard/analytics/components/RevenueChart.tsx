"use client";

import { useRevenueAnalytics } from "@/hooks/analytics/useRevenueAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RevenueChart Component
 *
 * Displays monthly/quarterly revenue trends with visual representation of revenue patterns.
 */
export function RevenueChart() {
  const { data, isLoading, error } = useRevenueAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Revenue Data</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const analytics = data;
  const monthlyRevenue = analytics.monthlyQuarterlyRevenueTrends.monthlyRevenue;
  const revenueEntries = Object.entries(monthlyRevenue).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue Trends</CardTitle>
        <CardDescription>
          Total: $
          {(
            analytics.monthlyQuarterlyRevenueTrends.totalRevenue / 100
          ).toLocaleString()}{" "}
          | Avg: $
          {(
            analytics.monthlyQuarterlyRevenueTrends.averageMonthlyRevenue / 100
          ).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {revenueEntries.map(([month, revenue]) => (
            <div key={month} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium min-w-[100px]">
                  {month}
                </span>
                <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{
                      width: `${
                        (revenue /
                          analytics.monthlyQuarterlyRevenueTrends
                            .totalRevenue) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-sm font-bold min-w-[80px] text-right">
                ${(revenue / 100).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
