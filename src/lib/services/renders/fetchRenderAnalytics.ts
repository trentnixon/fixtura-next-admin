/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderAnalyticsResponse, AnalyticsPeriod } from "@/types/render";

/**
 * Fetches the render analytics (chart data) for the Global Render Monitor.
 * Uses the specialized custom endpoint /renders/analytics.
 */
export async function fetchRenderAnalytics(period: AnalyticsPeriod = "day"): Promise<RenderAnalyticsResponse> {
  try {
    const response = await axiosInstance.get<RenderAnalyticsResponse>(
      `/renders/analytics?period=${period}`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch render analytics:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render analytics: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch render analytics:", error);
      throw new Error("An unexpected error occurred while fetching system analytics.");
    }
  }
}
