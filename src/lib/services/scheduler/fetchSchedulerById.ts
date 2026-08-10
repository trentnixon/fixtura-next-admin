"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { Scheduler } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

interface FetchSchedulerResponse {
  data: Scheduler;
}

export async function fetchSchedulerById(
  schedulerId: number
): Promise<FetchSchedulerResponse> {
  try {
    const query = qs.stringify(
      {
        populate: {
          renders: {
            populate: ["downloads", "ai_articles"],
          },
          days_of_the_week: true,
          account: {
            populate: ["account_type"],
          },
        },
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<FetchSchedulerResponse>(
      `/schedulers/${schedulerId}?${query}`
    );

    return response.data;
  } catch (error) {
    handleApiError(error, `fetchSchedulerById(${schedulerId})`);
  }
}
