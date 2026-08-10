/**
 * Canonical LLM reference tokens for the cards lab category.
 * Pattern: card.{component}.{variant}
 */
export const CARD_TOKENS = {
  stat: {
    brandVariants: "card.stat.brand-variants",
    modernOverview: "card.stat.modern-overview",
    operations: "card.stat.operations",
    lightDark: "card.stat.light-dark",
    withTrend: "card.stat.with-trend",
    darkWithTrend: "card.stat.dark-with-trend",
  },
  metricGrid: {
    cols3: "card.metric-grid.cols-3",
    cols4: "card.metric-grid.cols-4",
    cols2Compact: "card.metric-grid.cols-2-compact",
  },
  base: {
    default: "card.base.default",
    withFooter: "card.base.with-footer",
    bordered: "card.base.bordered",
    background: "card.base.background",
    interactive: "card.base.interactive",
    compactKpi: "card.base.compact-kpi",
    operationalStatus: "card.base.operational-status",
    comparison: "card.base.comparison",
    activity: "card.base.activity",
  },
} as const;
