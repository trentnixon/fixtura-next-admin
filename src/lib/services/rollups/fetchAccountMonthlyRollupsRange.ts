"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { MonthlyRollupsResponse } from "@/types/rollups";

export interface AccountMonthlyRangeParams {
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  limit?: number; // default 12
}

/**
 * GET /api/rollups/account/:accountId/months?startYear&startMonth&endYear&endMonth&limit
 */
export async function fetchAccountMonthlyRollupsRange(
  accountId: number,
  params: AccountMonthlyRangeParams
): Promise<MonthlyRollupsResponse> {
  const { startYear, startMonth, endYear, endMonth, limit = 12 } = params || {};

  if (!accountId || Number.isNaN(accountId)) {
    throw new Error("accountId is required and must be a valid number");
  }
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
    if (limit != null) search.set("limit", String(limit));

    const response = await axiosInstance.get<MonthlyRollupsResponse>(
      `/rollups/account/${accountId}/months?${search.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch account monthly rollups range: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching monthly rollups range."
    );
  }
}
