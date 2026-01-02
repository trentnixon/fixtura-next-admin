/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderAuditResponse } from "@/types/render";

/**
 * Fetches the render audit list for the Global Render Monitor.
 * Uses the specialized custom endpoint /renders/audit.
 */
export async function fetchRenderAudit(page: number = 1): Promise<RenderAuditResponse> {
  try {
    const response = await axiosInstance.get<RenderAuditResponse>(
      `/renders/audit?page=${page}`
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch render audit:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render audit: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch render audit:", error);
      throw new Error("An unexpected error occurred while fetching the render audit.");
    }
  }
}
