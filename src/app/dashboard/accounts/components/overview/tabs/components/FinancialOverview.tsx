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
import { TrendingUp, DollarSign, Calendar, CreditCard } from "lucide-react";

import { formatDate } from "@/lib/utils";

/**
 * FinancialOverview Component
 *
 * Displays key financial metrics for cricket club/association accounts including
 * season revenue, annual season pass value, and payment history.
 *
 * @param analytics - Account analytics data
 */
export default function FinancialOverview({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const financialSummary = analytics?.financialSummary;
  const paymentStatus = analytics?.paymentStatus;

  // Debug logging
  console.log("[FinancialOverview] analytics:", analytics);
  console.log("[FinancialOverview] financialSummary:", financialSummary);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Financial Overview
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Season Revenue */}
        <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              Total Season Revenue
            </CardTitle>
            <CardDescription>All-time customer value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              $
              {(
                (financialSummary?.totalLifetimeValue || 0) / 100
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics?.orderHistory?.totalOrders || 0} season pass
              {analytics?.orderHistory?.totalOrders !== 1 ? "es" : ""} purchased
            </p>
          </CardContent>
        </Card>

        {/* Annual Season Pass Value */}
        <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Season Pass Value
            </CardTitle>
            <CardDescription>Current season rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              $
              {(
                (financialSummary?.monthlyRecurringRevenue || 0) / 100
              ).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Annual billing cycle
            </p>
          </CardContent>
        </Card>

        {/* Renewal Status */}
        <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Renewal Status
            </CardTitle>
            <CardDescription>Season pass timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {analytics?.currentSubscription?.isActive ? "Active" : "Inactive"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics?.orderHistory?.totalOrders || 0} season
              {analytics?.orderHistory?.totalOrders !== 1 ? "s" : ""} subscribed
            </p>
          </CardContent>
        </Card>

        {/* Last Season Pass Purchase */}
        <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-500" />
              Last Season Pass
            </CardTitle>
            <CardDescription>Most recent purchase</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {paymentStatus?.lastPaymentDate
                ? formatDate(paymentStatus.lastPaymentDate)
                : "Never"}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {analytics?.orderHistory?.totalOrders || 0} season
              {analytics?.orderHistory?.totalOrders !== 1 ? "s" : ""} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status */}
      <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md mt-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Payment Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Success Rate</p>
              <p className="text-lg font-bold">
                {paymentStatus?.successRate?.toFixed(1) || 0}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Payments</p>
              <p className="text-lg font-bold">
                {paymentStatus?.totalPayments || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="text-lg font-bold text-green-600">
                {paymentStatus?.successfulPayments || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-lg font-bold text-red-600">
                {paymentStatus?.failedPayments || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Payment</p>
              <p className="text-lg font-bold">
                ${((paymentStatus?.averagePaymentAmount || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
