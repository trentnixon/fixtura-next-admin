"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  FixtureDetailsResponse,
  FixtureFilters,
} from "@/types/fixtureInsights";

/**
 * Fetches detailed fixture data from the Fixture Details API
 * Returns a filtered list of fixtures based on optional filters (association, grade, competition)
 *
 * @param filters - Optional filters to apply (association, grade, competition)
 * @returns Promise<FixtureDetailsResponse> - Filtered fixture details data
 * @throws Error - If the API request fails or invalid filters are provided
 */
export async function fetchFixtureDetails(
  filters?: FixtureFilters
): Promise<FixtureDetailsResponse> {
  try {
    // Build query string from filters
    const searchParams = new URLSearchParams();
    if (filters?.association) {
      searchParams.set("association", filters.association.toString());
    }
    if (filters?.grade) {
      searchParams.set("grade", filters.grade.toString());
    }
    if (filters?.competition) {
      searchParams.set("competition", filters.competition.toString());
    }

    const endpoint = `/game-meta-data/admin/fixtures${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    console.log(`[fetchFixtureDetails] Fetching fixture details`, {
      filters,
      endpoint,
    });

    const response = await axiosInstance.get<FixtureDetailsResponse>(endpoint);

    // Log response metadata for debugging
    if (response.data?.data?.meta) {
      console.log(
        `[fetchFixtureDetails] Response metadata:`,
        JSON.stringify(
          {
            total: response.data.data.meta.total,
            dateRange: response.data.data.meta.dateRange,
          },
          null,
          2
        )
      );
    }

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error(
        "Invalid response structure from fixture details API"
      );
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request (invalid filters)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid filters provided:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          filters,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Invalid filters provided. Please check your filter values and try again."
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching fixture details:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            filters,
          }
        );

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to fetch fixture details: Server error"
        );
      }

      // Handle timeout errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error(
          "[Axios Error] Request timeout while fetching fixture details:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout,
            filters,
          }
        );

        throw new Error(
          "Request timeout: The fixture details API took too long to respond. Please try again."
        );
      }

      // Handle network errors
      if (error.code === "ERR_NETWORK" || !error.response) {
        console.error(
          "[Axios Error] Network error while fetching fixture details:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            code: error.code,
            filters,
          }
        );

        throw new Error(
          "Network error: Unable to connect to the fixture details API. Please check your connection and try again."
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch fixture details:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        filters,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch fixture details: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors
    console.error(
      "[Unexpected Error] Failed to fetch fixture details:",
      error
    );

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching fixture details. Please try again."
    );
  }
}

