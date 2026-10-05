"use server";

import axiosInstance from "@/lib/axios";
import type { SchedulerDueRender } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

export type RendersForDateQuery =
  | { date: string }
  | { from: string; to: string };

export async function fetchGetRendersForDate(
  query: RendersForDateQuery,
): Promise<SchedulerDueRender[]> {
  const params = "date" in query ? { date: query.date } : query;

  try {
    const response = await axiosInstance.get<SchedulerDueRender[]>(
      "/scheduler/getRendersForDate",
      { params },
    );
    return response.data;
  } catch (error) {
    handleApiError(error, "fetchGetRendersForDate");
  }
}
