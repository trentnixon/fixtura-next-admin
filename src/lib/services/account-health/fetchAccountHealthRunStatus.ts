"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthRunStatusResponse } from "@/types/accountHealth";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * GET /api/account/health/runs/:runId/status
 */
export async function fetchAccountHealthRunStatus(
  runId: number
): Promise<AccountHealthRunStatusResponse> {
  try {
    const response = await axiosInstance.get<AccountHealthRunStatusResponse>(
      `/account/health/runs/${runId}/status`
    );
    return response.data;
  } catch (error) {
    throw new Error(extractAccountHealthErrorMessage(error));
  }
}
