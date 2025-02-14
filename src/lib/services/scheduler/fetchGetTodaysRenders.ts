/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { TodaysRenders } from "@/types/scheduler";

export async function fetchGetTodaysRenders(): Promise<TodaysRenders[]> {
  try {
    // Send GET request with query string
    const response = await axiosInstance.get<TodaysRenders[]>(
      `/scheduler/getTodaysRenders`
    );
    console.log("[response]", response.data);
    return response.data; // Now matches the response type
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
