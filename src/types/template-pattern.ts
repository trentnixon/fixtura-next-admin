export const PROTECTED_TEMPLATE_PATTERN_ID = 1;

export const PATTERN_TYPES = [
  "Triangles",
  "lines",
  "grid",
  "dots",
  "Crosshatch",
  "Chevron",
] as const;

export const PATTERN_ANIMATIONS = [
  "none",
  "panDown",
  "panUp",
  "panRight",
  "panLeft",
  "rotate",
  "pulse",
] as const;

export type PatternType = (typeof PATTERN_TYPES)[number];
export type PatternAnimation = (typeof PATTERN_ANIMATIONS)[number];

export interface TemplatePattern {
  id: number;
  name: string;
  patternType: string;
  animation: string;
  scale: number | null;
  rotation: number | null;
  opacity: number | null;
  animationDuration: number | null;
  animationSpeed: number | null;
  publishedAt: string | null;
}

export interface TemplatePatternInput {
  name: string;
  patternType: PatternType;
  animation: PatternAnimation;
  scale: number | null;
  rotation: number | null;
  opacity: number | null;
  animationDuration: number | null;
  animationSpeed: number | null;
}

export interface TemplatePatternListResponse {
  data: TemplatePattern[];
}
