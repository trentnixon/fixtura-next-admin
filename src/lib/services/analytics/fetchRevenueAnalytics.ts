"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RevenueAnalytics } from "@/types/analytics";

/**
 * Fetches revenue analytics from the Order Analytics API
 * Provides comprehensive revenue analysis including monthly/quarterly trends, revenue by subscription tier,
 * payment method analysis, billing cycles, revenue projections, customer lifetime value, and seasonal patterns
 *
 * @returns Promise<RevenueAnalyticsResponse> - Revenue analytics data
 * @throws Error - If the API request fails
 */
export async function fetchRevenueAnalytics(): Promise<RevenueAnalytics> {
  try {
    console.log("[fetchRevenueAnalytics] Fetching revenue analytics");

    const response = await axiosInstance.get<RevenueAnalytics>(
      "/orders/analytics/revenue-analytics"
    );

    // Log the full response for debugging
    console.log(
      "[fetchRevenueAnalytics] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from revenue analytics API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch revenue analytics:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch revenue analytics: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch revenue analytics:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching revenue analytics. Please try again."
      );
    }
  }
}
