/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Render } from "@/types/render";

// Define the return type of the API response
interface FetchRenderResponse {
  data: Render;
}

export async function fetchRecentRenders(): Promise<Render> {
  try {
    // Build query parameters using qs

    // Send GET request with query string
    const response = await axiosInstance.get<FetchRenderResponse>(
      `/render/previous24hours`
    );

    return response.data.data; // Return the actual `Render` object
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch render by ID:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });

      // Throw a standardized error
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render: ${error.response?.status || "Unknown error"}`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to fetch render by ID:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
