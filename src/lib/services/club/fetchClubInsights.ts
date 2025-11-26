"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { ClubInsightsResponse, ClubSportFilter } from "@/types/clubInsights";

/**
 * Valid sport filter values for the Club Insights API
 */
const VALID_SPORTS: ClubSportFilter[] = [
  "Cricket",
  "AFL",
  "Hockey",
  "Netball",
  "Basketball",
];

/**
 * Fetches club admin insights from the Club Admin Insights API.
 * Provides comprehensive analytics about clubs including overview statistics,
 * distributions, club listings, team/account insights, and competition timelines.
 *
 * @param sport - Required sport filter (Cricket, AFL, Hockey, Netball, Basketball)
 * @returns Promise<ClubInsightsResponse> - Club insights data
 * @throws Error - If the API request fails, sport is missing, or invalid sport filter is provided
 */
export async function fetchClubInsights(
  sport: ClubSportFilter
): Promise<ClubInsightsResponse> {
  try {
    // Validate sport filter is provided
    if (!sport) {
      throw new Error(
        "Sport query parameter is required. Valid values are: Cricket, AFL, Hockey, Netball, Basketball"
      );
    }

    // Validate sport filter value
    if (!VALID_SPORTS.includes(sport)) {
      throw new Error(
        `Invalid sport value. Valid values are: ${VALID_SPORTS.join(", ")}`
      );
    }

    // Build query string
    const searchParams = new URLSearchParams();
    searchParams.set("sport", sport);

    const endpoint = `/club/admin/insights?${searchParams.toString()}`;

    console.log(
      `[fetchClubInsights] Fetching club insights for sport: ${sport}`
    );
    console.log(`[fetchClubInsights] Endpoint: ${endpoint}`);

    const response = await axiosInstance.get<ClubInsightsResponse>(endpoint);

    // Log response metadata for debugging
    if (response.data?.data?.meta) {
      console.log(
        `[fetchClubInsights] Response metadata:`,
        JSON.stringify(
          {
            generatedAt: response.data.data.meta.generatedAt,
            sport: response.data.data.meta.sport,
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
      throw new Error("Invalid response structure from club insights API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request (missing or invalid sport parameter)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid or missing sport parameter:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          sport,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Sport query parameter is required. Valid values are: Cricket, AFL, Hockey, Netball, Basketball"
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching club insights:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            sport,
          }
        );

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to fetch club insights: Server error"
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch club insights:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        sport,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch club insights: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors (including validation errors)
    console.error("[Unexpected Error] Failed to fetch club insights:", error);

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching club insights. Please try again."
    );
  }
}
