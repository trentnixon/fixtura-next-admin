
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ListAssetTypesResponse, GetAssetTypeResponse, FetchAssetTypesParams } from "@/types/asset-type";
import { fetchAssetTypes, fetchAssetTypeById } from "@/lib/services/asset-types/fetchAssetTypes";

/**
 * Hook to fetch a list of asset types
 */
export function useAssetTypes(
  params: FetchAssetTypesParams = {}
): UseQueryResult<ListAssetTypesResponse, Error> {
  return useQuery<ListAssetTypesResponse, Error>({
    queryKey: ["asset-types", "list", params],
    queryFn: () => {
      console.log("[useAssetTypes] Fetching...", params);
      return fetchAssetTypes(params);
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single asset type by ID
 */
export function useAssetType(
  id: number | undefined,
  params: { populate?: string } = {}
): UseQueryResult<GetAssetTypeResponse, Error> {
  return useQuery<GetAssetTypeResponse, Error>({
    queryKey: ["asset-types", "detail", id, params],
    queryFn: () => fetchAssetTypeById(id!),
    enabled: !!id,
  });
}
