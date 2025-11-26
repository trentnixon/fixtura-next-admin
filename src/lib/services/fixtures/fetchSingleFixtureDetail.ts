"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";

/**
 * Fetches detailed information about a single fixture by ID from the Single Fixture Detail API
 * Returns comprehensive fixture data including related entities, validation scoring, and administrative metadata
 *
 * @param id - Required fixture ID (number)
 * @returns Promise<SingleFixtureDetailResponse> - Complete fixture detail data
 * @throws Error - If the API request fails or invalid ID is provided
 */
export async function fetchSingleFixtureDetail(
  id: number
): Promise<SingleFixtureDetailResponse> {
  try {
    // Validate ID is numeric
    if (!id || typeof id !== "number" || isNaN(id)) {
      throw new Error("Invalid fixture ID. Must be a number");
    }

    const endpoint = `/game-meta-data/admin/fixture/${id}`;

    const response = await axiosInstance.get(endpoint);

    // The API might wrap the response in a 'data' property, or return it directly
    // Check both possibilities (similar to how fetchFixtureDetails handles it)
    let fixtureData: SingleFixtureDetailResponse;

    if (response.data && typeof response.data === "object") {
      // Check if wrapped in 'data' property (like fetchFixtureDetails)
      if (
        "data" in response.data &&
        response.data.data &&
        typeof response.data.data === "object"
      ) {
        // Response is wrapped: { data: { fixture: ..., meta: ... } }
        fixtureData = response.data.data as SingleFixtureDetailResponse;
      } else if ("fixture" in response.data) {
        // Response is direct: { fixture: ..., meta: ... }
        fixtureData = response.data as SingleFixtureDetailResponse;
      } else {
        throw new Error(
          "Invalid response structure from single fixture detail API. Expected 'fixture' and 'meta' properties."
        );
      }
    } else {
      throw new Error(
        "Invalid response structure from single fixture detail API. Response data is not an object."
      );
    }

    // Validate the structure
    if (!fixtureData.fixture || !fixtureData.meta) {
      throw new Error(
        "Invalid response structure from single fixture detail API. Missing 'fixture' or 'meta' properties."
      );
    }

    return fixtureData;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Handle 400 Bad Request (invalid ID)
      if (error.response?.status === 400) {
        console.error("[Axios Error] Invalid fixture ID provided:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Invalid fixture ID. Must be a number"
        );
      }

      // Handle 404 Not Found
      if (error.response?.status === 404) {
        console.error("[Axios Error] Fixture not found:", {
          message: error.message,
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          data: error.response?.data,
          id,
        });

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            `Fixture with ID ${id} not found`
        );
      }

      // Handle 500 Internal Server Error
      if (error.response?.status === 500) {
        console.error(
          "[Axios Error] Server error while fetching fixture detail:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            status: error.response?.status,
            data: error.response?.data,
            id,
          }
        );

        throw new Error(
          error.response?.data?.error?.message ||
            error.response?.data?.message ||
            "Failed to fetch fixture details: Server error"
        );
      }

      // Handle timeout errors
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        console.error(
          "[Axios Error] Request timeout while fetching fixture detail:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            timeout: error.config?.timeout,
            id,
          }
        );

        throw new Error(
          "Request timeout: The fixture detail API took too long to respond. Please try again."
        );
      }

      // Handle network errors
      if (error.code === "ERR_NETWORK" || !error.response) {
        console.error(
          "[Axios Error] Network error while fetching fixture detail:",
          {
            message: error.message,
            url: error.config?.url,
            method: error.config?.method,
            code: error.code,
            id,
          }
        );

        throw new Error(
          "Network error: Unable to connect to the fixture detail API. Please check your connection and try again."
        );
      }

      // Handle other Axios errors
      console.error("[Axios Error] Failed to fetch fixture detail:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
        id,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch fixture details: ${
            error.response?.status || "Unknown error"
          }`
      );
    }

    // Handle non-Axios errors (including validation errors)
    console.error("[Unexpected Error] Failed to fetch fixture detail:", error);

    // If it's already an Error with a message, re-throw it
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "An unexpected error occurred while fetching fixture details. Please try again."
    );
  }
}
