"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { SchedulerRenderRollupsResponse } from "@/types/rollups";

export interface FetchRenderRollupsBySchedulerParams {
  limit?: number; // default 50
  offset?: number; // default 0
  sortBy?: "completedAt" | string;
  sortOrder?: "asc" | "desc";
}

/**
 * GET /api/rollups/render/scheduler/:schedulerId
 * ?limit=50&offset=0&sortBy=completedAt&sortOrder=desc
 */
export async function fetchRenderRollupsByScheduler(
  schedulerId: number,
  params: FetchRenderRollupsBySchedulerParams = {}
): Promise<SchedulerRenderRollupsResponse> {
  if (!schedulerId || Number.isNaN(schedulerId)) {
    throw new Error("schedulerId is required and must be a valid number");
  }

  const {
    limit = 50,
    offset = 0,
    sortBy = "completedAt",
    sortOrder = "desc",
  } = params;

  try {
    const query = new URLSearchParams();
    if (limit != null) query.set("limit", String(limit));
    if (offset != null) query.set("offset", String(offset));
    if (sortBy) query.set("sortBy", sortBy);
    if (sortOrder) query.set("sortOrder", sortOrder);

    const response = await axiosInstance.get<SchedulerRenderRollupsResponse>(
      `/rollups/render/scheduler/${schedulerId}?${query.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch render rollups by scheduler: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching render rollups by scheduler."
    );
  }
}
