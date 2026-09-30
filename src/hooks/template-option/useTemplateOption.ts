import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteTemplateOption,
  fetchTemplateOptions,
  setTemplateOptionPublished,
  updateTemplateOption,
} from "@/lib/services/template-option/templateOption";
import { TemplateOptionInput } from "@/types/template-option";

const queryKey = ["template-options"];

export function useTemplateOptions(accountId?: number) {
  return useQuery({
    queryKey: [...queryKey, accountId ?? "all"],
    queryFn: () => fetchTemplateOptions(accountId),
  });
}

export function useUpdateTemplateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateOptionInput }) =>
      updateTemplateOption(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateOptionPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateOptionPublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateOption(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
