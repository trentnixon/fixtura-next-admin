"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RerenderRequestAdminResponse } from "@/types/rerender-request";

/**
 * Fetches all rerender requests for admin display from the CMS
 * Provides all rerender requests with metadata including total count
 *
 * @returns Promise<RerenderRequestAdminResponse> - Rerender requests data with metadata
 * @throws Error - If the API request fails
 */
export async function fetchRerenderRequests(): Promise<RerenderRequestAdminResponse> {
  try {
    console.log(
      "[fetchRerenderRequests] Fetching all rerender requests"
    );

    const response = await axiosInstance.get<RerenderRequestAdminResponse>(
      "/rerender-request/admin/all"
    );

    // Log the full response for debugging
    console.log(
      "[fetchRerenderRequests] Full response:",
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error("Invalid response structure from rerender request API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch rerender requests:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Throw a standardized error
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch rerender requests: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch rerender requests:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching rerender requests. Please try again."
      );
    }
  }
}

