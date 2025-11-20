/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export interface SyncAccountResultsRequest {
  accountId: number;
}

export interface SyncAccountResultsResponse {
  success: boolean;
  jobId: string;
  accountId: number;
  message: string;
  queueName: string;
}

/**
 * Triggers a results-only scrape for an account.
 * This updates fixture results without triggering asset creation.
 *
 * @param data - Request data containing accountId
 * @returns Promise<SyncAccountResultsResponse> - Success response with job queued confirmation
 * @throws Error - If the API request fails, validation fails, or account is not found
 */
export async function syncAccountResults(
  data: SyncAccountResultsRequest
): Promise<SyncAccountResultsResponse> {
  const { accountId } = data;

  console.log("[syncAccountResults] Input:", { accountId });

  // Validation: accountId is required
  if (accountId === undefined || accountId === null) {
    throw new Error("accountId is required");
  }

  // Validation: accountId must be a valid number
  const accountIdNumber = Number(accountId);
  if (isNaN(accountIdNumber) || accountIdNumber <= 0) {
    throw new Error("accountId must be a valid positive number");
  }

  try {
    const endpoint = `/result-collection/scrape-results-only`;
    console.log("[syncAccountResults] Calling CMS backend:", endpoint);

    const response = await axiosInstance.post<SyncAccountResultsResponse>(
      endpoint,
      {
        accountId: accountIdNumber,
      }
    );

    console.log("[syncAccountResults] Success:", response.data);

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to queue results-only scrape:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        accountId: accountIdNumber,
      });

      // Extract error message from response
      // Handle different error response formats
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        `Failed to queue results-only scrape: ${
          error.response?.status || "Unknown error"
        }`;

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to queue results-only scrape:",
        error
      );
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    }
  }
}
