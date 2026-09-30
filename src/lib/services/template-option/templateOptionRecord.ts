import {
  emptyTemplateOptionLinks,
  TemplateOption,
  TemplateOptionLinkKey,
  TEMPLATE_OPTION_LINK_KEYS,
} from "@/types/template-option";

interface RawRelation {
  id?: number;
  Name?: string;
  name?: string;
  FirstName?: string;
  LastName?: string;
  attributes?: RawRelation;
  data?: RawRelation | null;
}

interface RawOption {
  id: number;
  useBackground?: string;
  publishedAt?: string | null;
  account?: number | RawRelation | null;
  attributes?: Omit<RawOption, "id" | "attributes">;
  template_category?: number | RawRelation | null;
  template_mode?: number | RawRelation | null;
  template_palette?: number | RawRelation | null;
  template_gradient?: number | RawRelation | null;
  template_image?: number | RawRelation | null;
  template_video?: number | RawRelation | null;
  template_texture?: number | RawRelation | null;
  template_animation?: number | RawRelation | null;
  template_luminance?: number | RawRelation | null;
  template_noise?: number | RawRelation | null;
  template_particle?: number | RawRelation | null;
  template_pattern?: number | RawRelation | null;
}

function text(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value);
}

function unwrap(value: number | RawRelation | null | undefined): RawRelation | number | null {
  if (typeof value === "number" || value === null || value === undefined) return value ?? null;
  return value.data ?? value;
}

function readLink(value: number | RawRelation | null | undefined): { id: number | null; name: string } {
  const relation = unwrap(value);
  if (typeof relation === "number") return { id: relation, name: "" };
  if (!relation || typeof relation !== "object") return { id: null, name: "" };
  const source = relation.attributes ?? relation;
  return {
    id: typeof relation.id === "number" ? relation.id : null,
    name: text(source.Name ?? source.name),
  };
}

function readAccount(value: RawOption["account"]): { accountId: number | null; accountName: string } {
  const relation = unwrap(value);
  if (typeof relation === "number") return { accountId: relation, accountName: "" };
  if (!relation || typeof relation !== "object") return { accountId: null, accountName: "" };
  const source = relation.attributes ?? relation;
  const name = [source.FirstName, source.LastName].filter(Boolean).join(" ");
  return {
    accountId: typeof relation.id === "number" ? relation.id : null,
    accountName: name,
  };
}

export function toTemplateOption(raw: RawOption): TemplateOption {
  const source = raw.attributes ?? raw;
  const links = emptyTemplateOptionLinks();
  for (const key of TEMPLATE_OPTION_LINK_KEYS) {
    links[key as TemplateOptionLinkKey] = readLink(source[key]);
  }
  return {
    id: raw.id,
    useBackground: text(source.useBackground),
    publishedAt: source.publishedAt ?? null,
    ...readAccount(source.account),
    links,
  };
}

export function readOptionRecord(body: { data?: RawOption } | RawOption): TemplateOption {
  const raw = "data" in body && body.data ? body.data : (body as RawOption);
  return toTemplateOption(raw);
}
