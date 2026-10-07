"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wipeFreeTrial } from "@/lib/services/free-trial/wipeFreeTrial";

export function useWipeFreeTrial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: number) => wipeFreeTrial(clientId),
    onSuccess: (result, clientId) => {
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      if (result.outcome === "wiped") {
        toast.success("Free trial removed");
      } else {
        toast.message("Nothing to remove");
      }

      queryClient.invalidateQueries({
        queryKey: ["analytics", "account", String(clientId)],
      });
    },
  });
}
