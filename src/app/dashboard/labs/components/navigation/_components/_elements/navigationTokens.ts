/**
 * Canonical LLM reference tokens for the navigation lab category.
 * Pattern: navigation.{component}.{variant}
 */
export const NAVIGATION_TOKENS = {
  pattern: {
    breadcrumbHeader: "navigation.pattern.breadcrumb-header",
    sectionTabs: "navigation.pattern.section-tabs",
    sideNav: "navigation.pattern.side-nav",
    workflowSteps: "navigation.pattern.workflow-steps",
  },
  tabs: {
    variants: "navigation.tabs.variants",
    basic: "navigation.tabs.basic",
    icons: "navigation.tabs.icons",
    styles: "navigation.tabs.styles",
  },
  pagination: {
    variants: "navigation.pagination.variants",
    basic: "navigation.pagination.basic",
    compact: "navigation.pagination.compact",
    withInfo: "navigation.pagination.with-info",
  },
} as const;
