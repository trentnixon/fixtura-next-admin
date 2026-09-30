import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateTexture,
  deleteTemplateTexture,
  fetchTemplateTextures,
  setTemplateTexturePublished,
  updateTemplateTexture,
} from "@/lib/services/template-texture/templateTexture";
import { TemplateTextureInput } from "@/types/template-texture";

const queryKey = ["template-textures"];

export function useTemplateTextures() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateTextures(),
  });
}

export function useCreateTemplateTexture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateTextureInput) => createTemplateTexture(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateTexture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateTextureInput }) =>
      updateTemplateTexture(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateTexturePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateTexturePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateTexture() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateTexture(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
