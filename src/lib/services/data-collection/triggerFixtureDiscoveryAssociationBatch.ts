"use server";

import axiosInstance from "@/lib/axios";
import axios from "axios";
import type {
  TriggerFixtureDiscoveryAssociationBatchRequest,
  TriggerFixtureDiscoveryAssociationBatchSuccessResponse,
} from "@/types/triggerFixtureDiscoveryAssociationBatch";

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
 * Triggers fixture discovery for every eligible grade under an association via
 * POST /api/association/trigger-fixture-discovery-batch.
 */
export async function triggerFixtureDiscoveryAssociationBatch(
  payload: TriggerFixtureDiscoveryAssociationBatchRequest
): Promise<TriggerFixtureDiscoveryAssociationBatchSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerFixtureDiscoveryAssociationBatchSuccessResponse>(
        "/association/trigger-fixture-discovery-batch",
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
      throw new Error(base);
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to trigger association fixture discovery batch"
    );
  }
}
