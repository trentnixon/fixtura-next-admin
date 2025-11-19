"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MonthlyRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/account/:accountId/month/:year/:month
 */
export async function fetchAccountMonthlyRollup(
  accountId: number,
  year: number,
  month: number
): Promise<MonthlyRollupResponse> {
  if (!accountId || Number.isNaN(accountId)) {
    throw new Error("accountId is required and must be a valid number");
  }
  if (!year || Number.isNaN(year) || year < 1970) {
    throw new Error("year is required and must be a valid year");
  }
  if (!month || Number.isNaN(month) || month < 1 || month > 12) {
    throw new Error("month is required and must be between 1 and 12");
  }

  try {
    const response = await axiosInstance.get<MonthlyRollupResponse>(
      `/rollups/account/${accountId}/month/${year}/${month}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch account monthly rollup: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching monthly rollup."
    );
  }
}
