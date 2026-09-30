import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateParticle,
  deleteTemplateParticle,
  fetchTemplateParticles,
  setTemplateParticlePublished,
  updateTemplateParticle,
} from "@/lib/services/template-particle/templateParticle";
import { TemplateParticleInput } from "@/types/template-particle";

const queryKey = ["template-particles"];

export function useTemplateParticles() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateParticles(),
  });
}

export function useCreateTemplateParticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateParticleInput) => createTemplateParticle(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateParticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateParticleInput }) =>
      updateTemplateParticle(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateParticlePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateParticlePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateParticle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateParticle(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
