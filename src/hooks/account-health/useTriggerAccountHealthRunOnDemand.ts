import {
  useMutation,
  useQueryClient,
  UseMutationResult,
} from "@tanstack/react-query";
import { triggerAccountHealthRunOnDemand } from "@/lib/services/account-health/triggerAccountHealthRunOnDemand";
import type { AccountHealthTriggerResponse } from "@/types/accountHealth";
import { toast } from "sonner";

export type TriggerAccountHealthRunOnDemandVars = {
  accountId: number;
};

/**
 * Queue full season data refresh for one account via POST .../health/run-on-demand.
 *
 * @see .comms/account-health-on-demand-trigger-handoff.md
 */
export function useTriggerAccountHealthRunOnDemand(): UseMutationResult<
  AccountHealthTriggerResponse,
  Error,
  TriggerAccountHealthRunOnDemandVars
> {
  const queryClient = useQueryClient();

  return useMutation<
    AccountHealthTriggerResponse,
    Error,
    TriggerAccountHealthRunOnDemandVars
  >({
    mutationFn: async ({ accountId }: TriggerAccountHealthRunOnDemandVars) => {
      return await triggerAccountHealthRunOnDemand(accountId);
    },
    onSuccess: (data: AccountHealthTriggerResponse, { accountId }) => {
      const payload = data.data;

      queryClient.invalidateQueries({
        queryKey: ["accountHealth", "account", accountId],
      });

      if (payload.status === "queued") {
        toast.success(`Account update queued — Run #${payload.runId}`);
        queryClient.invalidateQueries({
          queryKey: ["accountHealth", "run", payload.runId],
        });
        return;
      }

      if (payload.status === "existing_active") {
        toast.info("An account update is already running");
        queryClient.invalidateQueries({
          queryKey: ["accountHealth", "run", payload.runId],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to queue account update");
    },
  });
}
