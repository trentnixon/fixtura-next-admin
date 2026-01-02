/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderDistributionResponse } from "@/types/render";

/**
 * Fetches the render distribution (leaderboards & asset mix) for the Global Render Monitor.
 * Uses the specialized custom endpoint /renders/distribution.
 */
export async function fetchRenderDistribution(): Promise<RenderDistributionResponse> {
  try {
    const response = await axiosInstance.get<RenderDistributionResponse>(
      "/renders/distribution"
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch render distribution:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render distribution: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch render distribution:", error);
      throw new Error("An unexpected error occurred while fetching system distribution.");
    }
  }
}
