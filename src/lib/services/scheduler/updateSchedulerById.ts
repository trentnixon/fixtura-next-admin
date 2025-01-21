/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Scheduler, SchedulerAttributes } from "@/types/scheduler";

// Define the response type
interface UpdateSchedulerResponse {
  data: Scheduler;
}

// Update Scheduler by ID
export async function updateSchedulerById(
  schedulerId: number,
  payload: Partial<SchedulerAttributes>
): Promise<UpdateSchedulerResponse> {
  try {
    console.log({
      schedulerId,
      payload,
    });

    const response = await axiosInstance.put<UpdateSchedulerResponse>(
      `/schedulers/${schedulerId}`, // Ensure the endpoint is correct
      { data: payload }
    );

    return response.data; // Return the API response
  } catch (error: any) {
    if (error instanceof AxiosError) {
      // Axios-specific error handling
      console.error("[Axios Error] Failed to update scheduler:", {
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
          `Failed to update scheduler: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      // Handle non-Axios errors
      console.error("[Unexpected Error] Failed to update scheduler:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
