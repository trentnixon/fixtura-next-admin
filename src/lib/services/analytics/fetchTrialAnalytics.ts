"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { TrialAnalytics } from "@/types/analytics";

/**
 * Fetches trial analytics from the Order Analytics API
 * Provides detailed insights into trial usage patterns, conversion funnels, trial success predictors,
 * engagement metrics, and trial performance analysis
 *
 * @returns Promise<TrialAnalyticsResponse> - Trial analytics data
 * @throws Error - If the API request fails
 */
export async function fetchTrialAnalytics(): Promise<TrialAnalytics> {
  try {
    console.log("[fetchTrialAnalytics] Fetching trial analytics");

    const response = await axiosInstance.get<TrialAnalytics>(
      "/orders/analytics/trial-analytics"
    );

    // Log the full response for debugging
    console.log(
      "[fetchTrialAnalytics] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from trial analytics API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch trial analytics:", {
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
          `Failed to fetch trial analytics: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch trial analytics:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching trial analytics. Please try again."
      );
    }
  }
}
