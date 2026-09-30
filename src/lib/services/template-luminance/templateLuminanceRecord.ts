import { TemplateLuminance } from "@/types/template-luminance";

interface RawMedia {
  id?: number;
  url?: string;
  name?: string;
  attributes?: {
    url?: string;
    name?: string;
  };
  data?: RawMedia | null;
}

interface RawLuminance {
  id: number;
  name?: string;
  image?: number | RawMedia | null;
  publishedAt?: string | null;
  attributes?: Omit<RawLuminance, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function readMedia(image: RawLuminance["image"]): {
  imageId: number | null;
  imageUrl: string | null;
  imageName: string | null;
} {
  if (typeof image === "number") {
    return { imageId: image, imageUrl: null, imageName: null };
  }
  const media = image?.data ?? image;
  if (!media || typeof media !== "object") {
    return { imageId: null, imageUrl: null, imageName: null };
  }
  const file = media.attributes ?? media;
  return {
    imageId: typeof media.id === "number" ? media.id : null,
    imageUrl: file.url ?? null,
    imageName: file.name ?? null,
  };
}

export function toTemplateLuminance(raw: RawLuminance): TemplateLuminance {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    ...readMedia(source.image),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readLuminanceRecord(
  body: { data?: RawLuminance } | RawLuminance,
): TemplateLuminance {
  const raw = "data" in body && body.data ? body.data : (body as RawLuminance);
  return toTemplateLuminance(raw);
}
