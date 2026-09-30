import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateNoise,
  deleteTemplateNoise,
  fetchTemplateNoises,
  setTemplateNoisePublished,
  updateTemplateNoise,
} from "@/lib/services/template-noise/templateNoise";
import { TemplateNoiseInput } from "@/types/template-noise";

const queryKey = ["template-noises"];

export function useTemplateNoises() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateNoises(),
  });
}

export function useCreateTemplateNoise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateNoiseInput) => createTemplateNoise(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateNoise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateNoiseInput }) =>
      updateTemplateNoise(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateNoisePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateNoisePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateNoise() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateNoise(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
