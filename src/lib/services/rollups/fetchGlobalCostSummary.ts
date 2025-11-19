"use server";

import axiosInstance from "@/lib/axios";
import { GlobalCostSummaryResponse } from "@/types/rollups";

export type GlobalSummaryPeriod =
  | "current-month"
  | "last-month"
  | "current-year"
  | "all-time";

/**
 * GET /api/rollups/global/summary?period=current-month
 */
export async function fetchGlobalCostSummary(
  period: GlobalSummaryPeriod = "current-month"
): Promise<GlobalCostSummaryResponse> {
  try {
    const search = new URLSearchParams();
    if (period) search.set("period", period);

    const response = await axiosInstance.get<GlobalCostSummaryResponse>(
      `/rollups/global/summary?${search.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    interface ErrorResponseData {
      error?: { message?: string };
      message?: string;
    }
    interface HttpErrorLike {
      response?: { status?: number; data?: ErrorResponseData };
      status?: number;
      message?: string;
    }
    const e = error as HttpErrorLike;
    const status = e?.response?.status ?? e?.status;

    // Graceful fallback on 404
    if (status === 404) {
      const empty: GlobalCostSummaryResponse = {
        data: {
          period: period,
          periodStart: "",
          periodEnd: "",
          totalCost: 0,
          totalLambdaCost: 0,
          totalAiCost: 0,
          totalRenders: 0,
          totalAccounts: 0,
          totalSchedulers: 0,
          averageCostPerRender: 0,
          averageCostPerAccount: 0,
          averageCostPerDay: 0,
          costTrend: "stable",
          percentageChange: 0,
          topAccounts: [],
        },
      };
      return empty;
    }

    const message =
      e?.response?.data?.error?.message ||
      e?.response?.data?.message ||
      e?.message ||
      "Request failed";
    throw new Error(`Failed to fetch global cost summary: ${message}`);
  }
}
