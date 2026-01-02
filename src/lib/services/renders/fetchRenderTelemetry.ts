/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderTelemetryResponse } from "@/types/render";

/**
 * Fetches the render telemetry (headline stats) for the Global Render Monitor.
 * Uses the specialized custom endpoint /renders/telemetry.
 */
export async function fetchRenderTelemetry(): Promise<RenderTelemetryResponse> {
  try {
    const response = await axiosInstance.get<RenderTelemetryResponse>(
      "/renders/telemetry"
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch render telemetry:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render telemetry: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch render telemetry:", error);
      throw new Error("An unexpected error occurred while fetching system telemetry.");
    }
  }
}
