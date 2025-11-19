"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderRollupsResponse } from "@/types/rollups";

/**
 * GET /api/rollups/render/batch?renderIds=1,2,3
 */
export async function fetchRenderRollupsBatch(
  renderIds: number[]
): Promise<RenderRollupsResponse> {
  if (!Array.isArray(renderIds) || renderIds.length === 0) {
    throw new Error("renderIds must be a non-empty array of numbers");
  }

  const ids = renderIds.filter((id) => Number.isFinite(id));
  if (ids.length === 0) {
    throw new Error("renderIds must contain at least one valid number");
  }

  try {
    const query = new URLSearchParams({
      renderIds: ids.join(","),
    });

    const response = await axiosInstance.get<RenderRollupsResponse>(
      `/rollups/render/batch?${query.toString()}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch render rollups batch: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching render rollups batch."
    );
  }
}
