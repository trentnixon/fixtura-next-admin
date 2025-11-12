"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  AccountAnalytics,
  RawAccountAnalyticsResponse,
  RawOrderHistoryItem,
  RawSubscriptionTimelineEvent,
  RawRiskIndicatorItem,
} from "@/types/analytics";
import {
  calculateTotalSpent,
  countPaidOrders,
  determineTrialConversion,
  filterTrialOrders,
  getPaymentMethod,
} from "./utils/accountAnalyticsHelpers";
import {
  logApiResponse,
  logAxiosError,
  logFetchStart,
  logUnexpectedError,
} from "./utils/accountAnalyticsLogger";

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
  logFetchStart(accountId);

  if (!accountId) {
    throw new Error("accountId is required.");
  }

  try {
    const response = await axiosInstance.get<RawAccountAnalyticsResponse>(
      `/orders/analytics/account/${accountId}`
    );

    // Log the full response for debugging
    logApiResponse(response.data);

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from account analytics API");
    }

    // Transform the API response to match our type definition
    const rawData = response.data.json || response.data;

    // Transform orderHistory from array to object with stats
    const orders: RawOrderHistoryItem[] = rawData.orderHistory || [];
    const totalOrders = orders.length;
    // Count paid orders based on paymentStatus (new field) or legacy status field
    const paidOrders = countPaidOrders(orders);
    // Calculate total spent - total is defined as number in RawOrderHistoryItem
    const totalSpent = calculateTotalSpent(orders);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Extract trial history from orders
    const trialOrders = filterTrialOrders(orders);

    // Transform the data to match our AccountAnalytics type
    const transformedData: AccountAnalytics = {
      accountId: parseInt(String(rawData.accountId || accountId)),
      accountType: rawData.accountInfo?.accountType || "",
      sport: rawData.accountInfo?.sport || "",
      createdAt: rawData.accountInfo?.createdAt || "",
      orderHistory: {
        totalOrders,
        paidOrders,
        totalSpent,
        averageOrderValue,
        orders: orders.map((order: RawOrderHistoryItem) => {
          // Handle amount - total is defined as number in RawOrderHistoryItem
          const amount = Number(order.total) || 0;

          // Determine payment method from paymentChannel
          const paymentMethod = getPaymentMethod(order.paymentChannel);

          return {
            id: order.id,
            date: order.createdAt || order.date || "",
            amount: amount,
            // Use status field from new response, fallback to checkoutStatus for backward compatibility
            status:
              order.status ||
              order.checkoutStatus ||
              order.checkout_status ||
              "",
            subscriptionTier: order.subscriptionTier || "",
            paymentMethod: paymentMethod,
            invoiceId: order.invoiceId || order.invoice_id || null,
          };
        }),
      },
      subscriptionTimeline: {
        currentSubscription:
          rawData.currentSubscription &&
          rawData.currentSubscription.tier &&
          rawData.currentSubscription.startDate &&
          rawData.currentSubscription.endDate
            ? {
                tier: rawData.currentSubscription.tier,
                startDate: rawData.currentSubscription.startDate,
                endDate: rawData.currentSubscription.endDate,
                isActive: rawData.currentSubscription.status === "Active",
                autoRenew: !rawData.currentSubscription.cancelAtPeriodEnd,
              }
            : null,
        subscriptionHistory: (rawData.subscriptionTimeline || []).map(
          (timeline: RawSubscriptionTimelineEvent) => ({
            date: timeline.date || "",
            action: (timeline.event === "started"
              ? "started"
              : timeline.event === "renewed"
              ? "renewed"
              : timeline.event === "cancelled"
              ? "cancelled"
              : timeline.event === "upgraded"
              ? "upgraded"
              : timeline.event === "downgraded"
              ? "downgraded"
              : "started") as
              | "started"
              | "renewed"
              | "cancelled"
              | "upgraded"
              | "downgraded",
            tier: timeline.subscriptionTier || "",
            amount: 0,
          })
        ),
        totalSubscriptions: rawData.renewalPatterns?.totalSubscriptions || 0,
        averageSubscriptionDuration:
          rawData.renewalPatterns?.averageSubscriptionDuration || 0,
      },
      trialUsage: {
        hasActiveTrial: rawData.trialUsage?.trialStatus === "Active",
        trialInstance:
          rawData.trialUsage?.hasTrial &&
          rawData.trialUsage.trialStartDate &&
          rawData.trialUsage.trialEndDate &&
          rawData.trialUsage.trialTier
            ? {
                startDate: rawData.trialUsage.trialStartDate,
                endDate: rawData.trialUsage.trialEndDate,
                isActive: rawData.trialUsage?.trialStatus === "Active",
                subscriptionTier: rawData.trialUsage.trialTier,
                daysRemaining: 0,
              }
            : null,
        trialHistory: trialOrders.map((order: RawOrderHistoryItem) => ({
          startDate: order.createdAt,
          endDate: order.createdAt, // API doesn't provide end date, using start date
          subscriptionTier: order.subscriptionTier || "Unknown",
          converted: determineTrialConversion(order, orders), // Trial converted if there's a paid Season Pass after it
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
      currentSubscription:
        rawData.currentSubscription &&
        rawData.currentSubscription.tier &&
        rawData.currentSubscription.status &&
        rawData.currentSubscription.startDate &&
        rawData.currentSubscription.endDate
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
          (rawData.usagePatterns?.averageOrdersPerMonth ?? 0) >= 4
            ? "high"
            : (rawData.usagePatterns?.averageOrdersPerMonth ?? 0) >= 2
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
          (rawData.riskIndicators?.totalRisks ?? 0) === 0
            ? "low"
            : (rawData.riskIndicators?.highSeverityRisks ?? 0) > 0
            ? "high"
            : "medium",
        riskFactors:
          rawData.riskIndicators?.risks?.map(
            (r: RawRiskIndicatorItem) => r.description || ""
          ) || [],
      },
      generatedAt: rawData.generatedAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    return transformedData;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      logAxiosError(error, accountId);

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch account analytics for account ${accountId}: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      logUnexpectedError(error);
      throw new Error(
        `An unexpected error occurred while fetching analytics for account ${accountId}. Please try again.`
      );
    }
  }
}
