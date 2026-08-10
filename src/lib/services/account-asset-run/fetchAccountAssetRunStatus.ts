"use server";

import axiosInstance from "@/lib/axios";
import type { AccountAssetRunDetailResponse } from "@/types/accountAssetRun";
import { extractAccountAssetRunErrorMessage } from "./extractAccountAssetRunError";

/**
 * GET /api/account-asset-runs/:id/status — full run detail for polling.
 */
export async function fetchAccountAssetRunStatus(
  runId: number
): Promise<AccountAssetRunDetailResponse> {
  try {
    const response =
      await axiosInstance.get<AccountAssetRunDetailResponse>(
        `/account-asset-runs/${runId}/status`
      );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractAccountAssetRunErrorMessage(error));
  }
}
