"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RerenderRequestDetailResponse } from "@/types/rerender-request";

/**
 * Fetches a single rerender request by ID with full details from the CMS
 * Provides complete rerender request information including account and render details
 *
 * @param id - The rerender request ID
 * @returns Promise<RerenderRequestDetailResponse> - Rerender request detail data
 * @throws Error - If the API request fails
 */
export async function fetchRerenderRequestById(
  id: number
): Promise<RerenderRequestDetailResponse> {
  if (!id) {
    throw new Error("Rerender request ID is required");
  }

  try {
    console.log(
      `[fetchRerenderRequestById] Fetching rerender request ${id}`
    );

    const response = await axiosInstance.get<RerenderRequestDetailResponse>(
      `/rerender-request/admin/${id}`
    );

    // Log the full response for debugging
    console.log(
      `[fetchRerenderRequestById] Full response:`,
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from rerender request detail API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch rerender request by ID:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Handle specific error status codes
      if (error.response?.status === 404) {
        throw new Error("Rerender request not found");
      }
      if (error.response?.status === 400) {
        const errorData = error.response.data as { error?: { message?: string }; message?: string };
        throw new Error(
          errorData?.error?.message ||
            errorData?.message ||
            "Invalid request. Please check the rerender request ID."
        );
      }

      // Throw a standardized error
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch rerender request: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch rerender request by ID:",
        error
      );
      throw new Error(
        "An unexpected error occurred while fetching rerender request. Please try again."
      );
    }
  }
}

