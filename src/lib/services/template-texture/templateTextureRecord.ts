import { TemplateTexture } from "@/types/template-texture";

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

interface RawTexture {
  id: number;
  Name?: string;
  name?: string;
  category?: string;
  opacity?: number | string | null;
  blendMode?: string;
  texture?: number | RawMedia | null;
  publishedAt?: string | null;
  attributes?: Omit<RawTexture, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function numberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function readMedia(texture: RawTexture["texture"]): {
  textureId: number | null;
  textureUrl: string | null;
  textureName: string | null;
} {
  if (typeof texture === "number") {
    return { textureId: texture, textureUrl: null, textureName: null };
  }
  const media = texture?.data ?? texture;
  if (!media || typeof media !== "object") {
    return { textureId: null, textureUrl: null, textureName: null };
  }
  const file = media.attributes ?? media;
  return {
    textureId: typeof media.id === "number" ? media.id : null,
    textureUrl: file.url ?? null,
    textureName: file.name ?? null,
  };
}

export function toTemplateTexture(raw: RawTexture): TemplateTexture {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.Name ?? source.name),
    category: text(source.category),
    opacity: numberOrNull(source.opacity),
    blendMode: text(source.blendMode),
    ...readMedia(source.texture),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readTextureRecord(
  body: { data?: RawTexture } | RawTexture,
): TemplateTexture {
  const raw = "data" in body && body.data ? body.data : (body as RawTexture);
  return toTemplateTexture(raw);
}
