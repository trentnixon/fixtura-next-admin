import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateMode,
  deleteTemplateMode,
  fetchTemplateModes,
  setTemplateModePublished,
  updateTemplateMode,
} from "@/lib/services/template-mode/templateMode";
import { TemplateModeInput } from "@/types/template-mode";

const queryKey = ["template-modes"];

export function useTemplateModes() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateModes(),
  });
}

export function useCreateTemplateMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateModeInput) => createTemplateMode(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateModeInput }) =>
      updateTemplateMode(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateModePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateModePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateMode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateMode(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
