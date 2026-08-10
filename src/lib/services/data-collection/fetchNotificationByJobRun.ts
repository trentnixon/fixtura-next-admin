"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type { NotificationByRunResponse } from "@/types/notificationByRun";

function getHttpStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "status" in error) {
    const s = (error as { status: unknown }).status;
    return typeof s === "number" ? s : null;
  }
  if (error instanceof AxiosError && error.response) {
    return error.response.status;
  }
  return null;
}

function mapRejectedRequestToError(error: unknown): Error {
  if (error && typeof error === "object" && "data" in error) {
    const o = error as {
      status: number | null;
      data: unknown;
      message: string;
    };
    const data = o.data as
      | { error?: { message?: string }; message?: string }
      | null
      | undefined;
    const errorMessage =
      data?.error?.message ??
      data?.message ??
      o.message ??
      `Request failed: ${o.status ?? "Unknown"}`;
    return new Error(String(errorMessage));
  }
  if (error instanceof AxiosError) {
    const errorMessage =
      (error.response?.data as { error?: { message?: string } })?.error
        ?.message ??
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      `Request failed: ${error.response?.status ?? "Unknown"}`;
    return new Error(errorMessage);
  }
  return error instanceof Error ? error : new Error("Request failed");
}

/**
 * Fetches the CMS failure notification for a single scraper job run.
 * GET /api/fixtura-scraper/notifications/by-run/:jobId/:runId
 *
 * @returns `null` when no notification row exists (404) — normal for clean runs.
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-by-run-handoff.md
 */
export async function fetchNotificationByJobRun(
  jobId: string,
  runId: string
): Promise<NotificationByRunResponse | null> {
  const j = jobId.trim();
  const r = runId.trim();
  if (!j || !r) {
    throw new Error("jobId and runId are required");
  }

  const path = `fixtura-scraper/notifications/by-run/${encodeURIComponent(j)}/${encodeURIComponent(r)}`;

  try {
    const res = await axiosInstance.get<NotificationByRunResponse>(path);
    return res.data;
  } catch (error) {
    const status = getHttpStatus(error);
    if (status === 404) {
      return null;
    }
    throw mapRejectedRequestToError(error);
  }
}
