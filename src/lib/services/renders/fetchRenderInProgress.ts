"use server";

import axiosInstance from "@/lib/axios";
import { handleApiError } from "@/lib/services/utils/error-handler";
import type { RenderInProgressRow } from "@/types/renderInProgress";

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value : null;
}

function readNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function readRow(value: unknown): RenderInProgressRow | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("renderId" in value) || typeof value.renderId !== "number") return null;
  if (!("processing" in value) || typeof value.processing !== "boolean") {
    return null;
  }
  if (!("complete" in value) || typeof value.complete !== "boolean") return null;

  return {
    renderId: value.renderId,
    renderName: "renderName" in value ? readNullableString(value.renderName) : null,
    processing: value.processing,
    complete: value.complete,
    startedAt: "startedAt" in value ? readNullableString(value.startedAt) : null,
    schedulerId:
      "schedulerId" in value ? readNullableNumber(value.schedulerId) : null,
    schedulerName:
      "schedulerName" in value ? readNullableString(value.schedulerName) : null,
    accountId: "accountId" in value ? readNullableNumber(value.accountId) : null,
    accountName:
      "accountName" in value ? readNullableString(value.accountName) : null,
    accountType:
      "accountType" in value ? readNullableString(value.accountType) : null,
    scheduledTime:
      "scheduledTime" in value ? readNullableString(value.scheduledTime) : null,
  };
}

/**
 * GET /api/render/admin/in-progress
 * Every render with Processing true, including older scheduler slots.
 */
export async function fetchRenderInProgress(): Promise<RenderInProgressRow[]> {
  const response = await axiosInstance
    .get<unknown>("/render/admin/in-progress")
    .catch((error: unknown) => {
      handleApiError(error, "fetchRenderInProgress");
    });

  const body = response.data;

  if (typeof body !== "object" || body === null || !("data" in body)) {
    throw new Error("In-progress renders response is missing data");
  }

  const data = body.data;
  if (typeof data !== "object" || data === null || !("rows" in data)) {
    throw new Error("In-progress renders response is missing rows");
  }

  if (!Array.isArray(data.rows)) {
    throw new Error("In-progress renders rows is not a list");
  }

  return data.rows.flatMap((row) => {
    const parsed = readRow(row);
    return parsed ? [parsed] : [];
  });
}
