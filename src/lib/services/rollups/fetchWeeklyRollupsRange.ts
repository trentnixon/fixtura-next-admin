"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { WeeklyRollupsResponse } from "@/types/rollups";

export interface WeeklyRangeParams {
  startYear: number;
  startWeek: number;
  endYear: number;
  endWeek: number;
  limit?: number; // default 52
}

/**
 * GET /api/rollups/weekly?startYear&startWeek&endYear&endWeek&limit
 */
export async function fetchWeeklyRollupsRange(
  params: WeeklyRangeParams
): Promise<WeeklyRollupsResponse> {
  const { startYear, startWeek, endYear, endWeek, limit = 52 } = params || {};

  if (!startYear || !startWeek || !endYear || !endWeek) {
    throw new Error("startYear, startWeek, endYear and endWeek are required");
  }
  if (startWeek < 1 || startWeek > 53 || endWeek < 1 || endWeek > 53) {
    throw new Error("startWeek/endWeek must be between 1 and 53");
  }

  try {
    const search = new URLSearchParams();
    search.set("startYear", String(startYear));
    search.set("startWeek", String(startWeek));
    search.set("endYear", String(endYear));
    search.set("endWeek", String(endWeek));
    if (limit != null) search.set("limit", String(limit));

    const response = await axiosInstance.get<WeeklyRollupsResponse>(
      `/rollups/weekly?${search.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    // Check if it's an Axios error with response (404, 500, etc.)
    if (error instanceof AxiosError && error.response) {
      // Gracefully handle 404 - endpoint may not be available yet
      if (error.response.status === 404) {
        return {
          data: [],
          meta: {
            total: 0,
            startPeriod: { year: startYear, week: startWeek },
            endPeriod: { year: endYear, week: endWeek },
            totalCost: 0,
          },
        };
      }
      throw new Error(
        error.response.data?.error?.message ||
          error.response.data?.message ||
          `Failed to fetch weekly rollups (range): ${
            error.response.status || "Unknown error"
          }`
      );
    }

    // Handle network errors or other Axios errors without response
    if (error instanceof AxiosError) {
      // Network error or request was made but no response received
      // Return empty data gracefully
      return {
        data: [],
        meta: {
          total: 0,
          startPeriod: { year: startYear, week: startWeek },
          endPeriod: { year: endYear, week: endWeek },
          totalCost: 0,
        },
      };
    }

    // For any other unexpected errors, return empty data instead of throwing
    // This prevents the UI from crashing
    console.error("Unexpected error fetching weekly rollups:", error);
    return {
      data: [],
      meta: {
        total: 0,
        startPeriod: { year: startYear, week: startWeek },
        endPeriod: { year: endYear, week: endWeek },
        totalCost: 0,
      },
    };
  }
}
