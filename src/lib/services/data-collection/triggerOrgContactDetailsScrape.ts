"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerOrgContactDetailsScrapeRequest,
  TriggerOrgContactDetailsScrapeSuccessResponse,
} from "@/types/triggerOrgContactDetailsScrape";

export async function triggerOrgContactDetailsScrape(
  payload: TriggerOrgContactDetailsScrapeRequest,
): Promise<TriggerOrgContactDetailsScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerOrgContactDetailsScrapeSuccessResponse>(
        "/organisation/trigger-org-contact-details-scrape",
        payload,
      );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        (error.response?.data as { error?: { message?: string } })?.error
          ?.message ??
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        `Request failed: ${error.response?.status ?? "Unknown"}`;

      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to trigger org contact details scrape",
    );
  }
}
