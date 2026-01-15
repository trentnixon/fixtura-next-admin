/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

// Response type matching the lightweight endpoint
export interface SchedulerDetailsResponse {
  data: {
    id: number;
    attributes: {
      isRendering: boolean;
      Queued: boolean;
      updatedAt: string;
      days_of_the_week: {
        data: {
          id: number;
          attributes: {
            Name: string;
          };
        } | null;
      };
    };
  };
}

export async function fetchSchedulerDetails(
  schedulerId: number
): Promise<SchedulerDetailsResponse> {
  try {
    // Use the new lightweight endpoint
    const response = await axiosInstance.get<SchedulerDetailsResponse>(
      `/scheduler/${schedulerId}/details`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to fetch scheduler details:", {
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
          `Failed to fetch scheduler details: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error(
        "[Unexpected Error] Failed to fetch scheduler details:",
        error
      );
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
