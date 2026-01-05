
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  FetchAudioOptionsParams,
  ListAudioOptionsResponse,
  GetAudioOptionResponse,
  CreateAudioOptionRequest,
  UpdateAudioOptionRequest,
  AudioOptionResponse,
  DeleteAudioOptionResponse,
} from "@/types/audio-option";
import { fetchAudioOptions, fetchAudioOptionById } from "@/lib/services/audio-options/fetchAudioOptions";
import { createAudioOption } from "@/lib/services/audio-options/createAudioOption";
import { updateAudioOption } from "@/lib/services/audio-options/updateAudioOption";
import { deleteAudioOption } from "@/lib/services/audio-options/deleteAudioOption";

/**
 * Hook to fetch a list of audio options
 */
export function useAudioOptions(
  params: FetchAudioOptionsParams = {}
): UseQueryResult<ListAudioOptionsResponse, Error> {
  return useQuery<ListAudioOptionsResponse, Error>({
    queryKey: ["audio-options", "list", params],
    queryFn: () => fetchAudioOptions(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single audio option by ID
 */
export function useAudioOption(
  id: number | undefined,
  params: { populate?: string } = {}
): UseQueryResult<GetAudioOptionResponse, Error> {
  return useQuery<GetAudioOptionResponse, Error>({
    queryKey: ["audio-options", "detail", id, params],
    queryFn: () => fetchAudioOptionById(id!, params),
    enabled: !!id,
  });
}

/**
 * Hook to create a new audio option
 */
export function useCreateAudioOption(): UseMutationResult<
  AudioOptionResponse,
  Error,
  CreateAudioOptionRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAudioOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-options"] });
    },
  });
}

/**
 * Hook to update an existing audio option
 */
export function useUpdateAudioOption(): UseMutationResult<
  AudioOptionResponse,
  Error,
  { id: number; data: UpdateAudioOptionRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateAudioOption(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["audio-options"] });
      queryClient.invalidateQueries({ queryKey: ["audio-options", "detail", variables.id] });
    },
  });
}

/**
 * Hook to delete an audio option
 */
export function useDeleteAudioOption(): UseMutationResult<
  DeleteAudioOptionResponse,
  Error,
  number
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAudioOption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audio-options"] });
    },
  });
}
