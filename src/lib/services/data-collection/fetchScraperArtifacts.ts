"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import qs from "qs";
import type {
  FetchScraperArtifactsParams,
  ScraperArtifact,
  ScraperArtifactFile,
  ScraperArtifactsResponse,
} from "@/types/scraperArtifact";

const ENDPOINT = "/fixtura-scraper-artifacts";
const PAGE_SIZE = 50;

function isRecord(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === "object" && !Array.isArray(v);
}

function parseArtifactFile(raw: unknown): ScraperArtifactFile | null {
  if (!raw) return null;

  if (isRecord(raw) && "data" in raw) {
    return parseArtifactFile(raw.data);
  }

  if (!isRecord(raw)) return null;

  const attrs =
    "attributes" in raw && isRecord(raw.attributes) ? raw.attributes : raw;

  const id =
    typeof raw.id === "number"
      ? raw.id
      : typeof attrs.id === "number"
        ? attrs.id
        : null;

  return {
    id,
    name:
      typeof attrs.name === "string"
        ? attrs.name
        : typeof attrs.filename === "string"
          ? attrs.filename
          : null,
    url: typeof attrs.url === "string" ? attrs.url : null,
    mime:
      typeof attrs.mime === "string"
        ? attrs.mime
        : typeof attrs.contentType === "string"
          ? attrs.contentType
          : null,
  };
}

function normalizeArtifact(raw: unknown): ScraperArtifact | null {
  if (!isRecord(raw)) return null;

  const id = typeof raw.id === "number" ? raw.id : null;
  if (id == null) return null;

  const attrs =
    "attributes" in raw && isRecord(raw.attributes) ? raw.attributes : raw;

  return {
    id,
    jobId: typeof attrs.jobId === "string" ? attrs.jobId : null,
    bullJobId: typeof attrs.bullJobId === "string" ? attrs.bullJobId : null,
    runId: typeof attrs.runId === "string" ? attrs.runId : null,
    fixtureKey: typeof attrs.fixtureKey === "string" ? attrs.fixtureKey : null,
    artifactType:
      typeof attrs.artifactType === "string" ? attrs.artifactType : null,
    contentType:
      typeof attrs.contentType === "string" ? attrs.contentType : null,
    file: parseArtifactFile(attrs.file),
    createdAt:
      typeof attrs.createdAt === "string" ? attrs.createdAt : null,
    updatedAt:
      typeof attrs.updatedAt === "string" ? attrs.updatedAt : null,
  };
}

function normalizeArtifactsResponse(body: unknown): ScraperArtifactsResponse {
  if (!body || typeof body !== "object") {
    return { data: [] };
  }

  const o = body as Record<string, unknown>;
  const rows = Array.isArray(o.data) ? o.data : Array.isArray(body) ? body : [];

  const data = rows
    .map((row) => normalizeArtifact(row))
    .filter((row): row is ScraperArtifact => row != null);

  const meta =
    isRecord(o.meta) && isRecord(o.meta.pagination)
      ? {
          pagination: {
            page: Number(o.meta.pagination.page) || 1,
            pageSize: Number(o.meta.pagination.pageSize) || data.length,
            pageCount: Number(o.meta.pagination.pageCount) || 1,
            total: Number(o.meta.pagination.total) || data.length,
          },
        }
      : undefined;

  return { data, meta };
}

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
    : "Failed to fetch scraper artifacts";
}

/**
 * Lists debug artifacts (screenshots) from fixtura-scraper-artifact for a job.
 * GET /api/fixtura-scraper-artifacts
 */
export async function fetchScraperArtifacts(
  params: FetchScraperArtifactsParams,
): Promise<ScraperArtifactsResponse> {
  const jobId = params.jobId?.trim();
  if (!jobId) {
    throw new Error("jobId is required");
  }

  const filters: Record<string, unknown> = {
    jobId: { $eq: jobId },
  };

  const query = qs.stringify(
    {
      filters,
      populate: { file: true },
      pagination: { page: 1, pageSize: PAGE_SIZE },
      sort: ["createdAt:desc"],
    },
    { encodeValuesOnly: true },
  );

  try {
    const response = await axiosInstance.get(`${ENDPOINT}?${query}`);
    return normalizeArtifactsResponse(response.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
