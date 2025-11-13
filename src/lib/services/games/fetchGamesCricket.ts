"use server";

import axiosInstance from "@/lib/axios";
import { RenderResponse } from "@/types/render";
import { Fixture } from "@/types/fixture";

export async function fetchGamesCricket(renderId: string): Promise<Fixture[]> {
  if (!renderId) {
    throw new Error("renderId is required.");
  }

  try {
    const response = await axiosInstance.get<{ data: RenderResponse }>(
      `/render/adminGetResultFixturesFromRender/${renderId}`
    );

    return response.data.data.fixtures || [];
  } catch (error) {
    console.error("[Error] fetchGamesCricket failed:", error);
    throw new Error("Failed to fetch games cricket.");
  }
}
