import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAsset } from "@/lib/services/assets/deleteAsset";

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAsset(id),
    onSuccess: () => {
      // Invalidate and refetch assets list
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
