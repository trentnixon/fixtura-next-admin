import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateCategory,
  deleteTemplateCategory,
  fetchTemplateCategories,
  setTemplateCategoryPublished,
  updateTemplateCategory,
} from "@/lib/services/template-category/templateCategory";
import { TemplateCategoryInput } from "@/types/template-category";

const queryKey = ["template-categories"];

export function useTemplateCategories() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateCategories(),
  });
}

export function useCreateTemplateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateCategoryInput) => createTemplateCategory(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateCategoryInput }) =>
      updateTemplateCategory(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateCategoryPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateCategoryPublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
