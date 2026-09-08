import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { reconcileAccountHealthRun } from "@/lib/services/account-health/reconcileAccountHealthRun";
import type { AccountHealthReconcileResponse } from "@/types/accountHealth";
import { formatAccountHealthReconcileSuccessToast } from "@/lib/account-health/reconcileErrorLabels";
import { toast } from "sonner";

export type ReconcileAccountHealthRunVars = {
  runId: number;
  accountId: number;
};

/**
 * Reconcile a completed-limbo account-health run and invalidate related queries.
 *
 * @see .comms/Strapi/handoff/account-health-reconcile-button-handoff.md
 */
export function useReconcileAccountHealthRun(): UseMutationResult<
  AccountHealthReconcileResponse,
  Error,
  ReconcileAccountHealthRunVars
> {
  const queryClient = useQueryClient();

  return useMutation<
    AccountHealthReconcileResponse,
    Error,
    ReconcileAccountHealthRunVars
  >({
    mutationFn: async ({ runId }) => {
      return await reconcileAccountHealthRun(runId);
    },
    onSuccess: (data, { runId, accountId }) => {
      const { reconciled, requeued } = data.data;
      toast.success(
        formatAccountHealthReconcileSuccessToast(runId, reconciled, requeued)
      );
      queryClient.invalidateQueries({
        queryKey: ["accountHealth", "run", runId],
      });
      queryClient.invalidateQueries({
        queryKey: ["accountHealth", "account", accountId],
      });
      queryClient.invalidateQueries({
        queryKey: ["accountHealth", "global"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reconcile run");
    },
  });
}
