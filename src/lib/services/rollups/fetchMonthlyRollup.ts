/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MonthlyRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/monthly/:year/:month
 * Global monthly rollup (all accounts)
 */
export async function fetchMonthlyRollup(
  year: number,
  month: number
): Promise<MonthlyRollupResponse> {
  if (!year || Number.isNaN(year) || year < 1970) {
    throw new Error("year is required and must be valid");
  }
  if (!month || Number.isNaN(month) || month < 1 || month > 12) {
    throw new Error("month is required and must be between 1 and 12");
  }

  try {
    const response = await axiosInstance.get<MonthlyRollupResponse>(
      `/rollups/monthly/${year}/${month}`
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch monthly rollup: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching monthly rollup."
    );
  }
}
