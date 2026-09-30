import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplatePattern,
  deleteTemplatePattern,
  fetchTemplatePatterns,
  setTemplatePatternPublished,
  updateTemplatePattern,
} from "@/lib/services/template-pattern/templatePattern";
import { TemplatePatternInput } from "@/types/template-pattern";

const queryKey = ["template-patterns"];

export function useTemplatePatterns() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplatePatterns(),
  });
}

export function useCreateTemplatePattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplatePatternInput) => createTemplatePattern(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplatePattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplatePatternInput }) =>
      updateTemplatePattern(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplatePatternPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplatePatternPublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplatePattern() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplatePattern(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
