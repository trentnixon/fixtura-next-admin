/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AccountAnalytics } from "@/types/analytics";

// Raw API response type
interface RawAccountAnalyticsResponse {
  json?: any;
  [key: string]: any;
}

/**
 * Fetches account-specific analytics from the Order Analytics API
 * Provides detailed insights for individual accounts including order history, subscription timeline,
 * trial usage, payment status, renewal patterns, and account health scoring
 *
 * @param accountId - The account ID to fetch analytics for
 * @returns Promise<AccountAnalyticsResponse> - Account analytics data
 * @throws Error - If the API request fails or accountId is invalid
 */
export async function fetchAccountAnalytics(
  accountId: string
): Promise<AccountAnalytics> {
  console.log("[fetchAccountAnalytics] Input accountId:", accountId);

  if (!accountId) {
    throw new Error("accountId is required.");
  }

  try {
    console.log(
      "[fetchAccountAnalytics] Full URL:",
      `/orders/analytics/account/${accountId}`
    );

    const response = await axiosInstance.get<RawAccountAnalyticsResponse>(
      `/orders/analytics/account/${accountId}`
    );

    // Log the full response for debugging
    console.log(
      "[fetchAccountAnalytics] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from account analytics API");
    }

    // Transform the API response to match our type definition
    const rawData = response.data.json || response.data;

    // Transform orderHistory from array to object with stats
    const orders = rawData.orderHistory || [];
    const totalOrders = orders.length;
    const paidOrders = orders.filter(
      (order: { status?: boolean }) => order.status === true
    ).length;
    const totalSpent = orders.reduce(
      (sum: number, order: { total?: string }) =>
        sum + (parseFloat(order.total || "0") || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Extract trial history from orders
    const trialOrders = orders.filter(
      (order: { subscriptionTier?: string }) =>
        order.subscriptionTier?.toLowerCase().includes("trial") ||
        order.subscriptionTier?.toLowerCase().includes("free")
    );

    // Determine if trial was converted by checking if there's a paid Season Pass after the trial
    const determineTrialConversion = (trialOrder: any) => {
      const trialDate = new Date(trialOrder.createdAt);
      // Check if there's any paid Season Pass order after the trial
      const hasPaidSubscription = orders.some((order: any) => {
        const orderDate = new Date(order.createdAt);
        return (
          order.status === true && // Paid order
          order.subscriptionTier?.toLowerCase().includes("season") &&
          orderDate > trialDate
        );
      });
      return hasPaidSubscription;
    };

    // Transform the data to match our AccountAnalytics type
    const transformedData: AccountAnalytics = {
      accountId: parseInt(rawData.accountId || accountId),
      accountType: rawData.accountInfo?.accountType || "",
      sport: rawData.accountInfo?.sport || "",
      createdAt: rawData.accountInfo?.createdAt || "",
      orderHistory: {
        totalOrders,
        paidOrders,
        totalSpent,
        averageOrderValue,
        orders: orders.map((order: any) => ({
          id: order.id,
          date: order.createdAt,
          amount: parseFloat(order.total) || 0,
          status:
            order.status === true
              ? "Paid"
              : order.status === false
              ? "Unpaid"
              : "Unknown",
          subscriptionTier: order.subscriptionTier,
          paymentMethod: "Stripe", // Default or extract from order if available
        })),
      },
      subscriptionTimeline: {
        currentSubscription: rawData.currentSubscription
          ? {
              tier: rawData.currentSubscription.tier,
              startDate: rawData.currentSubscription.startDate,
              endDate: rawData.currentSubscription.endDate,
              isActive: rawData.currentSubscription.status === "Active",
              autoRenew: !rawData.currentSubscription.cancelAtPeriodEnd,
            }
          : null,
        subscriptionHistory: (rawData.subscriptionTimeline || []).map(
          (timeline: any) => ({
            date: timeline.date,
            event: timeline.event,
            tier: timeline.subscriptionTier,
            status: timeline.status,
          })
        ),
        totalSubscriptions: rawData.renewalPatterns?.totalSubscriptions || 0,
        averageSubscriptionDuration:
          rawData.renewalPatterns?.averageSubscriptionDuration || 0,
      },
      trialUsage: {
        hasActiveTrial: rawData.trialUsage?.trialStatus === "Active",
        trialInstance: rawData.trialUsage?.hasTrial
          ? {
              startDate: rawData.trialUsage.trialStartDate,
              endDate: rawData.trialUsage.trialEndDate,
              isActive: rawData.trialUsage?.trialStatus === "Active",
              subscriptionTier: rawData.trialUsage.trialTier,
              daysRemaining: 0,
            }
          : null,
        trialHistory: trialOrders.map((order: any) => ({
          startDate: order.createdAt,
          endDate: order.createdAt, // API doesn't provide end date, using start date
          subscriptionTier: order.subscriptionTier || "Unknown",
          converted: determineTrialConversion(order), // Trial converted if there's a paid Season Pass after it
        })),
        totalTrials: trialOrders.length,
        trialConversionRate: rawData.trialUsage?.trialConversion ? 100 : 0,
      },
      paymentStatus: {
        successRate: rawData.paymentStatus?.paymentSuccessRate || 0,
        totalPayments: rawData.paymentStatus?.totalOrders || 0,
        successfulPayments: rawData.paymentStatus?.paidOrders || 0,
        failedPayments: rawData.paymentStatus?.failedOrders || 0,
        lastPaymentDate: rawData.paymentStatus?.lastPaymentDate || null,
        averagePaymentAmount: totalOrders > 0 ? totalSpent / totalOrders : 0,
      },
      renewalPatterns: {
        hasRenewed: (rawData.renewalPatterns?.renewalRate || 0) > 0,
        renewalCount: rawData.renewalPatterns?.renewalRate || 0,
        averageRenewalInterval: 0, // Not in API response
        lastRenewalDate: rawData.renewalPatterns?.lastRenewalDate || null,
        nextExpectedRenewal: rawData.currentSubscription?.endDate || null,
        renewalConsistency: "unknown",
      },
      accountHealthScore: {
        overallScore: rawData.accountHealthScore?.score || 0,
        breakdown: {
          accountSetup:
            rawData.accountHealthScore?.breakdown?.accountSetup || 0,
          accountActivity:
            rawData.accountHealthScore?.breakdown?.accountActivity || 0,
          paymentSuccess:
            rawData.accountHealthScore?.breakdown?.paymentSuccess || 0,
          subscriptionContinuity:
            rawData.accountHealthScore?.breakdown?.subscriptionContinuity || 0,
          trialConversion:
            rawData.accountHealthScore?.breakdown?.trialConversion || 0,
        },
        healthLevel:
          (rawData.accountHealthScore?.percentage || 0) >= 80
            ? "excellent"
            : (rawData.accountHealthScore?.percentage || 0) >= 60
            ? "good"
            : (rawData.accountHealthScore?.percentage || 0) >= 40
            ? "fair"
            : (rawData.accountHealthScore?.percentage || 0) >= 20
            ? "poor"
            : "critical",
      },
      currentSubscription: rawData.currentSubscription
        ? {
            tier: rawData.currentSubscription.tier,
            status: rawData.currentSubscription.status,
            startDate: rawData.currentSubscription.startDate,
            endDate: rawData.currentSubscription.endDate,
            isActive: rawData.currentSubscription.status === "Active",
            autoRenew: !rawData.currentSubscription.cancelAtPeriodEnd,
          }
        : null,
      financialSummary: {
        totalLifetimeValue: rawData.financialSummary?.lifetimeValue || 0,
        monthlyRecurringRevenue: rawData.currentSubscription?.price || 0,
        averageMonthlySpend: rawData.financialSummary?.averageOrderValue || 0,
        paymentMethod: "Stripe", // Default
        billingCycle: "Annual", // Could extract from currentSubscription
      },
      usagePatterns: {
        orderFrequency:
          rawData.usagePatterns?.averageOrdersPerMonth >= 4
            ? "high"
            : rawData.usagePatterns?.averageOrdersPerMonth >= 2
            ? "medium"
            : "low",
        seasonalPatterns: [],
        peakUsageMonths: Object.keys(
          rawData.usagePatterns?.monthlyOrderFrequency || {}
        ),
        averageDaysBetweenOrders: 0,
      },
      riskIndicators: {
        paymentFailures: rawData.paymentStatus?.failedOrders || 0,
        subscriptionCancellations:
          rawData.renewalPatterns?.cancelledSubscriptions || 0,
        longInactivityPeriods: 0,
        downgradeHistory: 0,
        riskLevel:
          rawData.riskIndicators?.totalRisks === 0
            ? "low"
            : rawData.riskIndicators?.highSeverityRisks > 0
            ? "high"
            : "medium",
        riskFactors:
          rawData.riskIndicators?.risks?.map((r: any) => r.description) || [],
      },
      generatedAt: rawData.generatedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    return transformedData;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch account analytics:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        accountId,
      });

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch account analytics for account ${accountId}: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch account analytics:",
        error
      );
      throw new Error(
        `An unexpected error occurred while fetching analytics for account ${accountId}. Please try again.`
      );
    }
  }
}
