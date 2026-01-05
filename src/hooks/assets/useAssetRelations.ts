import { useQuery } from "@tanstack/react-query";
import { AssetCategory, AssetType } from "@/types/asset";
import {
  fetchAssetCategories,
  fetchAssetTypes,
} from "@/lib/services/assets/fetchAssetRelations";

export function useAssetCategories() {
  return useQuery<AssetCategory[], Error>({
    queryKey: ["asset-categories"],
    queryFn: fetchAssetCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAssetTypes() {
  return useQuery<AssetType[], Error>({
    queryKey: ["asset-types"],
    queryFn: fetchAssetTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
