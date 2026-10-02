import { useMutation } from "@tanstack/react-query";
import { uploadCmsImage } from "@/lib/services/media/uploadCmsImage";

export function useUploadCmsImage() {
  return useMutation({
    mutationFn: (formData: FormData) => uploadCmsImage(formData),
  });
}
