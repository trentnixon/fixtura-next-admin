"use server";

import axiosInstance from "@/lib/axios";
import { RenderResponse } from "@/types/render";
import { Fixture } from "@/types/fixture";

export async function fetchGamesCricket(renderId: string): Promise<Fixture[]> {
  console.log("[fetchGamesCricket] Input renderId:", renderId);

  if (!renderId) {
    throw new Error("renderId is required.");
  }

  try {
    console.log(
      "[fetchGamesCricket] Full URL:",
      `/render/adminGetResultFixturesFromRender/${renderId}`
    );

    const response = await axiosInstance.get<{ data: RenderResponse }>(
      `/render/adminGetResultFixturesFromRender/${renderId}`
    );

    console.log("[fetchGamesCricket] Response:", response.data);
    console.log(
      "[fetchGamesCricket] Fixtures length:",
      response.data.data.fixtures?.length
    );

    return response.data.data.fixtures || [];
  } catch (error) {
    console.error("[Error] fetchGamesCricket failed:", error);
    throw new Error("Failed to fetch games cricket.");
  }
}
