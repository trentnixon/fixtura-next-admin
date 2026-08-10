"use server";

import axiosInstance from "@/lib/axios";
import axios from "axios";
import type {
  TriggerGradesBatchScrapeRequest,
  TriggerGradesBatchScrapeSuccessResponse,
} from "@/types/triggerGradesBatchScrape";

function messageFromAxiosResponseData(data: unknown): string | undefined {
  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }
  if (data && typeof data === "object") {
    const o = data as { error?: { message?: string }; message?: string };
    return o.error?.message ?? o.message;
  }
  return undefined;
}

/** Next/server can break `axios.isAxiosError`; still read response when shape matches. */
function extractAxiosErrorParts(error: unknown): {
  status?: number;
  data: unknown;
  message: string;
} | null {
  if (axios.isAxiosError(error)) {
    return {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
  }
  if (
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: unknown }).response !== undefined &&
    typeof (error as { response: unknown }).response === "object"
  ) {
    const r = (error as { response: { status?: number; data?: unknown } })
      .response;
    return {
      status: r.status,
      data: r.data,
      message: (error as { message?: string }).message ?? "Request failed",
    };
  }
  return null;
}

/**
 * Triggers a grades batch scrape for one association by calling
 * POST /api/competition/trigger-grades-batch-scrape.
 * Enqueues scrape:grades-batch; worker fetches competitions via GET /api/competition/batch/:id.
 * Auth not required by endpoint.
 *
 * @param payload - associationId (preferred) or gradesBatchContextId; optional runId/jobId
 * @throws Error on validation (400) or server (500) errors
 * @see .comms/Strapi/requests/admin-frontend-trigger-grades-batch-scrape-integration.md
 */
export async function triggerGradesBatchScrape(
  payload: TriggerGradesBatchScrapeRequest
): Promise<TriggerGradesBatchScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerGradesBatchScrapeSuccessResponse>(
        "/competition/trigger-grades-batch-scrape",
        payload
      );

    return response.data;
  } catch (error) {
    const parts = extractAxiosErrorParts(error);
    if (parts) {
      const fromBody = messageFromAxiosResponseData(parts.data);
      const base =
        fromBody ??
        parts.message ??
        `Request failed: ${parts.status ?? "Unknown"}`;
      if (parts.status === 405) {
        throw new Error(
          `${base} — CMS returned 405: POST is not registered for this path (often route order: register POST /trigger-grades-batch-scrape before GET /api/competition/:id), or the endpoint is not deployed.`
        );
      }
      throw new Error(base);
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to trigger grades batch scrape"
    );
  }
}
