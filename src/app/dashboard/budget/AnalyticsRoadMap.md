# Budget Analytics – Roadmap and Visualization Catalog

## Goals

- Provide actionable visibility into costs across renders, accounts, schedulers, and time periods.
- Enable drill-down from global → account → scheduler → render.
- Support trend analysis, anomaly detection, optimization insights, and budgeting forecasts.

---

## Data Sources (Available)

- Global
  - Summary: totals/averages, top accounts (period configurable)
  - Trends: daily/weekly/monthly series with summary (total, average, peak)
- Account
  - Current month rollup, specific month, monthly range, account summary (recent items, totals, monthly trend)
- Period
  - Daily, weekly, monthly rollups (global), ranges
- Render
  - Single render rollup, batch by IDs, by scheduler

---

## KPIs (Cards/Stats)

- Global
  - Total Cost, Total Lambda Cost, Total AI Cost
  - Total Renders, Total Accounts, Total Schedulers
  - Average Cost per Render, per Account, per Day
  - Cost Trend (up/down/stable), Percentage Change vs prior period
  - Peak Day/Week/Month and value
- Account
  - Account Total Cost (period/current month)
  - Average Cost per Render (account), Cost per Asset, Tokens
  - Renders in Period, Active Schedulers
  - Cost Share of Global (%)
- Render
  - Total Render Cost, Lambda vs AI breakdown
  - Average Cost per Asset, Tokens, Downloads
  - Processing Duration (efficiency), File Size Metrics

---

## Tables (Lists/Rankings)

- Top Accounts by:
  - Total Cost (period configurable)
  - Average Cost per Render
  - Render Count
  - Percentage of Global Total
- Recent Renders (global or filtered by account/scheduler):
  - Columns: Render ID, Name, Account, Scheduler, Completed At, Total Cost, Lambda Cost, AI Cost, Avg Cost/Asset, Duration
- Account Monthly Rollups (range):
  - Columns: Month, Total Cost, Renders, Avg Cost/Render, Trend vs previous
- Scheduler Renders:
  - Columns: Render ID, Completed At, Total Cost, Tokens, Duration
- Daily/Weekly/Monthly Period Tables:
  - Columns: Period, Total Cost, Renders, Avg Cost, Peak flags

---

## Charts (Trends/Distributions)

- Trend Lines / Area
  - Global Cost over Time (daily/weekly/monthly)
  - Account Monthly Cost (range)
  - Average Cost per Render over Time
- Stacked Bar / Area
  - Cost Breakdown over Time (Lambda vs AI)
  - Asset Type Cost Breakdown over Time (if available)
- Bar Charts
  - Top Accounts (Total Cost, Avg Cost/Render, Render Count)
  - Peak Periods (Top 10 days/weeks/months)
- Pie / Donut
  - Cost Composition (Lambda vs AI)
  - Account Share of Total (period)
- Scatter / Bubble (Advanced)
  - Render Duration vs Cost (by account/scheduler)
  - Tokens vs Cost (model breakdown)

---

## Drill-down Flows

- Global → Account → (Account Month → Account Summary) → Renders → Render Details
- Global Trend → Click data point → Period Rollup (day/week/month) → Accounts and Schedulers in that period
- Scheduler → Renders → Render Cost Breakdown → Downloads/Assets

---

## Insights & Analytics (Advanced)

- Anomaly detection:
  - Days/weeks/months with z-score thresholds on cost
  - Outlier renders (cost per asset/token vs norm)
- Cost drivers:
  - Model breakdown and token usage vs cost
  - Asset type contributions (articles, digital assets, downloads)
- Efficiency:
  - Processing duration vs cost (efficiency score)
  - Avg cost per asset vs file size metrics
- Forecasting (later):
  - Simple moving averages for next-period cost estimate
  - Seasonality by month/week

---

## Phased Implementation Plan

### Phase A – Foundations (UI & Controls)

- Add global Period selector (current-month, last-month, current-year, all-time)
- Add trend Granularity selector (daily, weekly, monthly)
- Wire real charts using existing `components/modules/charts/BarChartComponent` (or Recharts)

### Phase B – Global Analytics

- Global KPI cards (totals/averages)
- Global trends chart (stacked Lambda vs AI optional)
- Top accounts table + chart
- Peak period highlight

### Phase C – Account Analytics

- Account selector and widgets:
  - Current month KPIs (costs, renders, avg)
  - Monthly range table + trends chart
  - Account summary (recent renders/schedulers, totals, monthly trend)

### Phase D – Render & Scheduler Analytics

- Scheduler view: list of renders with key metrics
- Render detail panel:
  - Cost breakdown (Lambda vs AI, model breakdown)
  - Efficiency (duration, assets, tokens)
  - Downloads summary

### Phase E – Period Analytics

- Daily/Weekly/Monthly pages:
  - Tables: per-period totals and averages
  - Account breakdown within period
  - Insights (peak periods, anomalies)

### Phase F – Advanced & Insights

- Anomaly detection flagging
- Cost driver analysis (tokens/models/assets)
- Forecasting (basic SMA) and budget projection widgets

---

## Tech Notes

- Keep all requests behind hooks; reuse query keys to leverage caching
- For large tables/lists, use virtualization
- Ensure number formatting, locales, and currency handling are consistent
- Guard all numeric formatting (avoid toFixed on undefined)
- Use graceful fallbacks for 404 endpoints during rollout

---

## Acceptance Criteria (Milestones)

- A: Period/Granularity controls sync Summary/Trends/Top Accounts
- B: Real chart renders trends; Top accounts list sortable
- C: Account widgets functional with range and current month
- D: Render breakdown view available from tables
- E: Period pages usable for daily/weekly/monthly
- F: At least one advanced insight (anomaly or efficiency) live
