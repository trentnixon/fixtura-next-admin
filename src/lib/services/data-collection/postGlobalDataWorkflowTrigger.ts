"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  GlobalDataWorkflowTriggerRequest,
  GlobalDataWorkflowTriggerResponse,
} from "@/types/globalDataWorkflowTrigger";

function getAxiosErrorMessage(error: AxiosError, fallback: string): string {
  return (
    (error.response?.data as { error?: { message?: string } })?.error
      ?.message ??
    (error.response?.data as { message?: string })?.message ??
    error.message ??
    `${fallback}: ${error.response?.status ?? "Unknown"}`
  );
}

/**
 * POST to a global data workflow trigger endpoint.
 */
export async function postGlobalDataWorkflowTrigger(
  path: string,
  payload: GlobalDataWorkflowTriggerRequest = {},
  errorFallback: string,
): Promise<GlobalDataWorkflowTriggerResponse> {
  try {
    const response =
      await axiosInstance.post<GlobalDataWorkflowTriggerResponse>(
        path,
        payload.idempotencyKey ? payload : {},
        payload.idempotencyKey
          ? { headers: { "Idempotency-Key": payload.idempotencyKey } }
          : undefined,
      );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(getAxiosErrorMessage(error, errorFallback));
    }
    throw new Error(
      error instanceof Error ? error.message : errorFallback,
    );
  }
}
