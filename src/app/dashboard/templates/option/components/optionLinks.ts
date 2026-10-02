import { TemplateOptionLinkKey } from "@/types/template-option";

export const STRUCTURE_LINK_KEYS = [
  "template_category",
  "template_mode",
  "template_palette",
] as const satisfies readonly TemplateOptionLinkKey[];

export function activeBackgroundLink(background: string): TemplateOptionLinkKey | null {
  if (background === "Gradient") return "template_gradient";
  if (background === "Video") return "template_video";
  if (background === "Image") return "template_image";
  if (background === "Texture") return "template_texture";
  if (background === "Animated") return "template_animation";
  if (background === "Luminance") return "template_luminance";
  if (background === "Graphics" || background === "Particle") return "template_particle";
  return null;
}
