/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";
import { Scheduler } from "@/types/scheduler";

interface ListSchedulersResponse {
  data: Scheduler[];
}

export async function fetchListSchedulers(searchTerm?: string): Promise<Scheduler[]> {
  try {
    const query = qs.stringify(
      {
        filters: searchTerm ? {
          $or: [
            { Name: { $contains: searchTerm } },
            { id: isNaN(Number(searchTerm)) ? undefined : Number(searchTerm) }
          ].filter(Boolean)
        } : {},
        pagination: {
          limit: 10
        },
        populate: ["account"]
      },
      { encodeValuesOnly: true }
    );

    const response = await axiosInstance.get<ListSchedulersResponse>(
      `/schedulers?${query}`
    );

    return response.data.data;
  } catch (error: any) {
    if (error instanceof AxiosError) {
      console.error("[Axios Error] Failed to list schedulers:", error.message);
      throw new Error("Failed to search schedulers");
    }
    throw error;
  }
}
