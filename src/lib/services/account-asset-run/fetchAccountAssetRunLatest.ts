"use server";

import axiosInstance from "@/lib/axios";
import type { AccountAssetRunLatestResponse } from "@/types/accountAssetRun";
import { extractAccountAssetRunErrorMessage } from "./extractAccountAssetRunError";

/**
 * GET /api/account-asset-runs/account/:accountId/latest — same shape as detail, or null.
 */
export async function fetchAccountAssetRunLatest(
  accountId: number
): Promise<AccountAssetRunLatestResponse> {
  try {
    const response =
      await axiosInstance.get<AccountAssetRunLatestResponse>(
        `/account-asset-runs/account/${accountId}/latest`
      );
    return response.data;
  } catch (error: unknown) {
    throw new Error(extractAccountAssetRunErrorMessage(error));
  }
}
