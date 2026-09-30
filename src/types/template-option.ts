export const USE_BACKGROUNDS = [
  "Solid",
  "Gradient",
  "Video",
  "Image",
  "Texture",
  "Animated",
  "Luminance",
] as const;

export const LEGACY_USE_BACKGROUNDS = ["Graphics", "Particle"] as const;

export const TEMPLATE_OPTION_LINK_KEYS = [
  "template_category",
  "template_mode",
  "template_palette",
  "template_gradient",
  "template_image",
  "template_video",
  "template_texture",
  "template_animation",
  "template_luminance",
  "template_noise",
  "template_particle",
  "template_pattern",
] as const;

export type UseBackground = (typeof USE_BACKGROUNDS)[number];
export type TemplateOptionLinkKey = (typeof TEMPLATE_OPTION_LINK_KEYS)[number];

export const TEMPLATE_OPTION_LINK_LABELS: Record<TemplateOptionLinkKey, string> = {
  template_category: "Category",
  template_mode: "Mode",
  template_palette: "Palette",
  template_gradient: "Gradient",
  template_image: "Image",
  template_video: "Video",
  template_texture: "Texture",
  template_animation: "Animation",
  template_luminance: "Luminance",
  template_noise: "Noise",
  template_particle: "Particle",
  template_pattern: "Pattern",
};

export interface TemplateOptionLink {
  id: number | null;
  name: string;
}

export type TemplateOptionLinks = Record<TemplateOptionLinkKey, TemplateOptionLink>;

export interface TemplateOption {
  id: number;
  useBackground: string;
  publishedAt: string | null;
  accountId: number | null;
  accountName: string;
  links: TemplateOptionLinks;
}

export interface TemplateOptionInput {
  useBackground: UseBackground | (typeof LEGACY_USE_BACKGROUNDS)[number];
  links: Record<TemplateOptionLinkKey, number | null>;
}

export interface TemplateOptionListResponse {
  data: TemplateOption[];
  total: number;
}

export function emptyTemplateOptionLinks(): TemplateOptionLinks {
  return TEMPLATE_OPTION_LINK_KEYS.reduce((links, key) => {
    links[key] = { id: null, name: "" };
    return links;
  }, {} as TemplateOptionLinks);
}
