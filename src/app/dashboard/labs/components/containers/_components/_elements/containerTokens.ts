/**
 * Canonical LLM reference tokens for the containers lab category.
 * Pattern: container.{component}.{variant}
 */
export const CONTAINER_TOKENS = {
  pattern: {
    dataWorkspace: "container.pattern.data-workspace",
    formWorkspace: "container.pattern.form-workspace",
    recordPanel: "container.pattern.record-panel",
  },
  page: {
    default: "container.page.default",
    compact: "container.page.compact",
  },
  section: {
    default: "container.section.default",
    compact: "container.section.compact",
  },
  element: {
    lightBorder: "container.element.light.border",
    darkBorder: "container.element.dark.border",
    lightNoBorder: "container.element.light.no-border",
    lightPaddingLg: "container.element.light.padding-lg",
  },
  hierarchy: {
    standard: "container.hierarchy.standard",
  },
} as const;
