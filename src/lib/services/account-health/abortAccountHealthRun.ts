"use server";

import axiosInstance from "@/lib/axios";
import type {
  AccountHealthAbortRequest,
  AccountHealthAbortResponse,
} from "@/types/accountHealth";
import { getAccountHealthAbortErrorLabel } from "@/lib/account-health/abortErrorLabels";
import {
  accountHealthMutationFailure,
  accountHealthMutationSuccess,
  type AccountHealthMutationResult,
} from "./accountHealthMutationResult";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/health/runs/:runId/abort — mark an active run failed and unblock the account.
 *
 * @see .comms/account-health-run-abort-handoff.md
 */
export async function abortAccountHealthRun(
  runId: number,
  options: AccountHealthAbortRequest = {}
): Promise<AccountHealthMutationResult<AccountHealthAbortResponse>> {
  if (!Number.isFinite(runId) || runId <= 0) {
    return accountHealthMutationFailure(
      getAccountHealthAbortErrorLabel("invalid_run_id")
    );
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
      return accountHealthMutationFailure(
        getAccountHealthAbortErrorLabel("abort_failed")
      );
    }

    return accountHealthMutationSuccess(response.data);
  } catch (error: unknown) {
    const raw = extractAccountHealthErrorMessage(error);
    return accountHealthMutationFailure(getAccountHealthAbortErrorLabel(raw));
  }
}
