"use server";

import axiosInstance from "@/lib/axios";
import { YesterdaysRenders } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

export async function fetchGetYesterdaysRenders(): Promise<YesterdaysRenders[]> {
  try {
    const response = await axiosInstance.get<YesterdaysRenders[]>(
      `/scheduler/getYesterdaysRenders`
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetchGetYesterdaysRenders");
  }
}
