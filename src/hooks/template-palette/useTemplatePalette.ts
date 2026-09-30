import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTemplatePalette,
  deleteTemplatePalette,
  fetchTemplatePalettes,
  setTemplatePalettePublished,
  updateTemplatePalette,
} from "@/lib/services/template-palette/templatePalette";
import { TemplatePaletteInput } from "@/types/template-palette";

const queryKey = ["template-palettes"];

export function useTemplatePalettes() {
  return useQuery({
    queryKey,
    queryFn: () => fetchTemplatePalettes(),
  });
}

export function useCreateTemplatePalette() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TemplatePaletteInput) => createTemplatePalette(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useUpdateTemplatePalette() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: TemplatePaletteInput }) =>
      updateTemplatePalette(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useSetTemplatePalettePublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      setTemplatePalettePublished(id, published),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}

export function useDeleteTemplatePalette() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTemplatePalette(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });
}
