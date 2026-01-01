/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { YesterdaysRenders } from "@/types/scheduler";

export async function fetchGetYesterdaysRenders(): Promise<YesterdaysRenders[]> {
  try {
    const response = await axiosInstance.get<YesterdaysRenders[]>(
      `/scheduler/getYesterdaysRenders`
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to fetch yesterday's renders:", {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });

      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch yesterday's renders: ${
            error.response?.status || "Unknown error"
          }`
      );
    } else {
      console.error("[Unexpected Error] Failed to fetch yesterday's renders:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
