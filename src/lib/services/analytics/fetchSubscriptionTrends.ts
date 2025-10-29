"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { SubscriptionTrends } from "@/types/analytics";

/**
 * Fetches subscription trends analytics from the Order Analytics API
 * Analyzes subscription lifecycle patterns, renewal vs churn rates, tier migration trends,
 * subscription duration patterns, and customer journey analysis
 *
 * @returns Promise<SubscriptionTrendsResponse> - Subscription trends analytics data
 * @throws Error - If the API request fails
 */
export async function fetchSubscriptionTrends(): Promise<SubscriptionTrends> {
  try {
    console.log(
      "[fetchSubscriptionTrends] Fetching subscription trends analytics"
    );

    const response = await axiosInstance.get<SubscriptionTrends>(
      "/orders/analytics/subscription-trends"
    );

    // Log the full response for debugging
    console.log(
      "[fetchSubscriptionTrends] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error(
        "Invalid response structure from subscription trends API"
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch subscription trends:", {
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
          `Failed to fetch subscription trends: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch subscription trends:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching subscription trends. Please try again."
      );
    }
  }
}
