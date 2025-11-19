/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { WeeklyRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/weekly/:year/:week
 */
export async function fetchWeeklyRollup(
  year: number,
  week: number
): Promise<WeeklyRollupResponse> {
  if (!year || Number.isNaN(year) || year < 1970) {
    throw new Error("year is required and must be valid");
  }
  if (!week || Number.isNaN(week) || week < 1 || week > 53) {
    throw new Error("week is required and must be between 1 and 53");
  }

  try {
    const response = await axiosInstance.get<WeeklyRollupResponse>(
      `/rollups/weekly/${year}/${week}`
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch weekly rollup: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching weekly rollup."
    );
  }
}
