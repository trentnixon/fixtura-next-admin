"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MarkHandledResponse } from "@/types/rerender-request";

/**
 * Marks a rerender request as handled
 * Updates the hasBeenHandled boolean field to true
 *
 * @param id - Rerender request ID
 * @returns Promise<MarkHandledResponse> - Updated rerender request data
 * @throws Error - If the API request fails
 */
export async function markRerenderRequestHandled(
  id: number
): Promise<MarkHandledResponse> {
  if (!id) {
    throw new Error("Rerender request ID is required");
  }

  try {
    console.log(
      `[markRerenderRequestHandled] Marking rerender request ${id} as handled`
    );

    const response = await axiosInstance.put<MarkHandledResponse>(
      `/rerender-request/admin/${id}/mark-handled`
    );

    // Log the full response for debugging
    console.log(
      `[markRerenderRequestHandled] Full response:`,
      JSON.stringify(response.data, null, 2)
    );

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from mark handled API");
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to mark rerender request as handled:", {
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
          `Failed to mark rerender request as handled: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to mark rerender request as handled:",
        error
      );
      throw new Error(
        "An unexpected error occurred while marking rerender request as handled. Please try again."
      );
    }
  }
}

