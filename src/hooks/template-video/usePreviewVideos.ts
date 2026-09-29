import { useQuery } from "@tanstack/react-query";
import { fetchPreviewVideos } from "@/lib/services/template-video/fetchPreviewVideos";

export function usePreviewVideos() {
  return useQuery({
    queryKey: ["template-videos", "preview"],
    queryFn: () => fetchPreviewVideos(),
  });
}
