"use server";

import axiosInstance from "@/lib/axios";
import qs from "qs";
import { Scheduler } from "@/types/scheduler";
import { handleApiError } from "@/lib/services/utils/error-handler";

interface ListSchedulersResponse {
  data: Scheduler[];
}

export async function fetchListSchedulers(
  searchTerm?: string
): Promise<Scheduler[]> {
  try {
    const query = qs.stringify(
      {
        filters: searchTerm
          ? {
              $or: [
                { Name: { $contains: searchTerm } },
                {
                  id: isNaN(Number(searchTerm))
                    ? undefined
                    : Number(searchTerm),
                },
              ].filter(Boolean),
            }
          : {},
        pagination: {
          limit: 10,
        },
        populate: ["account"],
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<ListSchedulersResponse>(
      `/schedulers?${query}`
    );

    return response.data.data;
  } catch (error) {
    handleApiError(error, "fetchListSchedulers");
  }
}
