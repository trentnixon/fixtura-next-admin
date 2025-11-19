"use server";

import axiosInstance from "@/lib/axios";
import { GlobalCostTrendsResponse } from "@/types/rollups";

export type TrendGranularity = "daily" | "weekly" | "monthly";

/**
 * GET /api/rollups/global/trends?granularity&startDate&endDate
 */
export async function fetchGlobalCostTrends(params: {
  granularity?: TrendGranularity;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}): Promise<GlobalCostTrendsResponse> {
  const { granularity = "daily", startDate, endDate } = params || {};

  if (!startDate || !endDate) {
    throw new Error("startDate and endDate are required (YYYY-MM-DD)");
  }

  try {
    const search = new URLSearchParams();
    if (granularity) search.set("granularity", granularity);
    search.set("startDate", startDate);
    search.set("endDate", endDate);

    const response = await axiosInstance.get<GlobalCostTrendsResponse>(
      `/rollups/global/trends?${search.toString()}`
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
      const empty: GlobalCostTrendsResponse = {
        data: {
          granularity,
          period: { start: startDate, end: endDate },
          dataPoints: [],
          summary: {
            totalCost: 0,
            averageCost: 0,
            peakCost: 0,
            peakPeriod: "",
            trend: "stable",
          },
        },
      };
      return empty;
    }

    const message =
      e?.response?.data?.error?.message ||
      e?.response?.data?.message ||
      e?.message ||
      "Request failed";
    throw new Error(`Failed to fetch global cost trends: ${message}`);
  }
}
