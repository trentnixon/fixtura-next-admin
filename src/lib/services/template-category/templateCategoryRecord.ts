import { TemplateCategory } from "@/types/template-category";

interface RawRelation {
  id?: number;
  Name?: string;
  name?: string;
  attributes?: RawRelation;
  data?: RawRelation | null;
}

interface RawCategory {
  id: number;
  Name?: string;
  name?: string;
  slug?: string;
  divideFixturesBy?: unknown;
  isPrivate?: boolean;
  bundle_audio?: number | RawRelation | null;
  publishedAt?: string | null;
  attributes?: Omit<RawCategory, "id" | "attributes">;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

export function parseOptionalJson(label: string, value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`${label} must be valid JSON`);
  }
}

export function jsonToEditorValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  return JSON.stringify(value, null, 2);
}

function readBundle(value: RawCategory["bundle_audio"]): {
  bundleAudioId: number | null;
  bundleAudioName: string;
} {
  if (typeof value === "number") return { bundleAudioId: value, bundleAudioName: "" };
  const relation = value?.data ?? value;
  if (!relation || typeof relation !== "object") {
    return { bundleAudioId: null, bundleAudioName: "" };
  }
  const source = relation.attributes ?? relation;
  return {
    bundleAudioId: typeof relation.id === "number" ? relation.id : null,
    bundleAudioName: text(source.Name ?? source.name),
  };
}

export function toTemplateCategory(raw: RawCategory): TemplateCategory {
  const source = raw.attributes ?? raw;
  return {
    id: raw.id,
    name: text(source.Name ?? source.name),
    slug: text(source.slug),
    divideFixturesBy: source.divideFixturesBy ?? null,
    isPrivate: Boolean(source.isPrivate),
    ...readBundle(source.bundle_audio),
    publishedAt: source.publishedAt ?? null,
  };
}

export function readCategoryRecord(body: { data?: RawCategory } | RawCategory): TemplateCategory {
  const raw = "data" in body && body.data ? body.data : (body as RawCategory);
  return toTemplateCategory(raw);
}
