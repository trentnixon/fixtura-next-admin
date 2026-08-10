"use server";

import axiosInstance from "@/lib/axios";
import { TodaysRenders } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

export async function fetchGetTomorrowsRenders(): Promise<TodaysRenders[]> {
  try {
    const response = await axiosInstance.get<TodaysRenders[]>(
      `/scheduler/getTomorrowsRenders`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetchGetTomorrowsRenders");
  }
}
