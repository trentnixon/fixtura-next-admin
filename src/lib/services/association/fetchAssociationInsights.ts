"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  AssociationInsightsResponse,
  SportFilter,
} from "@/types/associationInsights";

/**
 * Valid sport filter values for the Association Insights API
 */
const VALID_SPORTS: SportFilter[] = [
  "Cricket",
  "AFL",
  "Hockey",
  "Netball",
  "Basketball",
];

/**
 * Fetches association admin insights from the Association Admin Insights API
 * Provides comprehensive analytics about associations including overview statistics,
 * grade/club distributions, competition insights, and detailed per-association metrics
 *
 * @param sport - Optional sport filter (Cricket, AFL, Hockey, Netball, Basketball)
 * @returns Promise<AssociationInsightsResponse> - Association insights data
 * @throws Error - If the API request fails or invalid sport filter is provided
 */
export async function fetchAssociationInsights(
  sport?: SportFilter
): Promise<AssociationInsightsResponse> {
  try {
    // Validate sport filter if provided
    if (sport && !VALID_SPORTS.includes(sport)) {
      throw new Error(
        `Invalid sport filter. Valid values are: ${VALID_SPORTS.join(", ")}`
      );
    }

    // Build query string
    const searchParams = new URLSearchParams();
    if (sport) {
      searchParams.set("sport", sport);
    }

    const endpoint = `/association/admin/insights${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    console.log(
      `[fetchAssociationInsights] Fetching association insights${
        sport ? ` for sport: ${sport}` : ""
      }`
    );
    console.log(`[fetchAssociationInsights] Endpoint: ${endpoint}`);

    const response = await axiosInstance.get<AssociationInsightsResponse>(
      endpoint
    );

    // Log response metadata for debugging
    if (response.data?.data?.meta) {
      console.log(
        `[fetchAssociationInsights] Response metadata:`,
        JSON.stringify(
          {
            generatedAt: response.data.data.meta.generatedAt,
            filters: response.data.data.meta.filters,
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
        "Invalid response structure from association insights API"
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request (invalid sport filter)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid sport filter provided:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Invalid sport filter. Valid values are: Cricket, AFL, Hockey, Netball, Basketball"
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching association insights:",
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
            "Failed to fetch association insights: Server error"
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch association insights:", {
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
          `Failed to fetch association insights: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors (including validation errors)
    console.error(
      "[Unexpected Error] Failed to fetch association insights:",
      error
    );

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching association insights. Please try again."
    );
  }
}
