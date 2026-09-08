"use server";

import axiosInstance from "@/lib/axios";
import type {
  AccountHealthAbortRequest,
  AccountHealthAbortResponse,
} from "@/types/accountHealth";
import { getAccountHealthAbortErrorLabel } from "@/lib/account-health/abortErrorLabels";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/health/runs/:runId/abort — mark an active run failed and unblock the account.
 *
 * @see .comms/account-health-run-abort-handoff.md
 */
export async function abortAccountHealthRun(
  runId: number,
  options: AccountHealthAbortRequest = {}
): Promise<AccountHealthAbortResponse> {
  if (!Number.isFinite(runId) || runId <= 0) {
    throw new Error(getAccountHealthAbortErrorLabel("invalid_run_id"));
  }

  const body: AccountHealthAbortRequest = {
    reason: options.reason ?? "operator_aborted",
    cleanupItems: options.cleanupItems ?? true,
  };

  try {
    const response = await axiosInstance.post<AccountHealthAbortResponse>(
      `/account/health/runs/${runId}/abort`,
      body
    );

    if (!response.data?.data?.id) {
      throw new Error(getAccountHealthAbortErrorLabel("abort_failed"));
    }

    return response.data;
  } catch (error: unknown) {
    const raw = extractAccountHealthErrorMessage(error);
    throw new Error(getAccountHealthAbortErrorLabel(raw));
  }
}
