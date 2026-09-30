import { TemplateImage } from "@/types/template-image";

interface RawImage {
  id: number;
  name?: string;
  animationType?: string;
  animationDirection?: string;
  overlayStyle?: string;
  gradientType?: string;
  overlayOpacity?: number | string | null;
  publishedAt?: string | null;
  attributes?: Omit<RawImage, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function opacity(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function toTemplateImage(raw: RawImage): TemplateImage {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    animationType: text(source.animationType),
    animationDirection: text(source.animationDirection),
    overlayStyle: text(source.overlayStyle),
    gradientType: text(source.gradientType),
    overlayOpacity: opacity(source.overlayOpacity),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readImageRecord(body: { data?: RawImage } | RawImage): TemplateImage {
  const raw = "data" in body && body.data ? body.data : (body as RawImage);
  return toTemplateImage(raw);
}
