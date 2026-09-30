import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBrandTheme,
  deleteBrandTheme,
  fetchBrandThemes,
  updateBrandTheme,
} from "@/lib/services/brand-theme/brandTheme";
import { BrandThemeInput } from "@/types/brand-theme";

const queryKey = ["brand-themes"];

export function useBrandThemes() {
  return useQuery({
    queryKey,
    queryFn: () => fetchBrandThemes(),
  });
}

export function useCreateBrandTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BrandThemeInput) => createBrandTheme(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateBrandTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: BrandThemeInput }) =>
      updateBrandTheme(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteBrandTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteBrandTheme(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
