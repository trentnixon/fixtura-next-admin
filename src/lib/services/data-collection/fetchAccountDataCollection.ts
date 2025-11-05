/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AccountStatsResponse } from "@/types/dataCollection";

/**
 * Fetches comprehensive account-specific data collection statistics from the Data Collection API.
 * Provides detailed insights including entity statistics, performance metrics, error analysis,
 * temporal patterns, account health scoring, and time series data.
 *
 * @param accountId - The account ID to fetch data collection statistics for
 * @returns Promise<AccountStatsResponse> - Account statistics data wrapped in a data property
 * @throws Error - If the API request fails, accountId is invalid, or response structure is invalid
 */
export async function fetchAccountDataCollection(
  accountId: string
): Promise<AccountStatsResponse> {
  console.log("[fetchAccountDataCollection] Input accountId:", accountId);

  // Validation: accountId is required
  if (!accountId) {
    throw new Error("accountId is required");
  }

  // Validation: accountId must be a valid string (trim whitespace)
  const trimmedAccountId = accountId.trim();
  if (!trimmedAccountId) {
    throw new Error("accountId cannot be empty");
  }

  // Validation: accountId should be a valid number format
  const accountIdNumber = Number(trimmedAccountId);
  if (isNaN(accountIdNumber) || accountIdNumber <= 0) {
    throw new Error("accountId must be a valid positive number");
  }

  try {
    // Construct the endpoint URL
    // Note: Endpoint path to be confirmed - using placeholder based on pattern
    const endpoint = `/data-collection/insights/${trimmedAccountId}`;
    console.log("[fetchAccountDataCollection] Full URL:", endpoint);

    const response = await axiosInstance.get<AccountStatsResponse>(endpoint);

    // Log the response for debugging (may be large, so consider limiting in production)
    console.log(
      "[fetchAccountDataCollection] Response received, data keys:",
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

    console.log("[fetchAccountDataCollection] Success:", {
      accountId: response.data.data.accountInfo?.accountId,
      totalCollections: response.data.data.summary?.totalCollections,
    });

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch account data collection:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        accountId: trimmedAccountId,
      });

      // Extract error message from response
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        `Failed to fetch account data collection: ${
          error.response?.status || "Unknown error"
        }`;

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors (including validation errors)
      console.error(
        "[Unexpected Error] Failed to fetch account data collection:",
        error
      );
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching account data collection. Please try again."
      );
    }
  }
}
