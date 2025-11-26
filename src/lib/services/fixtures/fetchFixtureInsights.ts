"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { FixtureInsightsResponse } from "@/types/fixtureInsights";

/**
 * Fetches fixture insights from the Fixture Insights API
 * Provides comprehensive analytics about fixtures including overview statistics,
 * categorized summaries (by association, competition, grade), charts, and distributions
 *
 * @returns Promise<FixtureInsightsResponse> - Fixture insights data
 * @throws Error - If the API request fails
 */
export async function fetchFixtureInsights(): Promise<FixtureInsightsResponse> {
  try {
    const endpoint = `/game-meta-data/admin/insights`;

    console.log(`[fetchFixtureInsights] Fetching fixture insights`);
    console.log(`[fetchFixtureInsights] Endpoint: ${endpoint}`);

    const response = await axiosInstance.get<FixtureInsightsResponse>(endpoint);

    // Log response metadata for debugging
    if (response.data?.data?.meta) {
      console.log(
        `[fetchFixtureInsights] Response metadata:`,
        JSON.stringify(
          {
            generatedAt: response.data.data.meta.generatedAt,
            dateRange: response.data.data.meta.dateRange,
            dataPoints: response.data.data.meta.dataPoints,
            performance: response.data.data.meta.performance,
          },
          null,
          2
        )
      );
    }

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response structure from fixture insights API"
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request
      if (error.response?.status === 400) {
        console.error("[Axios Error] Bad request to fixture insights API:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Invalid request to fixture insights API"
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching fixture insights:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
          }
        );

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to fetch fixture insights: Server error"
        );
      }

      // Handle timeout errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error(
          "[Axios Error] Request timeout while fetching fixture insights:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout,
          }
        );

        throw new Error(
          "Request timeout: The fixture insights API took too long to respond. Please try again."
        );
      }

      // Handle network errors
      if (error.code === "ERR_NETWORK" || !error.response) {
        console.error(
          "[Axios Error] Network error while fetching fixture insights:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            code: error.code,
          }
        );

        throw new Error(
          "Network error: Unable to connect to the fixture insights API. Please check your connection and try again."
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch fixture insights:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch fixture insights: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors
    console.error(
      "[Unexpected Error] Failed to fetch fixture insights:",
      error
    );

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching fixture insights. Please try again."
    );
  }
}

