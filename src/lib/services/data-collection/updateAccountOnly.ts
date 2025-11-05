/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  UpdateAccountOnlyRequest,
  UpdateAccountOnlyResponse,
} from "@/types/dataCollection";

// Re-export types for convenience
export type { UpdateAccountOnlyRequest, UpdateAccountOnlyResponse };

/**
 * Triggers lightweight account metadata updates via the updateAccountOnly Redis Bull queue.
 * This is a lighter alternative to the full account sync endpoint and only updates account
 * metadata without processing competitions, teams, or games.
 *
 * @param data - Request data containing accountId and accountType
 * @returns Promise<UpdateAccountOnlyResponse> - Success response with job queued confirmation
 * @throws Error - If the API request fails, validation fails, or account is not found
 */
export async function updateAccountOnly(
  data: UpdateAccountOnlyRequest
): Promise<UpdateAccountOnlyResponse> {
  const { accountId, accountType } = data;

  console.log("[updateAccountOnly] Input:", { accountId, accountType });

  // Validation: accountId is required
  if (accountId === undefined || accountId === null) {
    throw new Error("accountId is required");
  }

  // Validation: accountType is required
  if (!accountType) {
    throw new Error("accountType is required");
  }

  // Validation: accountId must be a valid number
  const accountIdNumber = Number(accountId);
  if (isNaN(accountIdNumber) || accountIdNumber <= 0) {
    throw new Error("accountId must be a valid number");
  }

  // Validation: accountType must be "CLUB" or "ASSOCIATION" (case-sensitive)
  if (accountType !== "CLUB" && accountType !== "ASSOCIATION") {
    throw new Error('accountType must be "CLUB" or "ASSOCIATION"');
  }

  try {
    console.log(
      "[updateAccountOnly] Calling CMS backend:",
      `/api/data-collection/update-account-only`
    );

    const response = await axiosInstance.post<UpdateAccountOnlyResponse>(
      "/data-collection/update-account-only",
      {
        accountId: accountIdNumber,
        accountType,
      }
    );

    console.log("[updateAccountOnly] Success:", response.data);

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to queue account update:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        accountId: accountIdNumber,
        accountType,
      });

      // Extract error message from response
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        `Failed to queue account update: ${
          error.response?.status || "Unknown error"
        }`;

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to queue account update:",
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
