import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { forceDownloadAssetRerender } from "@/lib/services/downloads/forceDownloadAssetRerender";

export function useForceDownloadAssetRerender(renderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (downloadId: number) => forceDownloadAssetRerender(downloadId),
    onSuccess: async () => {
      toast.success("Force rerender queued", {
        description:
          "hasError may stay set until Creator finishes the next pass.",
      });
      await queryClient.invalidateQueries({ queryKey: ["downloads", renderId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Force rerender failed");
    },
  });
}

/** Force rerender from download detail; refreshes this download and optional render list. */
export function useForceDownloadDetailRerender(
  downloadId: string,
  renderId?: string | number | null,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => forceDownloadAssetRerender(Number(downloadId)),
    onSuccess: async () => {
      toast.success("Force rerender queued", {
        description:
          "hasError may stay set until Creator finishes the next pass.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["download", downloadId],
      });
      if (renderId) {
        await queryClient.invalidateQueries({
          queryKey: ["downloads", String(renderId)],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Force rerender failed");
    },
  });
}
