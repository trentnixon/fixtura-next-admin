// useDeleteRender.ts

import { deleteRenderById } from "@/lib/services/renders/deleteRender";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface DeleteRenderResponse {
  message: string; // Assuming Strapi returns a success message on deletion
}

export const useDeleteRenderMutation = (contentHub: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (renderId: string) => deleteRenderById(renderId),
    onSuccess: (_data: DeleteRenderResponse, renderId: string) => {
      console.log(`Render with ID ${renderId} deleted successfully.`);
      queryClient.invalidateQueries({ queryKey: ["renders", contentHub] });
    },
    onError: (error: Error) => {
      console.error("Error deleting render:", error);
    },
  });
};
