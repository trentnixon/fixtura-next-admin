"use server";

import axiosInstance from "@/lib/axios";
import type { AccountAssetRunGlobalStatusResponse } from "@/types/accountAssetRun";
import {
  extractAccountAssetRunErrorMessage,
  getAccountAssetRunHttpStatus,
} from "./extractAccountAssetRunError";

const DEFAULT_LIMIT = 25;

/**
 * GET /api/account-asset-runs/status — slim recent runs list.
 */
export async function fetchAccountAssetRunGlobalStatus(
  limit = DEFAULT_LIMIT
): Promise<AccountAssetRunGlobalStatusResponse> {
  try {
    const response =
      await axiosInstance.get<AccountAssetRunGlobalStatusResponse>(
        "/account-asset-runs/status",
        { params: { limit } }
      );
    return response.data;
  } catch (error: unknown) {
    if (getAccountAssetRunHttpStatus(error) === 404) {
      console.warn(
        "[fetchAccountAssetRunGlobalStatus] GET /account-asset-runs/status returned 404 — returning empty list (CMS route may be missing or base URL misconfigured)."
      );
      return { data: [] };
    }
    throw new Error(extractAccountAssetRunErrorMessage(error));
  }
}
