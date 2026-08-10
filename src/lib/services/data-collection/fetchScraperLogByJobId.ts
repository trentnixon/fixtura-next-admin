"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  JobSummary,
  ListLogsResponse,
  LogEntry,
  ScraperLogByJobIdResponse,
} from "@/types/scraperLogs";

function sortEntries(entries: LogEntry[]): LogEntry[] {
  return [...entries].sort(
    (a, b) =>
      new Date(a.timestamp ?? a.createdAt).getTime() -
      new Date(b.timestamp ?? b.createdAt).getTime()
  );
}

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

/**
 * Map axios interceptor rejection `{ status, data, message }` or AxiosError to Error.
 */
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
  return error instanceof Error ? error : new Error("Failed to fetch job log");
}

/**
 * Normalize alternate CMS shapes for GET .../logs/:jobId
 */
function normalizeSingleJobResponse(
  data: unknown,
  expectedJobId: string
): ScraperLogByJobIdResponse | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;

  if ("job" in o && o.job && typeof o.job === "object") {
    const job = o.job as JobSummary;
    const entriesRaw =
      (o.entries as LogEntry[] | undefined) ?? job.entries ?? [];
    if (job.jobId === expectedJobId) {
      return { job, entries: sortEntries(entriesRaw) };
    }
  }

  if ("data" in o && Array.isArray(o.data) && o.data.length >= 1) {
    const first = o.data[0] as JobSummary;
    if (first.jobId === expectedJobId) {
      return { job: first, entries: sortEntries(first.entries ?? []) };
    }
  }

  if (
    "data" in o &&
    o.data &&
    typeof o.data === "object" &&
    !Array.isArray(o.data)
  ) {
    const inner = o.data as Record<string, unknown>;
    if ("job" in inner && inner.job && typeof inner.job === "object") {
      const job = inner.job as JobSummary;
      const entriesRaw =
        (inner.entries as LogEntry[] | undefined) ?? job.entries ?? [];
      if (job.jobId === expectedJobId) {
        return { job, entries: sortEntries(entriesRaw) };
      }
    }
  }

  if ("jobId" in o && typeof o.jobId === "string") {
    const job = o as unknown as JobSummary;
    if (job.jobId === expectedJobId) {
      return { job, entries: sortEntries(job.entries ?? []) };
    }
  }

  return null;
}

/**
 * Fetches one scraper job with full event entries.
 *
 * 1) `GET fixtura-scraper/logs?jobId=…&include=entries` (preferred).
 * 2) On 5xx / network failure only: `GET fixtura-scraper/logs/:jobId` (path).
 *
 * 4xx from step 1 (e.g. 404, 400) is thrown immediately — no redundant path call.
 *
 * @see src/app/dashboard/data/.comms/cms-response-admin-scraper-log-job-detail-api.md
 * @see src/app/dashboard/data/.comms/admin-frontend-scraper-log-by-job-id-integration.md
 */
export async function fetchScraperLogByJobId(
  jobId: string
): Promise<ScraperLogByJobIdResponse> {
  const trimmed = jobId.trim();
  if (!trimmed) {
    throw new Error("jobId is required");
  }

  let listResponse: ListLogsResponse | null = null;
  try {
    const res = await axiosInstance.get<ListLogsResponse>(
      "fixtura-scraper/logs",
      {
        params: {
          jobId: trimmed,
          include: "entries",
          "pagination[page]": 1,
          "pagination[pageSize]": 100,
        },
      }
    );
    listResponse = res.data;
  } catch (e) {
    const status = getHttpStatus(e);
    if (status != null && status >= 400 && status < 500) {
      throw mapRejectedRequestToError(e);
    }
    listResponse = null;
  }

  if (listResponse) {
    const jobFromList = listResponse.data.find((j) => j.jobId === trimmed);
    if (jobFromList) {
      return {
        job: jobFromList,
        entries: sortEntries(jobFromList.entries ?? []),
      };
    }
  }

  try {
    const res = await axiosInstance.get<unknown>(
      `fixtura-scraper/logs/${encodeURIComponent(trimmed)}`
    );
    const normalized = normalizeSingleJobResponse(res.data, trimmed);
    if (normalized) {
      return normalized;
    }
  } catch (e) {
    throw mapRejectedRequestToError(e);
  }

  throw new Error(`Job not found: ${trimmed}`);
}
