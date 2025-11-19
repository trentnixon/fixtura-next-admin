"use server";

import axiosInstance from "@/lib/axios";
import { TopAccountsResponse } from "@/types/rollups";

export type TopAccountsPeriod =
  | "current-month"
  | "last-month"
  | "current-year"
  | "all-time";

export type TopAccountsSortBy = "totalCost" | "renderCount";
export type SortOrder = "asc" | "desc";

/**
 * GET /api/rollups/global/top-accounts?period&limit&sortBy&sortOrder
 */
export async function fetchTopAccountsByCost(
  params: {
    period?: TopAccountsPeriod;
    limit?: number;
    sortBy?: TopAccountsSortBy;
    sortOrder?: SortOrder;
  } = {}
): Promise<TopAccountsResponse> {
  const {
    period = "current-month",
    limit = 10,
    sortBy = "totalCost",
    sortOrder = "desc",
  } = params;

  try {
    const search = new URLSearchParams();
    if (period) search.set("period", period);
    if (limit != null) search.set("limit", String(limit));
    if (sortBy) search.set("sortBy", sortBy);
    if (sortOrder) search.set("sortOrder", sortOrder);

    const response = await axiosInstance.get<TopAccountsResponse>(
      `/rollups/global/top-accounts?${search.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    // Our axios interceptor may reject with a plain object, not an AxiosError.
    interface ErrorResponseData {
      error?: { message?: string };
      message?: string;
    }
    interface HttpErrorLike {
      response?: { status?: number; data?: ErrorResponseData };
      status?: number;
      message?: string;
      isAxiosError?: boolean;
    }
    const e = error as HttpErrorLike;
    const status = e?.response?.status ?? e?.status;

    // Graceful fallback on 404 - endpoint not available yet
    if (status === 404) {
      return {
        data: [],
        meta: {
          period: period,
          totalAccounts: 0,
          limit: limit,
        },
      };
    }

    // For other known HTTP errors, surface a meaningful message
    if (status) {
      const message =
        e?.response?.data?.error?.message ||
        e?.response?.data?.message ||
        e?.message ||
        "Request failed";
      throw new Error(`Failed to fetch top accounts: ${message}`);
    }

    // Unknown error shape
    throw new Error(
      "An unexpected error occurred while fetching top accounts."
    );
  }
}
