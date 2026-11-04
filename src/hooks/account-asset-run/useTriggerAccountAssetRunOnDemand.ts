"use client";

import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { triggerAccountAssetRunOnDemand } from "@/lib/services/account-asset-run/triggerAccountAssetRunOnDemand";
import type {
  AccountAssetRunTriggerEnvelope,
  AccountAssetRunTriggerMode,
} from "@/types/accountAssetRun";
import { getAccountAssetTriggerReasonLabel } from "@/lib/account-asset-run/triggerReasonLabels";
import { getGlobalV22GuardBlockedWithoutResultItem } from "@/lib/account-asset-run/globalV22Guard";

export type TriggerAccountAssetRunOnDemandVars = {
  accountId: number;
  mode: AccountAssetRunTriggerMode;
};

/**
 * POST /account-asset-runs/account/:id/trigger — queue asset workflow (respects eligibility).
 */
export function useTriggerAccountAssetRunOnDemand(): UseMutationResult<
  AccountAssetRunTriggerEnvelope,
  Error,
  TriggerAccountAssetRunOnDemandVars
> {
  const queryClient = useQueryClient();

  return useMutation<
    AccountAssetRunTriggerEnvelope,
    Error,
    TriggerAccountAssetRunOnDemandVars
  >({
    mutationFn: async ({ accountId, mode }) =>
      await triggerAccountAssetRunOnDemand(accountId, mode),
    onSuccess: (data: AccountAssetRunTriggerEnvelope, { accountId }) => {
      const payload = data.data;

      queryClient.invalidateQueries({
        queryKey: ["accountAssetRun", "account", accountId],
      });

      if (payload.status === "queued") {
        const runId = payload.run.id;
        const guardOnRun = getGlobalV22GuardBlockedWithoutResultItem(
          payload.run.items ?? [],
          payload.run.summary
        );
        const advancedBlocked =
          payload.advanced?.status === "global_v22_guard_blocked";

        if (guardOnRun || advancedBlocked) {
          const blockingId =
            guardOnRun?.blockingRunId ??
            (payload.advanced?.status === "global_v22_guard_blocked"
              ? payload.advanced.blockingRunId
              : undefined);
          toast.warning(
            blockingId
              ? `Run queued, but result scrape is blocked globally — monitor run #${blockingId}.`
              : "Run queued, but global v2.2 result scrape did not start on this run."
          );
        } else {
          toast.success(`Asset run queued — Run #${runId}`);
        }
        queryClient.invalidateQueries({
          queryKey: ["accountAssetRun", "run", runId],
        });
        queryClient.invalidateQueries({
          queryKey: ["accountAssetRun", "global"],
        });
        return;
      }

      const reasonLabel = getAccountAssetTriggerReasonLabel(payload.reason);

      if (payload.status === "not_ready") {
        toast.warning(reasonLabel);
        if (payload.reason === "active_run_exists" && payload.run?.id) {
          queryClient.invalidateQueries({
            queryKey: ["accountAssetRun", "run", payload.run.id],
          });
        }
        queryClient.invalidateQueries({
          queryKey: ["accountAssetRun", "global"],
        });
        return;
      }

      if (payload.status === "skipped") {
        toast.info(reasonLabel);
        queryClient.invalidateQueries({
          queryKey: ["accountAssetRun", "global"],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to queue asset run");
    },
  });
}
