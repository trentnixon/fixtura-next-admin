import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AssetInput } from "@/types/asset";
import { createAsset } from "@/lib/services/assets/createAsset";

export function useCreateAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssetInput) => createAsset(data),
    onSuccess: () => {
      // Invalidate and refetch assets list
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
