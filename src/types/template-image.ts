export const PROTECTED_TEMPLATE_IMAGE_ID = 1;

export const IMAGE_ANIMATION_TYPES = [
  "none",
  "zoom",
  "pan",
  "kenburns",
  "breathing",
  "focusblur",
] as const;

export const IMAGE_ANIMATION_DIRECTIONS = [
  "up",
  "down",
  "left",
  "right",
  "in",
  "out",
  "pulse",
] as const;

export const IMAGE_OVERLAY_STYLES = [
  "none",
  "solid",
  "gradient",
  "vignette",
  "duotone",
  "pattern",
  "colorFilter",
] as const;

export const IMAGE_GRADIENT_TYPES = ["linear", "radial"] as const;

export type ImageAnimationType = (typeof IMAGE_ANIMATION_TYPES)[number];
export type ImageAnimationDirection = (typeof IMAGE_ANIMATION_DIRECTIONS)[number];
export type ImageOverlayStyle = (typeof IMAGE_OVERLAY_STYLES)[number];
export type ImageGradientType = (typeof IMAGE_GRADIENT_TYPES)[number];

export interface TemplateImage {
  id: number;
  name: string;
  animationType: string;
  animationDirection: string;
  overlayStyle: string;
  gradientType: string;
  overlayOpacity: number | null;
  publishedAt: string | null;
}

export interface TemplateImageInput {
  name: string;
  animationType: ImageAnimationType;
  animationDirection: ImageAnimationDirection;
  overlayStyle: ImageOverlayStyle;
  gradientType: ImageGradientType;
  overlayOpacity: number | null;
}

export interface TemplateImageListResponse {
  data: TemplateImage[];
}
