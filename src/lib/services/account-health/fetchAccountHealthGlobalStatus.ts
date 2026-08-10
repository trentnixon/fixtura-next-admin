"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthGlobalStatusResponse } from "@/types/accountHealth";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * GET /api/account/health/status — global account-health overview.
 */
export async function fetchAccountHealthGlobalStatus(): Promise<AccountHealthGlobalStatusResponse> {
  try {
    const response = await axiosInstance.get<AccountHealthGlobalStatusResponse>(
      "/account/health/status"
    );
    return response.data;
  } catch (error) {
    throw new Error(extractAccountHealthErrorMessage(error));
  }
}
