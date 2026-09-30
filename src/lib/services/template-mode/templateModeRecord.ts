import { TemplateMode } from "@/types/template-mode";

interface RawMode {
  id: number;
  Name?: string;
  name?: string;
  slug?: string;
  publishedAt?: string | null;
  attributes?: Omit<RawMode, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function toTemplateMode(raw: RawMode): TemplateMode {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.Name ?? source.name),
    slug: text(source.slug),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readModeRecord(body: { data?: RawMode } | RawMode): TemplateMode {
  const raw = "data" in body && body.data ? body.data : (body as RawMode);
  return toTemplateMode(raw);
}
