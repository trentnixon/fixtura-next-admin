import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { resumeAccountHealthRun } from "@/lib/services/account-health/resumeAccountHealthRun";
import { unwrapAccountHealthMutation } from "@/lib/services/account-health/accountHealthMutationResult";
import type { AccountHealthResumeResponse } from "@/types/accountHealth";
import { toast } from "sonner";

export type ResumeAccountHealthRunVars = {
  runId: number;
  accountId: number;
};

/**
 * Resume an account-health run from the first item and invalidate related queries.
 *
 * @see .comms/account-health-status-admin-handoff.md
 */
export function useResumeAccountHealthRun(): UseMutationResult<
  AccountHealthResumeResponse,
  Error,
  ResumeAccountHealthRunVars
> {
  const queryClient = useQueryClient();

  return useMutation<
    AccountHealthResumeResponse,
    Error,
    ResumeAccountHealthRunVars
  >({
    mutationFn: async ({ runId }) => {
      const result = await resumeAccountHealthRun(runId);
      return unwrapAccountHealthMutation(result);
    },
    onSuccess: (data, { runId, accountId }) => {
      const itemId = data.data.itemId;
      toast.success(
        itemId
          ? `Run #${runId} resumed from item #${itemId}`
          : `Run #${runId} resumed — workflow will continue from the first step`
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
      toast.error(error.message || "Failed to resume run");
    },
  });
}
