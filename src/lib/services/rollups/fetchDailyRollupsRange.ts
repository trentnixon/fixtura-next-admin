"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { DailyRollupsResponse } from "@/types/rollups";

export interface DailyRangeParams {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  limit?: number; // default 31
}

/**
 * GET /api/rollups/daily?startDate&endDate&limit
 */
export async function fetchDailyRollupsRange(
  params: DailyRangeParams
): Promise<DailyRollupsResponse> {
  const { startDate, endDate, limit = 31 } = params || {};

  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required (YYYY-MM-DD)");
  }

  try {
    const search = new URLSearchParams();
    search.set("startDate", startDate);
    search.set("endDate", endDate);
    if (limit != null) search.set("limit", String(limit));

    const response = await axiosInstance.get<DailyRollupsResponse>(
      `/rollups/daily?${search.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      // Gracefully handle 404 - endpoint may not be available yet
      if (error.response?.status === 404) {
        return {
          data: [],
          meta: {
            total: 0,
            startDate,
            endDate,
            totalCost: 0,
          },
        };
      }
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch daily rollups (range): ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching daily rollups (range)."
    );
  }
}
