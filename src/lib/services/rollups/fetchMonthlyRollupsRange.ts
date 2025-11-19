"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MonthlyRollupsResponse } from "@/types/rollups";

export interface MonthlyRangeParams {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  global?: boolean; // default false
  limit?: number; // default 12
}

/**
 * GET /api/rollups/monthly?startYear&startMonth&endYear&endMonth&global&limit
 */
export async function fetchMonthlyRollupsRange(
  params: MonthlyRangeParams
): Promise<MonthlyRollupsResponse> {
  const {
    startYear,
    startMonth,
    endYear,
    endMonth,
    global = false,
    limit = 12,
  } = params || {};

  if (!startYear || !startMonth || !endYear || !endMonth) {
    throw new Error("startYear, startMonth, endYear and endMonth are required");
  }
  if (startMonth < 1 || startMonth > 12 || endMonth < 1 || endMonth > 12) {
    throw new Error("startMonth/endMonth must be between 1 and 12");
  }

  try {
    const search = new URLSearchParams();
    search.set("startYear", String(startYear));
    search.set("startMonth", String(startMonth));
    search.set("endYear", String(endYear));
    search.set("endMonth", String(endMonth));
    if (global) search.set("global", "true");
    if (limit != null) search.set("limit", String(limit));

    const response = await axiosInstance.get<MonthlyRollupsResponse>(
      `/rollups/monthly?${search.toString()}`
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
            startPeriod: { year: startYear, month: startMonth },
            endPeriod: { year: endYear, month: endMonth },
            totalCost: 0,
          },
        };
      }
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch monthly rollups (range): ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching monthly rollups (range)."
    );
  }
}
