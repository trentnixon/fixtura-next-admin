"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthAccountStatusResponse } from "@/types/accountHealth";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * GET /api/account/:accountId/health/status
 */
export async function fetchAccountHealthAccountStatus(
  accountId: number
): Promise<AccountHealthAccountStatusResponse> {
  try {
    const response =
      await axiosInstance.get<AccountHealthAccountStatusResponse>(
        `/account/${accountId}/health/status`
      );
    return response.data;
  } catch (error) {
    throw new Error(extractAccountHealthErrorMessage(error));
  }
}
