"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { CohortAnalysis } from "@/types/analytics";

/**
 * Fetches cohort analysis from the Order Analytics API
 * Provides comprehensive customer cohort analysis including acquisition cohorts, retention analysis,
 * lifecycle stages, revenue patterns, churn analysis, and customer segmentation
 *
 * @returns Promise<CohortAnalysisResponse> - Cohort analysis data
 * @throws Error - If the API request fails
 */
export async function fetchCohortAnalysis(): Promise<CohortAnalysis> {
  try {
    console.log("[fetchCohortAnalysis] Fetching cohort analysis");

    const response = await axiosInstance.get<CohortAnalysis>(
      "/orders/analytics/cohort-analysis"
    );

    // Log the full response for debugging
    console.log(
      "[fetchCohortAnalysis] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure (API returns data directly)
    if (!response.data) {
      throw new Error("Invalid response structure from cohort analysis API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch cohort analysis:", {
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
          `Failed to fetch cohort analysis: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch cohort analysis:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching cohort analysis. Please try again."
      );
    }
  }
}
