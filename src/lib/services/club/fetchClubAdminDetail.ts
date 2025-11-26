"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { ClubAdminDetailResponse } from "@/types/clubAdminDetail";

/**
 * Fetches detailed club information from the Club Admin Detail API.
 *
 * Provides a bundled, read-only snapshot of a single club by ID including:
 * - Core club data
 * - Statistics
 * - Associations, teams, competitions
 * - Linked accounts
 * - Insights and meta information
 *
 * @param id - Required numeric club identifier
 * @returns Promise<ClubAdminDetailResponse>
 * @throws Error when ID is invalid or API request fails
 */
export async function fetchClubAdminDetail(
  id: number
): Promise<ClubAdminDetailResponse> {
  try {
    // Validate ID is numeric, finite, positive integer
    if (typeof id !== "number" || Number.isNaN(id) || !Number.isFinite(id)) {
      throw new Error("Invalid club ID. Must be a number");
    }

    if (id <= 0 || !Number.isInteger(id)) {
      throw new Error("Invalid club ID. Must be a positive integer");
    }

    const endpoint = `/club/admin/${id}`;

    console.log(`[fetchClubAdminDetail] Fetching club detail for ID: ${id}`);
    console.log(`[fetchClubAdminDetail] Endpoint: ${endpoint}`);

    const response = await axiosInstance.get<ClubAdminDetailResponse>(endpoint);

    // Basic structure validation
    if (!response.data) {
      throw new Error("Invalid response structure from club admin detail API");
    }

    console.log(
      `[fetchClubAdminDetail] Successfully fetched club detail for ID: ${id}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // 400 - Bad Request (invalid ID)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid club ID provided:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id,
        });

        const payload = error.response?.data as
          | { error?: { message?: string }; message?: string }
          | undefined;

        throw new Error(
          payload?.error?.message ||
            payload?.message ||
            "Invalid club ID. Must be a number"
        );
      }

      // 404 - Not Found
      if (error.response?.status === 404) {
        console.error(`[Axios Error] Club with ID ${id} not found:`, {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id,
        });

        const payload = error.response?.data as
          | { error?: { message?: string }; message?: string }
          | undefined;

        throw new Error(
          payload?.error?.message ||
            payload?.message ||
            `Club with ID ${id} not found`
        );
      }

      // 500 - Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching club detail:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            id,
          }
        );

        const payload = error.response?.data as
          | { error?: { message?: string }; message?: string }
          | undefined;

        throw new Error(
          payload?.error?.message ||
            payload?.message ||
            "Failed to fetch club detail: Server error"
        );
      }

      // Generic Axios error
      console.error("[Axios Error] Failed to fetch club detail:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        id,
      });

      const payload = error.response?.data as
        | { error?: { message?: string }; message?: string }
        | undefined;

      throw new Error(
        payload?.error?.message ||
          payload?.message ||
          `Failed to fetch club detail: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    console.error(
      "[Unexpected Error] Failed to fetch club detail from admin endpoint:",
      error
    );

    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching club detail. Please try again."
    );
  }
}
