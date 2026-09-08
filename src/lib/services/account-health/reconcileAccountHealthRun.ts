"use server";

import axiosInstance from "@/lib/axios";
import type { AccountHealthReconcileResponse } from "@/types/accountHealth";
import { getAccountHealthReconcileErrorLabel } from "@/lib/account-health/reconcileErrorLabels";
import { extractAccountHealthErrorMessage } from "./extractAccountHealthError";

/**
 * POST /api/account/health/runs/:runId/reconcile — recheck fixture-discovery rows and finalize.
 *
 * @see .comms/Strapi/handoff/account-health-reconcile-button-handoff.md
 */
export async function reconcileAccountHealthRun(
  runId: number
): Promise<AccountHealthReconcileResponse> {
  if (!Number.isFinite(runId) || runId <= 0) {
    throw new Error(getAccountHealthReconcileErrorLabel("invalid_run_id"));
  }

  try {
    const response = await axiosInstance.post<AccountHealthReconcileResponse>(
      `/account/health/runs/${runId}/reconcile`
    );

    if (response.data?.data?.status !== "reconciled") {
      throw new Error(getAccountHealthReconcileErrorLabel("reconcile_failed"));
    }

    return response.data;
  } catch (error: unknown) {
    const raw = extractAccountHealthErrorMessage(error);
    throw new Error(getAccountHealthReconcileErrorLabel(raw));
  }
}
