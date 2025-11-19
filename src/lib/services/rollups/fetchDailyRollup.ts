/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { DailyRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/daily/:date
 * @param date YYYY-MM-DD
 */
export async function fetchDailyRollup(
  date: string
): Promise<DailyRollupResponse> {
  if (!date || typeof date !== "string") {
    throw new Error("date is required (YYYY-MM-DD)");
  }
  try {
    const response = await axiosInstance.get<DailyRollupResponse>(
      `/rollups/daily/${date}`
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch daily rollup: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching daily rollup."
    );
  }
}
