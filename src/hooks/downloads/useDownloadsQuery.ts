//fetchDownloadByRenderId

import { useQuery } from "@tanstack/react-query";
import { fetchDownloadByRenderId } from "@/lib/services/downloads/fetchDownloadByRenderID";
import { fetchDownloadByID } from "@/lib/services/downloads/fetchDownloadByID";

export function useDownloadsQuery(renderId: string) {
  return useQuery({
    queryKey: ["downloads", renderId],
    queryFn: () => fetchDownloadByRenderId(renderId),
  });
}

export function useDownloadQuery(downloadId: string) {
  return useQuery({
    queryKey: ["download", downloadId],
    queryFn: () => fetchDownloadByID(downloadId),
  });
}
