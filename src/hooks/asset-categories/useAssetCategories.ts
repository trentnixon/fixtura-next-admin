import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ListAssetCategoriesResponse, GetAssetCategoryResponse, FetchAssetCategoriesParams } from "@/types/asset-category";
import { fetchAssetCategories, fetchAssetCategoryById } from "@/lib/services/asset-categories/fetchAssetCategories";

/**
 * Hook to fetch a list of asset categories
 */
export function useAssetCategories(
  params: FetchAssetCategoriesParams = {}
): UseQueryResult<ListAssetCategoriesResponse, Error> {
  return useQuery<ListAssetCategoriesResponse, Error>({
    queryKey: ["asset-categories", "list", params],
    queryFn: () => fetchAssetCategories(params),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch a single asset category by ID
 */
export function useAssetCategory(
  id: number | undefined,
  params: { populate?: string } = {}
): UseQueryResult<GetAssetCategoryResponse, Error> {
  return useQuery<GetAssetCategoryResponse, Error>({
    queryKey: ["asset-categories", "detail", id, params],
    queryFn: () => fetchAssetCategoryById(id!, params),
    enabled: !!id,
  });
}
