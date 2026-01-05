import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetInput } from "@/types/asset";
import { updateAsset } from "@/lib/services/assets/updateAsset";

export function useUpdateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AssetInput> }) =>
      updateAsset(id, data),
    onSuccess: () => {
      // Invalidate and refetch assets list
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
