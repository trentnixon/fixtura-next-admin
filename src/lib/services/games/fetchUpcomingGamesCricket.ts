"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { RenderResponse } from "@/types/render";
import { Fixture } from "@/types/fixture";

export async function fetchUpcomingGamesCricket(
  renderId: string
): Promise<Fixture[]> {
  if (!renderId) {
    throw new Error("renderId is required.");
  }

  try {
    const response = await axiosInstance.get<{ data: RenderResponse }>(
      `/render/adminGetUpcomingFixturesFromRender/${renderId}`
    );

    return response.data.data.fixtures || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("[fetchUpcomingGamesCricket] Axios Error:", {
        message: error.message,
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });

      throw new Error(
        `Failed to fetch upcoming games: ${
          error.response?.status || "Unknown error"
        } - ${error.response?.statusText || error.message}`
      );
    } else {
      console.error("[fetchUpcomingGamesCricket] Unexpected Error:", error);
      throw new Error("Failed to fetch upcoming games cricket.");
    }
  }
}
