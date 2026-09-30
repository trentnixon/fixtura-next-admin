export const PROTECTED_TEMPLATE_PARTICLE_ID = 1;

export const PARTICLE_TYPES = ["lines", "dots", "bubbles", "snow", "confetti"] as const;
export const PARTICLE_DIRECTIONS = ["up", "down", "left", "right", "random"] as const;
export const PARTICLE_ANIMATION_TYPES = ["scale", "fade", "slide", "none"] as const;

export type ParticleType = (typeof PARTICLE_TYPES)[number];
export type ParticleDirection = (typeof PARTICLE_DIRECTIONS)[number];
export type ParticleAnimationType = (typeof PARTICLE_ANIMATION_TYPES)[number];

export interface TemplateParticle {
  id: number;
  name: string;
  particleType: string;
  particleCount: number | null;
  speed: number | null;
  direction: string;
  animationType: string;
  publishedAt: string | null;
}

export interface TemplateParticleInput {
  name: string;
  particleType: ParticleType;
  particleCount: number | null;
  speed: number | null;
  direction: ParticleDirection;
  animationType: ParticleAnimationType;
}

export interface TemplateParticleListResponse {
  data: TemplateParticle[];
}
