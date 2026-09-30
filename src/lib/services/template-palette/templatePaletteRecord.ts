import { TemplatePalette } from "@/types/template-palette";

interface RawPalette {
  id: number;
  name?: string;
  value?: string;
  publishedAt?: string | null;
  attributes?: Omit<RawPalette, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function toTemplatePalette(raw: RawPalette): TemplatePalette {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.name),
    value: text(source.value),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readPaletteRecord(
  body: { data?: RawPalette } | RawPalette,
): TemplatePalette {
  const raw = "data" in body && body.data ? body.data : (body as RawPalette);
  return toTemplatePalette(raw);
}
