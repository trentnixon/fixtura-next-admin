"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AssociationDetailResponse } from "@/types/associationDetail";

/**
 * Fetches detailed association information from the Association Admin Detail API
 * Provides comprehensive detailed information about a single association by ID,
 * including all core association data, relational data (competitions, clubs, grades, accounts),
 * detailed statistics, and formatted responses for all related entities
 *
 * @param id - Required numeric association identifier
 * @returns Promise<AssociationDetailResponse> - Association detail data
 * @throws Error - If the API request fails, ID is invalid (non-numeric), or association is not found
 */
export async function fetchAssociationDetail(
  id: number
): Promise<AssociationDetailResponse> {
  try {
    // Validate ID is numeric
    if (typeof id !== "number" || Number.isNaN(id) || !Number.isFinite(id)) {
      throw new Error("Invalid association ID. Must be a number");
    }

    // Validate ID is positive integer
    if (id <= 0 || !Number.isInteger(id)) {
      throw new Error("Invalid association ID. Must be a positive integer");
    }

    const endpoint = `/association/admin/${id}`;

    console.log(
      `[fetchAssociationDetail] Fetching association detail for ID: ${id}`
    );
    console.log(`[fetchAssociationDetail] Endpoint: ${endpoint}`);

    const response = await axiosInstance.get<AssociationDetailResponse>(
      endpoint
    );

    // Log response metadata for debugging
    if (response.data?.data?.meta) {
      console.log(
        `[fetchAssociationDetail] Response metadata:`,
        JSON.stringify(
          {
            generatedAt: response.data.data.meta.generatedAt,
            dataPoints: response.data.data.meta.dataPoints,
            performance: response.data.data.meta.performance,
          },
          null,
          2
        )
      );
    }

    // Check if response has expected structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from association detail API");
    }

    // Log successful fetch
    console.log(
      `[fetchAssociationDetail] Successfully fetched association detail for ID: ${id}`
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request (invalid ID - non-numeric)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid association ID provided:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id: id,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Invalid association ID. Must be a number"
        );
      }

      // Handle 404 Not Found (association does not exist)
      if (error.response?.status === 404) {
        console.error(`[Axios Error] Association with ID ${id} not found:`, {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id: id,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            `Association with ID ${id} not found`
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching association detail:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            id: id,
          }
        );

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to fetch association detail: Server error"
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch association detail:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        id: id,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch association detail: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors (including validation errors)
    console.error(
      "[Unexpected Error] Failed to fetch association detail:",
      error
    );

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching association detail. Please try again."
    );
  }
}
