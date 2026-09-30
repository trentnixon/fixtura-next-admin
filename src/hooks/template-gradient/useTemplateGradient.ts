import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateGradient,
  deleteTemplateGradient,
  fetchTemplateGradients,
  setTemplateGradientPublished,
  updateTemplateGradient,
} from "@/lib/services/template-gradient/templateGradient";
import { TemplateGradientInput } from "@/types/template-gradient";

const queryKey = ["template-gradients"];

export function useTemplateGradients() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateGradients(),
  });
}

export function useCreateTemplateGradient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateGradientInput) => createTemplateGradient(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateGradient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateGradientInput }) =>
      updateTemplateGradient(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateGradientPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateGradientPublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateGradient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateGradient(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
