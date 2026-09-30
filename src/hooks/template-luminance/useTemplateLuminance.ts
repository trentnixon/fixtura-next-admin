import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateLuminance,
  deleteTemplateLuminance,
  fetchTemplateLuminances,
  setTemplateLuminancePublished,
  updateTemplateLuminance,
} from "@/lib/services/template-luminance/templateLuminance";
import { TemplateLuminanceInput } from "@/types/template-luminance";

const queryKey = ["template-luminances"];

export function useTemplateLuminances() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateLuminances(),
  });
}

export function useCreateTemplateLuminance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateLuminanceInput) => createTemplateLuminance(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateLuminance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateLuminanceInput }) =>
      updateTemplateLuminance(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateLuminancePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateLuminancePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateLuminance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateLuminance(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
