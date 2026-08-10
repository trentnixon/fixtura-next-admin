"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  FetchNotificationHealthParams,
  NotificationHealthPresetDays,
  NotificationHealthResponse,
} from "@/types/notificationHealth";

const PRESET_DAYS: NotificationHealthPresetDays[] = [7, 14, 30, 60];

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return (
      (error.response?.data as { error?: { message?: string } })?.error
        ?.message ??
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      `Request failed: ${error.response?.status ?? "Unknown"}`
    );
  }
  if (error && typeof error === "object" && "message" in error) {
    const e = error as {
      message?: string;
      data?: { error?: { message?: string }; message?: string };
    };
    return (
      e.data?.error?.message ??
      (typeof e.data?.message === "string" ? e.data.message : undefined) ??
      e.message ??
      "Request failed"
    );
  }
  return error instanceof Error ? error.message : "Failed to fetch notification health";
}

/**
 * Fetches scraper notification health aggregates from the CMS.
 * GET /api/fixtura-scraper/notifications/health
 *
 * @param params - Preset days OR createdAt range (mutually exclusive on the server)
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-health-handoff.md
 */
export async function fetchNotificationHealth(
  params: FetchNotificationHealthParams
): Promise<NotificationHealthResponse> {
  if (params.mode === "preset") {
    if (!PRESET_DAYS.includes(params.days)) {
      throw new Error(`days must be one of: ${PRESET_DAYS.join(", ")}`);
    }
  }

  try {
    const queryParams: Record<string, string | number> = {};

    if (params.mode === "preset") {
      queryParams.days = params.days;
    } else {
      if (params.createdAt_gte) {
        queryParams.createdAt_gte = params.createdAt_gte;
      }
      if (params.createdAt_lte) {
        queryParams.createdAt_lte = params.createdAt_lte;
      }
    }

    const response = await axiosInstance.get<NotificationHealthResponse>(
      "fixtura-scraper/notifications/health",
      { params: queryParams }
    );

    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
