"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RerenderRequestDetailResponse, RerenderRequestStatus } from "@/types/rerender-request";

/**
 * Updates the status of a rerender request
 *
 * @param id - Rerender request ID
 * @param status - New status value
 * @returns Promise<RerenderRequestDetailResponse> - Updated rerender request data
 * @throws Error - If the API request fails
 */
export async function updateRerenderRequestStatus(
  id: number,
  status: RerenderRequestStatus
): Promise<RerenderRequestDetailResponse> {
  if (!id) {
    throw new Error("Rerender request ID is required");
  }

  if (!status) {
    throw new Error("Status is required");
  }

  try {
    console.log(
      `[updateRerenderRequestStatus] Updating rerender request ${id} status to ${status}`
    );

    const response = await axiosInstance.post<RerenderRequestDetailResponse>(
      `/rerender-request/admin/${id}/update-status`,
      { status }
    );

    // Log the full response for debugging
    console.log(
      `[updateRerenderRequestStatus] Full response:`,
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from update status API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to update rerender request status:", {
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
      if (error.response?.status === 405) {
        throw new Error("Method not allowed. The endpoint may require a different HTTP method.");
      }
      if (error.response?.status === 400) {
        const errorData = error.response.data as { error?: { message?: string }; message?: string };
        throw new Error(
          errorData?.error?.message ||
            errorData?.message ||
            "Invalid request. Please check the rerender request ID and status value."
        );
      }

      // Throw a standardized error
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to update rerender request status: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to update rerender request status:",
        error
      );
      throw new Error(
        "An unexpected error occurred while updating rerender request status. Please try again."
      );
    }
  }
}

