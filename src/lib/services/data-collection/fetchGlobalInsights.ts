/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  GlobalInsightsResponse,
  UseGlobalInsightsOptions,
} from "@/types/dataCollection";

/**
 * Validates ISO date format string
 * @param dateString - Date string to validate
 * @returns true if valid ISO date format, false otherwise
 */
function isValidISODate(dateString: string): boolean {
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
  if (!isoDateRegex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Validates sport value against allowed values
 * @param sport - Sport value to validate
 * @returns true if valid sport, false otherwise
 */
function isValidSport(sport: string): boolean {
  const validSports = ["Cricket", "AFL", "Hockey", "Netball", "Basketball"];
  return validSports.includes(sport);
}

/**
 * Validates sortBy value against allowed values
 * @param sortBy - SortBy value to validate
 * @returns true if valid sortBy, false otherwise
 */
function isValidSortBy(sortBy: string): boolean {
  const validSortBy = ["whenWasTheLastCollection", "TimeTaken", "MemoryUsage"];
  return validSortBy.includes(sortBy);
}

/**
 * Fetches global data collection insights from the Data Collection API.
 * Provides high-level performance and monitoring metrics across all data collections
 * in the system, focusing on time, performance, and operational metrics.
 *
 * @param options - Optional query parameters for filtering and sorting results
 * @returns Promise<GlobalInsightsResponse> - Global insights data wrapped in a data property
 * @throws Error - If the API request fails, validation fails, or response structure is invalid
 */
export async function fetchGlobalInsights(
  options?: UseGlobalInsightsOptions
): Promise<GlobalInsightsResponse> {
  console.log("[fetchGlobalInsights] Input options:", options);

  // Validation: dateFrom format (ISO format)
  if (options?.dateFrom) {
    const trimmedDateFrom = options.dateFrom.trim();
    if (!isValidISODate(trimmedDateFrom)) {
      throw new Error(
        "dateFrom must be a valid ISO 8601 date format (e.g., '2024-01-01' or '2024-01-01T10:30:00.000Z')"
      );
    }
  }

  // Validation: dateTo format (ISO format)
  if (options?.dateTo) {
    const trimmedDateTo = options.dateTo.trim();
    if (!isValidISODate(trimmedDateTo)) {
      throw new Error(
        "dateTo must be a valid ISO 8601 date format (e.g., '2024-01-01' or '2024-01-01T10:30:00.000Z')"
      );
    }
  }

  // Validation: date range logic (dateFrom should be before dateTo)
  if (options?.dateFrom && options?.dateTo) {
    const dateFrom = new Date(options.dateFrom);
    const dateTo = new Date(options.dateTo);
    if (dateFrom > dateTo) {
      throw new Error("dateFrom must be before or equal to dateTo");
    }
  }

  // Validation: sport enum value
  if (options?.sport) {
    const trimmedSport = options.sport.trim();
    if (!isValidSport(trimmedSport)) {
      throw new Error(
        `sport must be one of: Cricket, AFL, Hockey, Netball, Basketball. Received: ${trimmedSport}`
      );
    }
  }

  // Validation: accountType enum value
  if (options?.accountType) {
    if (
      options.accountType !== "CLUB" &&
      options.accountType !== "ASSOCIATION"
    ) {
      throw new Error(
        `accountType must be either 'CLUB' or 'ASSOCIATION'. Received: ${options.accountType}`
      );
    }
  }

  // Validation: sortBy enum value
  if (options?.sortBy) {
    const trimmedSortBy = options.sortBy.trim();
    if (!isValidSortBy(trimmedSortBy)) {
      throw new Error(
        `sortBy must be one of: whenWasTheLastCollection, TimeTaken, MemoryUsage. Received: ${trimmedSortBy}`
      );
    }
  }

  // Validation: sortOrder enum value
  if (options?.sortOrder) {
    if (options.sortOrder !== "asc" && options.sortOrder !== "desc") {
      throw new Error(
        `sortOrder must be either 'asc' or 'desc'. Received: ${options.sortOrder}`
      );
    }
  }

  // Validation: limit numeric value (must be positive)
  if (options?.limit !== undefined) {
    const limitNumber = Number(options.limit);
    if (
      isNaN(limitNumber) ||
      limitNumber <= 0 ||
      !Number.isInteger(limitNumber)
    ) {
      throw new Error(
        `limit must be a positive integer. Received: ${options.limit}`
      );
    }
  }

  try {
    // Build query string from optional parameters
    const params = new URLSearchParams();

    if (options?.sport) {
      params.append("sport", options.sport.trim());
    }
    if (options?.accountType) {
      params.append("accountType", options.accountType);
    }
    if (options?.hasError !== undefined) {
      params.append("hasError", String(options.hasError));
    }
    if (options?.dateFrom) {
      params.append("dateFrom", options.dateFrom.trim());
    }
    if (options?.dateTo) {
      params.append("dateTo", options.dateTo.trim());
    }
    if (options?.sortBy) {
      params.append("sortBy", options.sortBy.trim());
    }
    if (options?.sortOrder) {
      params.append("sortOrder", options.sortOrder);
    }
    if (options?.limit !== undefined) {
      params.append("limit", String(options.limit));
    }

    // Construct the endpoint URL with query string
    const queryString = params.toString();
    const endpoint = `/data-collection/insights${
      queryString ? `?${queryString}` : ""
    }`;
    console.log("[fetchGlobalInsights] Full URL:", endpoint);

    const response = await axiosInstance.get<GlobalInsightsResponse>(endpoint);

    // Log the response for debugging (may be large, so consider limiting in production)
    console.log(
      "[fetchGlobalInsights] Response received, data keys:",
      response.data?.data ? Object.keys(response.data.data) : "No data property"
    );

    // Validate response structure
    if (!response.data) {
      throw new Error("Invalid response structure from data collection API");
    }

    // Validate that the data property exists
    if (!response.data.data) {
      throw new Error("Response data is missing the required 'data' property");
    }

    console.log("[fetchGlobalInsights] Success:", {
      totalCollections: response.data.data.summary?.totalCollections,
      errorRate: response.data.data.summary?.errorRate,
      generatedAt: response.data.data.generatedAt,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch global insights:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        options: options,
      });

      // Extract error message from response
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch global insights: ${
          error.response?.status || "Unknown error"
        }`;

      // Handle specific status codes
      if (error.response?.status === 401) {
        throw new Error(
          "Authentication failed. Please check your credentials and try again."
        );
      }
      if (error.response?.status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view global insights."
        );
      }
      if (error.response?.status === 404) {
        throw new Error(
          "Global insights endpoint not found. Please verify the endpoint URL."
        );
      }
      if (error.response?.status === 500) {
        throw new Error(
          "Server error occurred while fetching global insights. Please try again later."
        );
      }

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors (including validation errors)
      console.error(
        "[Unexpected Error] Failed to fetch global insights:",
        error
      );
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching global insights. Please try again."
      );
    }
  }
}
