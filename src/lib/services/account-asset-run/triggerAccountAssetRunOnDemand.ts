"use server";

import axiosInstance from "@/lib/axios";
import type {
  AccountAssetRunTriggerEnvelope,
  AccountAssetRunTriggerMode,
} from "@/types/accountAssetRun";
import { extractAccountAssetRunErrorMessage } from "./extractAccountAssetRunError";

/**
 * POST /api/account-asset-runs/account/:accountId/trigger
 * Returns queued | not_ready | skipped in envelope (HTTP 200); does not throw for blocking states.
 *
 * @see .comms/account-asset-run-on-demand-trigger-handoff.md
 */
export async function triggerAccountAssetRunOnDemand(
  accountId: number,
  mode: AccountAssetRunTriggerMode
): Promise<AccountAssetRunTriggerEnvelope> {
  if (!Number.isFinite(accountId) || accountId <= 0) {
    throw new Error("Invalid account ID.");
  }

  try {
    const response = await axiosInstance.post<AccountAssetRunTriggerEnvelope>(
      `/account-asset-runs/account/${accountId}/trigger`,
      { mode, force: true }
    );

    const d = response.data?.data as { status?: string } | undefined;
    if (
      !d ||
      (d.status !== "queued" && d.status !== "not_ready" && d.status !== "skipped")
    ) {
      throw new Error("Unexpected response from asset run trigger endpoint");
    }

    return response.data;
  } catch (error: unknown) {
    throw new Error(extractAccountAssetRunErrorMessage(error));
  }
}
