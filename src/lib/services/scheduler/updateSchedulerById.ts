"use server";

import axiosInstance from "@/lib/axios";
import { Scheduler, SchedulerAttributes } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

interface UpdateSchedulerResponse {
  data: Scheduler;
}

export async function updateSchedulerById(
  schedulerId: number,
  payload: Partial<SchedulerAttributes>
): Promise<UpdateSchedulerResponse> {
  try {
    const response = await axiosInstance.put<UpdateSchedulerResponse>(
      `/schedulers/${schedulerId}`,
      { data: payload }
    );

    return response.data;
  } catch (error) {
    handleApiError(error, `updateSchedulerById(${schedulerId})`);
  }
}
