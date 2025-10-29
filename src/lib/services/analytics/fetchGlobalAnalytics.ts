"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { GlobalAnalytics } from "@/types/analytics";

/**
 * Fetches global analytics summary from the Order Analytics API
 * Provides system-wide metrics including accounts, subscriptions, trials, revenue, and churn analysis
 *
 * @returns Promise<GlobalAnalyticsResponse> - Global analytics data
 * @throws Error - If the API request fails
 */
export async function fetchGlobalAnalytics(): Promise<GlobalAnalytics> {
  try {
    console.log("[fetchGlobalAnalytics] Fetching global analytics summary");

    const response = await axiosInstance.get<GlobalAnalytics>(
      "/orders/analytics/global-summary"
    );

    // Log the full response for debugging
    console.log(
      "[fetchGlobalAnalytics] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from global analytics API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch global analytics:", {
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
          `Failed to fetch global analytics: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch global analytics:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching global analytics. Please try again."
      );
    }
  }
}
