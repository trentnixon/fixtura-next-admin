/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { HealthHistory } from "@/types/scheduler";

export async function fetchGetHealthHistory(days: number = 14): Promise<HealthHistory[]> {
  try {
    const response = await axiosInstance.get<HealthHistory[]>(
      `/scheduler/getHealthHistory?days=${days}`
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch health history:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.error?.message ||
          `Failed to fetch health history: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch health history:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
