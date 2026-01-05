import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { AssetsResponse, FetchAssetsParams } from "@/types/asset";
import { fetchAssets } from "@/lib/services/assets/fetchAssets";

export function useAssets(
  params: FetchAssetsParams = {}
): UseQueryResult<AssetsResponse, Error> {
  return useQuery<AssetsResponse, Error>({
    queryKey: ["assets", params],
    queryFn: () => fetchAssets(params),
    placeholderData: (previousData) => previousData,
  });
}
