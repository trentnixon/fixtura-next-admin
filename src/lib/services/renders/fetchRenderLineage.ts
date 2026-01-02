/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderLineageResponse } from "@/types/render";

/**
 * Fetches the deep lineage (DNA) of a specific render.
 * Reserved for technical troubleshooting and dispute resolution.
 *
 * @param id - The ID of the render to audit
 * @param checkIntegrity - Whether to perform a server-side data integrity check
 */
export async function fetchRenderLineage(
  id: number | string,
  checkIntegrity: boolean = false
): Promise<RenderLineageResponse> {
  try {
    const response = await axiosInstance.get<RenderLineageResponse>(
      `/renders/lineage/${id}`,
      {
        params: { checkIntegrity: checkIntegrity ? "true" : undefined },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error(`[Axios Error] Failed to fetch render lineage for ID ${id}:`, {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch render lineage: ${error.response?.status || "Unknown error"}`
      );
    } else {
      console.error(`[Unexpected Error] Failed to fetch render lineage for ID ${id}:`, error);
      throw new Error("An unexpected error occurred while fetching render lineage.");
    }
  }
}
