"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthResumeResponse } from "@/types/accountHealth";
import { getAccountHealthResumeErrorLabel } from "@/lib/account-health/resumeErrorLabels";
import {
  accountHealthMutationFailure,
  accountHealthMutationSuccess,
  type AccountHealthMutationResult,
} from "./accountHealthMutationResult";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/health/runs/:runId/resume — restart from the first health item.
 *
 * @see .comms/account-health-status-admin-handoff.md
 */
export async function resumeAccountHealthRun(
  runId: number
): Promise<AccountHealthMutationResult<AccountHealthResumeResponse>> {
  if (!Number.isFinite(runId) || runId <= 0) {
    return accountHealthMutationFailure(
      getAccountHealthResumeErrorLabel("invalid_run_id")
    );
  }

  try {
    const response = await axiosInstance.post<AccountHealthResumeResponse>(
      `/account/health/runs/${runId}/resume`
    );

    if (response.data?.data?.status !== "resumed") {
      return accountHealthMutationFailure(
        getAccountHealthResumeErrorLabel("resume_failed")
      );
    }

    return accountHealthMutationSuccess(response.data);
  } catch (error: unknown) {
    const raw = extractAccountHealthErrorMessage(error);
    return accountHealthMutationFailure(getAccountHealthResumeErrorLabel(raw));
  }
}
