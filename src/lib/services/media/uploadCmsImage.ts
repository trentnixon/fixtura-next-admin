"use server";

import axiosInstance from "@/lib/axios";
import { handleApiError } from "../utils/error-handler";
import { readUploadedMedia, UploadedMedia } from "./readUploadedMedia";

export async function uploadCmsImage(formData: FormData): Promise<UploadedMedia> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose an image file");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("The plate must be an image");
  }

  const body = new FormData();
  body.append("files", file, file.name);
  const plateName = formData.get("name");
  if (typeof plateName === "string" && plateName.trim()) {
    body.append(
      "fileInfo",
      JSON.stringify({ name: plateName.trim(), alternativeText: plateName.trim() }),
    );
  }

  try {
    const response = await axiosInstance.post("/upload", body, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return readUploadedMedia(response.data);
  } catch (error) {
    handleApiError(error, "uploadCmsImage");
  }
}
