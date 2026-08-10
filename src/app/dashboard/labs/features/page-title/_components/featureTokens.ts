/**
 * Canonical LLM reference tokens for feature lab prototypes.
 * Pattern: feature.{feature}.{variant}
 */
export const FEATURE_TOKENS = {
  pageTitle: {
    standard: "feature.page-title.standard",
    minimal: "feature.page-title.minimal",
    bylineTopOnly: "feature.page-title.byline-top-only",
    withImage: "feature.page-title.with-image",
    withActions: "feature.page-title.with-actions",
    loading: "feature.page-title.loading",
    composed: "feature.page-title.composed",
    titleOnly: "feature.page-title.title-only",
    withSection: "feature.page-title.with-section",
  },
} as const;
