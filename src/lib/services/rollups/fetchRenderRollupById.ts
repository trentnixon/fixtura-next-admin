"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderRollupResponse } from "@/types/rollups";

/**
 * GET /api/rollups/render/:renderId
 */
export async function fetchRenderRollupById(
  renderId: number
): Promise<RenderRollupResponse> {
  if (!renderId || Number.isNaN(renderId)) {
    throw new Error("renderId is required and must be a valid number");
  }

  try {
    const response = await axiosInstance.get<RenderRollupResponse>(
      `/rollups/render/${renderId}`
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error?.message ||
          error.response?.data?.message ||
          `Failed to fetch render rollup by id: ${
            error.response?.status || "Unknown error"
          }`
      );
    }
    throw new Error(
      "An unexpected error occurred while fetching render rollup by id."
    );
  }
}
