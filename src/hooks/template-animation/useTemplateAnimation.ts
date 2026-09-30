import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateAnimation,
  deleteTemplateAnimation,
  fetchTemplateAnimations,
  setTemplateAnimationPublished,
  updateTemplateAnimation,
} from "@/lib/services/template-animation/templateAnimation";
import { TemplateAnimationInput } from "@/types/template-animation";

const queryKey = ["template-animations"];

export function useTemplateAnimations() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateAnimations(),
  });
}

export function useCreateTemplateAnimation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateAnimationInput) => createTemplateAnimation(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateAnimation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateAnimationInput }) =>
      updateTemplateAnimation(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateAnimationPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateAnimationPublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateAnimation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateAnimation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
