"use server";

import axiosInstance from "@/lib/axios";
import { handleApiError } from "@/lib/services/utils/error-handler";

export interface SchedulerDetailsResponse {
  data: {
    id: number;
    attributes: {
      isRendering: boolean;
      Queued: boolean;
      updatedAt: string;
      days_of_the_week: {
        data: {
          id: number;
          attributes: {
            Name: string;
          };
        } | null;
      };
    };
  };
}

export async function fetchSchedulerDetails(
  schedulerId: number
): Promise<SchedulerDetailsResponse> {
  try {
    const response = await axiosInstance.get<SchedulerDetailsResponse>(
      `/scheduler/${schedulerId}/details`
    );

    return response.data;
  } catch (error) {
    handleApiError(error, `fetchSchedulerDetails(${schedulerId})`);
  }
}
