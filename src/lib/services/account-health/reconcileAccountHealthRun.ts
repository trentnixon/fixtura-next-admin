"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthReconcileResponse } from "@/types/accountHealth";
import { getAccountHealthReconcileErrorLabel } from "@/lib/account-health/reconcileErrorLabels";
import {
  accountHealthMutationFailure,
  accountHealthMutationSuccess,
  type AccountHealthMutationResult,
} from "./accountHealthMutationResult";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/health/runs/:runId/reconcile — recheck fixture-discovery rows and finalize.
 *
 * @see .comms/Strapi/handoff/account-health-reconcile-button-handoff.md
 */
export async function reconcileAccountHealthRun(
  runId: number
): Promise<AccountHealthMutationResult<AccountHealthReconcileResponse>> {
  if (!Number.isFinite(runId) || runId <= 0) {
    return accountHealthMutationFailure(
      getAccountHealthReconcileErrorLabel("invalid_run_id")
    );
  }

  try {
    const response = await axiosInstance.post<AccountHealthReconcileResponse>(
      `/account/health/runs/${runId}/reconcile`
    );

    if (response.data?.data?.status !== "reconciled") {
      return accountHealthMutationFailure(
        getAccountHealthReconcileErrorLabel("reconcile_failed")
      );
    }

    return accountHealthMutationSuccess(response.data);
  } catch (error: unknown) {
    const raw = extractAccountHealthErrorMessage(error);
    return accountHealthMutationFailure(
      getAccountHealthReconcileErrorLabel(raw)
    );
  }
}
