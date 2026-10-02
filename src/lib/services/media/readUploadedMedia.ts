export interface UploadedMedia {
  id: number;
  url: string | null;
  name: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFile(value: unknown): UploadedMedia | null {
  if (!isRecord(value) || typeof value.id !== "number") return null;
  const attributes = isRecord(value.attributes) ? value.attributes : value;
  return {
    id: value.id,
    url: typeof attributes.url === "string" ? attributes.url : null,
    name: typeof attributes.name === "string" ? attributes.name : "",
  };
}

export function readUploadedMedia(body: unknown): UploadedMedia {
  const list = Array.isArray(body)
    ? body
    : isRecord(body) && Array.isArray(body.data)
      ? body.data
      : [body];
  for (const item of list) {
    const file = readFile(item);
    if (file) return file;
  }
  throw new Error("The CMS upload did not return a media file");
}
