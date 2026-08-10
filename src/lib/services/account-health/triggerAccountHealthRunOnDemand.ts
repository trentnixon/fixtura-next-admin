"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthTriggerResponse } from "@/types/accountHealth";
import { getAccountHealthTriggerErrorLabel } from "@/lib/account-health/triggerErrorLabels";
import { extractAccountHealthTriggerErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/:accountId/health/run-on-demand — queue full season data refresh now.
 * Bypasses cron 5-day due check only; same safety gates as cron.
 *
 * @see .comms/account-health-on-demand-trigger-handoff.md
 */
export async function triggerAccountHealthRunOnDemand(
  accountId: number
): Promise<AccountHealthTriggerResponse> {
  if (!Number.isFinite(accountId) || accountId <= 0) {
    throw new Error(getAccountHealthTriggerErrorLabel("invalid_account_id"));
  }

  try {
    const response = await axiosInstance.post<AccountHealthTriggerResponse>(
      `/account/${accountId}/health/run-on-demand`,
      {}
    );

    const body = response.data?.data;
    if (!body || (body.status !== "queued" && body.status !== "existing_active")) {
      throw new Error("Unexpected response from run-on-demand endpoint");
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractAccountHealthTriggerErrorMessage(error));
  }
}
