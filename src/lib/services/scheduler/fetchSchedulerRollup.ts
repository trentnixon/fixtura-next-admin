"use server";

import axiosInstance from "@/lib/axios";
import { SchedulerRollup } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

interface FetchSchedulerResponse {
  rollup: SchedulerRollup;
}

export async function fetchSchedulerRollup(): Promise<SchedulerRollup> {
  try {
    const response = await axiosInstance.get<FetchSchedulerResponse>(
      `/scheduler/schedulerStats`
    );
    return response.data.rollup;
  } catch (error) {
    handleApiError(error, "fetchSchedulerRollup");
  }
}
