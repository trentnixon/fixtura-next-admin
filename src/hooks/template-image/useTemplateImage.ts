import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplateImage,
  deleteTemplateImage,
  fetchTemplateImages,
  setTemplateImagePublished,
  updateTemplateImage,
} from "@/lib/services/template-image/templateImage";
import { TemplateImageInput } from "@/types/template-image";

const queryKey = ["template-images"];

export function useTemplateImages() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplateImages(),
  });
}

export function useCreateTemplateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplateImageInput) => createTemplateImage(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplateImageInput }) =>
      updateTemplateImage(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplateImagePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplateImagePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplateImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplateImage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
