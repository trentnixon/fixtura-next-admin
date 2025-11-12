//fetchDownloadByRenderId

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchDownloadByRenderId } from "@/lib/services/downloads/fetchDownloadByRenderID";
import { fetchDownloadByID } from "@/lib/services/downloads/fetchDownloadByID";
import { Download } from "@/types/download";

export function useDownloadsQuery(renderId: string) {
  return useQuery({
    queryKey: ["downloads", renderId],
    queryFn: () => fetchDownloadByRenderId(renderId),
  });
}

export function useDownloadQuery(downloadId: string): {
  data: Download | undefined;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  isFetching: boolean;
  refetch: UseQueryResult<Download>["refetch"];
} {
  const queryResult = useQuery<Download>({
    queryKey: ["download", downloadId],
    queryFn: () => fetchDownloadByID(downloadId),
  });

  return {
    data: queryResult.data,
    isLoading: queryResult.isLoading,
    isError: queryResult.isError,
    error: queryResult.error,
    isFetching: queryResult.isFetching,
    refetch: queryResult.refetch,
  };
}
