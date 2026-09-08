import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { abortAccountHealthRun } from "@/lib/services/account-health/abortAccountHealthRun";
import type {
  AccountHealthAbortRequest,
  AccountHealthAbortResponse,
} from "@/types/accountHealth";
import { toast } from "sonner";

export type AbortAccountHealthRunVars = {
  runId: number;
  accountId: number;
  options?: AccountHealthAbortRequest;
};

/**
 * Abort an active account-health run and invalidate related queries.
 *
 * @see .comms/account-health-run-abort-handoff.md
 */
export function useAbortAccountHealthRun(): UseMutationResult<
  AccountHealthAbortResponse,
  Error,
  AbortAccountHealthRunVars
> {
  const queryClient = useQueryClient();

  return useMutation<
    AccountHealthAbortResponse,
    Error,
    AbortAccountHealthRunVars
  >({
    mutationFn: async ({ runId, options }) => {
      return await abortAccountHealthRun(runId, options);
    },
    onSuccess: (_data, { runId, accountId }) => {
      toast.success(`Run #${runId} aborted — you can queue a new update`);
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
      toast.error(error.message || "Failed to abort run");
    },
  });
}
