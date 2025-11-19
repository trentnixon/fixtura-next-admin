"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MonthlyRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/account/:accountId/current-month
 */
export async function fetchAccountCurrentMonthRollup(
  accountId: number
): Promise<MonthlyRollupResponse> {
  if (!accountId || Number.isNaN(accountId)) {
    throw new Error("accountId is required and must be a valid number");
  }

  try {
    const response = await axiosInstance.get<MonthlyRollupResponse>(
      `/rollups/account/${accountId}/current-month`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch account current month rollup: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching current month rollup."
    );
  }
}
