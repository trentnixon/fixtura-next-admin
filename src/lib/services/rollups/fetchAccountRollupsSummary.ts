"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { AccountRollupsSummaryResponse } from "@/types/rollups";

/**
 * GET /api/rollups/account/:accountId/summary
 */
export async function fetchAccountRollupsSummary(
  accountId: number
): Promise<AccountRollupsSummaryResponse> {
  if (!accountId || Number.isNaN(accountId)) {
    throw new Error("accountId is required and must be a valid number");
  }

  try {
    const response = await axiosInstance.get<AccountRollupsSummaryResponse>(
      `/rollups/account/${accountId}/summary`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch account rollups summary: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching account rollups summary."
    );
  }
}
