/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";
import { Scheduler } from "@/types/scheduler";

// Define the return type of the API response
interface FetchSchedulerResponse {
  data: Scheduler;
}

export async function fetchSchedulerById(
  schedulerId: string
): Promise<FetchSchedulerResponse> {
  try {
    // Build query parameters using qs
    const query = qs.stringify(
      {
        populate: [
          "renders", // Example relation: template
          "days_of_the_week", // Example relation: tasks
        ], // Add relations as needed
      },
      { encodeValuesOnly: true } // Serialize parameters for Strapi
    );

    // Send GET request with query string
    const response = await axiosInstance.get<FetchSchedulerResponse>(
      `/schedulers/${schedulerId}?${query}`
    );

    return response.data; // Ensure this matches the API response format
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch scheduler by ID:", {
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
          `Failed to fetch scheduler: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch scheduler by ID:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
