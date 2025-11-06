/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  AdminAccountLookupResponse,
  AdminAccountLookupErrorResponse,
} from "@/types/adminAccountLookup";

/**
 * Fetches all accounts from the admin lookup endpoint.
 * This endpoint provides a formatted, comprehensive list of all accounts
 * optimized for admin lookup tables, including subscription information,
 * account status, and related entities (clubs/associations).
 *
 * @returns Promise<AdminAccountLookupResponse> - Accounts data with meta information
 * @throws Error - If the API request fails or response structure is invalid
 */
export async function fetchAdminAccountLookup(): Promise<AdminAccountLookupResponse> {
  try {
    // Send GET request with no query parameters (endpoint returns all accounts)
    // Note: Endpoint path may need to be adjusted based on backend configuration
    const response = await axiosInstance.get<AdminAccountLookupResponse>(
      `/account/admin/lookup`
    );

    // Validate response structure
    if (!response.data) {
      throw new Error("Response data is missing");
    }

    if (!Array.isArray(response.data.data)) {
      throw new Error(
        "Response data is missing the required 'data' property or 'data' is not an array"
      );
    }

    if (!response.data.meta || typeof response.data.meta.total !== "number") {
      throw new Error(
        "Response data is missing the required 'meta.total' property"
      );
    }

    // Log success for debugging
    console.log("[fetchAdminAccountLookup] Success:", {
      totalAccounts: response.data.meta.total,
      accountsCount: response.data.data.length,
    });

    return response.data;
  } catch (error: any) {
    // Check if error is from axios (either AxiosError instance or transformed error object)
    const isAxiosError =
      error instanceof AxiosError ||
      (error &&
        typeof error === "object" &&
        "status" in error &&
        "code" in error);

    if (isAxiosError) {
      // Handle both AxiosError instances and transformed error objects from interceptor
      const status = error.response?.status || error.status;
      const errorData = error.response?.data || error.data;
      const errorResponse = errorData as
        | AdminAccountLookupErrorResponse
        | undefined;

      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch admin account lookup:", {
        message: error.message,
        url: error.config?.url || "unknown",
        method: error.config?.method || "GET",
        status: status,
        data: errorData,
      });

      // Extract error message from response
      const errorMessage =
        errorResponse?.error?.message ||
        errorData?.error?.message ||
        errorData?.message ||
        error.message ||
        `Failed to fetch admin account lookup: ${status || "Unknown error"}`;

      // Handle specific status codes
      if (status === 401) {
        throw new Error(
          "Authentication failed. Please check your credentials and try again."
        );
      }
      if (status === 403) {
        throw new Error(
          "Access denied. You do not have permission to view admin account lookup."
        );
      }
      if (status === 404) {
        throw new Error(
          `Admin account lookup endpoint not found (404). Please verify the endpoint URL: /account/admin/lookup. The endpoint may not be implemented on the backend yet.`
        );
      }
      if (status === 500) {
        throw new Error(
          "Server error occurred while fetching admin account lookup. Please try again later."
        );
      }

      // Throw a standardized error
      throw new Error(errorMessage);
    } else {
      // Handle non-Axios errors (including validation errors)
      console.error(
        "[Unexpected Error] Failed to fetch admin account lookup:",
        error
      );
      throw error instanceof Error
        ? error
        : new Error("An unexpected error occurred. Please try again.");
    }
  }
}
