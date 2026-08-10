"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type { NotificationHealthPresetDays } from "@/types/notificationHealth";
import type {
  FetchNotificationIssuesParams,
  NotificationIssuesResponse,
} from "@/types/notificationIssues";

const PRESET_DAYS: NotificationHealthPresetDays[] = [7, 14, 30, 60];
const MAX_PAGE_SIZE = 200;

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
  return error instanceof Error
    ? error.message
    : "Failed to fetch notification issues";
}

/**
 * Fetches flattened scraper notification issues from the CMS.
 * GET /api/fixtura-scraper/notifications/issues
 *
 * @param params - Preset days OR createdAt range, plus optional filters and pagination
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-issues-handoff.md
 */
export async function fetchNotificationIssues(
  params: FetchNotificationIssuesParams
): Promise<NotificationIssuesResponse> {
  if (params.mode === "preset") {
    if (!PRESET_DAYS.includes(params.days)) {
      throw new Error(`days must be one of: ${PRESET_DAYS.join(", ")}`);
    }
  }

  if (params.pageSize != null) {
    if (params.pageSize < 1 || params.pageSize > MAX_PAGE_SIZE) {
      throw new Error(`pageSize must be 1-${MAX_PAGE_SIZE}`);
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

    if (params.scope) queryParams.scope = params.scope;
    if (params.service) queryParams.service = params.service;
    if (params.queueName) queryParams.queueName = params.queueName;
    if (params.kind) queryParams.kind = params.kind;
    if (params.jobId) queryParams.jobId = params.jobId;
    if (params.runId) queryParams.runId = params.runId;
    if (params.step) queryParams.step = params.step;
    if (params.issueScope) queryParams.issueScope = params.issueScope;
    if (params.message) queryParams.message = params.message;
    if (params.retryable !== undefined) {
      queryParams.retryable = String(params.retryable);
    }
    if (params.selectorDrift !== undefined) {
      queryParams.selectorDrift = String(params.selectorDrift);
    }
    if (params.page != null) queryParams.page = params.page;
    if (params.pageSize != null) queryParams.pageSize = params.pageSize;
    if (params.includeArtifacts === true) {
      queryParams.includeArtifacts = "true";
    }

    const response = await axiosInstance.get<NotificationIssuesResponse>(
      "fixtura-scraper/notifications/issues",
      { params: queryParams }
    );

    return response.data;
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
