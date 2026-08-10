/**
 * Canonical LLM reference tokens for the layouts lab category.
 * Pattern: layout.{component}.{variant}
 */
export const LAYOUT_TOKENS = {
  grid: {
    responsive: "layout.grid.responsive",
    autoFit: "layout.grid.auto-fit",
    nested: "layout.grid.nested",
  },
  flex: {
    row: "layout.flex.row",
    column: "layout.flex.column",
    center: "layout.flex.center",
    between: "layout.flex.between",
    around: "layout.flex.around",
  },
  divider: {
    horizontal: "layout.divider.horizontal",
    withText: "layout.divider.with-text",
    vertical: "layout.divider.vertical",
  },
  spacing: {
    p0: "layout.spacing.p-0",
    p1: "layout.spacing.p-1",
    p2: "layout.spacing.p-2",
    p4: "layout.spacing.p-4",
    p6: "layout.spacing.p-6",
    p8: "layout.spacing.p-8",
    p12: "layout.spacing.p-12",
    p16: "layout.spacing.p-16",
  },
} as const;
