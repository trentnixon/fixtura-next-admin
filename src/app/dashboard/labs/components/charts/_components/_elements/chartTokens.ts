/**
 * Canonical LLM reference tokens for the charts lab category.
 * Pattern: chart.{component}.{variant}
 */
export const CHART_TOKENS = {
  container: {
    basic: "chart.container.basic",
    customHeight: "chart.container.custom-height",
    elevated: "chart.container.elevated",
    config: "chart.container.config",
  },
  card: {
    basic: "chart.card.basic",
    withSummaryStats: "chart.card.with-summary-stats",
    emptyState: "chart.card.empty-state",
    elevated: "chart.card.elevated",
  },
  summaryStats: {
    cols2: "chart.summary-stats.cols-2",
    cols3: "chart.summary-stats.cols-3",
    cols4: "chart.summary-stats.cols-4",
    noBorder: "chart.summary-stats.no-border",
    noIcons: "chart.summary-stats.no-icons",
  },
  palette: {
    brandTheme: "chart.palette.brand-theme",
    primaryShades: "chart.palette.primary-shades",
    standard: "chart.palette.standard",
    multiSeries: "chart.palette.multi-series",
  },
  format: {
    duration: "chart.format.duration",
    memory: "chart.format.memory",
    number: "chart.format.number",
    date: "chart.format.date",
    currency: "chart.format.currency",
  },
  bar: {
    basic: "chart.bar.basic",
    customStyling: "chart.bar.custom-styling",
  },
  multiBar: {
    grouped: "chart.multi-bar.grouped",
  },
  line: {
    basic: "chart.line.basic",
  },
  multiLine: {
    series: "chart.multi-line.series",
  },
  stackedArea: {
    basic: "chart.stacked-area.basic",
  },
  pie: {
    basic: "chart.pie.basic",
    donut: "chart.pie.donut",
  },
  layout: {
    single: "chart.layout.single",
    grid2: "chart.layout.grid-2",
    grid3: "chart.layout.grid-3",
    responsive: "chart.layout.responsive",
  },
} as const;
