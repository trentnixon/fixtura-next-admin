/**
 * Canonical LLM reference tokens for the status lab category.
 * Pattern: status.{component}.{variant}
 */
export const STATUS_TOKENS = {
  statusBadge: {
    basic: "status.status-badge.basic",
    customLabels: "status.status-badge.custom-labels",
    variants: "status.status-badge.variants",
  },
  badge: {
    brand: "status.badge.brand",
    variants: "status.badge.variants",
    semantic: "status.badge.semantic",
    brandWithIcons: "status.badge.brand-with-icons",
    semanticWithIcons: "status.badge.semantic-with-icons",
    sizes: "status.badge.sizes",
  },
  indicator: {
    brandDots: "status.indicator.brand-dots",
    semanticDots: "status.indicator.semantic-dots",
    brandPulse: "status.indicator.brand-pulse",
    semanticPulse: "status.indicator.semantic-pulse",
    brandIcons: "status.indicator.brand-icons",
    semanticIcons: "status.indicator.semantic-icons",
  },
  avatar: {
    basic: "status.avatar.basic",
    sizes: "status.avatar.sizes",
    brandStatus: "status.avatar.brand-status",
    semanticStatus: "status.avatar.semantic-status",
  },
} as const;
