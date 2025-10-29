# Tickets – Main Analytics Dashboard Improvements

This file contains tickets for improving the analytics dashboard to align with Fixtura's cricket-focused, season-based business model.

---

# Completed Tickets

_No tickets completed yet_

# See: `global-analysis-ticket.md` for TKT-2025-008

---

# TKT-2025-001: Fix Currency Conversion Issues

---

ID: TKT-2025-001
Status: In Progress
Priority: High
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card, Chart, Table]

---

## Overview

The backend API returns financial data in cents, which is the standard format. The analytics components should consistently work with cents and convert to dollars only for display purposes in the UI.

## What We Need to Do

Keep cents as the base currency throughout the data layer and only convert to dollars for display in components where needed.

## Affected Data Types

- **Card:** GlobalAnalyticsWidget (Total Revenue card)
- **Card:** SubscriptionTrendsWidget (all revenue metrics)
- **Card:** CohortRetentionWidget (cohort revenue card)
- **Chart:** RevenueChart (monthly revenue bars)
- **Misc:** All financial API responses need conversion

## Phases & Tasks

### Phase 1: Audit Current Components

- [ ] Review GlobalAnalyticsWidget.tsx for currency conversion issues
- [ ] Review RevenueChart.tsx for currency conversion issues
- [ ] Review SubscriptionTrendsWidget.tsx for currency display
- [ ] Check all hooks for currency handling

### Phase 2: Keep Cents as Base Currency in Service Layer

- [x] Keep `fetchGlobalAnalytics.ts` returning cents (no conversion)
- [x] Keep `fetchRevenueAnalytics.ts` returning cents (no conversion)
- [x] Keep `fetchSubscriptionTrends.ts` returning cents (no conversion)
- [x] Keep `fetchCohortAnalysis.ts` returning cents (no conversion)
- [x] Ensure components convert cents to dollars for display when needed

### Phase 3: Test and Verify

- [x] Test all analytics widgets display correct values
- [ ] Verify totals and averages are accurate
- [ ] Cross-reference with Strapi CMS order data

## Constraints, Risks, Assumptions

- **Constraints:** Must not break existing functionality
- **Risks:** Changing existing display logic may affect other components
- **Assumptions:** All backend data is in cents and needs conversion

---

# TKT-2025-002: Replace Monthly Revenue with Seasonal/Cricket Year Focus

---

ID: TKT-2025-002
Status: Draft
Priority: High
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Chart, Card]

---

## Overview

Fixtura operates on cricket seasons (annual, 6-month periods), not monthly subscriptions. The current `RevenueChart.tsx` displays monthly revenue trends, which is not relevant to Fixtura's business model.

## What We Need to Do

Replace monthly revenue aggregation with cricket season/year-based aggregation to align with Fixtura's annual "Season Pass" model.

## Affected Data Types

- **Chart:** RevenueChart.tsx (change from monthly bars to seasonal bars)
- **Chart:** Backend API time series data structure
- **Card:** GlobalAnalyticsWidget average revenue metrics
- **Misc:** All time-series aggregations need seasonal grouping

## Phases & Tasks

### Phase 1: Update Data Aggregation

- [ ] Modify `fetchRevenueAnalytics.ts` to group data by cricket season/year instead of month
- [ ] Update backend API calls to support seasonal data (if needed)
- [ ] Define cricket season boundaries (typically Oct-Mar and Apr-Sep in Australia)

### Phase 2: Update Components

- [ ] Rename `RevenueChart.tsx` to reflect seasonal focus
- [ ] Change display labels from "Monthly Revenue" to "Season Revenue"
- [ ] Update chart titles and descriptions
- [ ] Display "2023-24 Season" instead of "October 2023"

### Phase 3: Update Metrics

- [ ] Change `averageMonthlyRevenue` to `averageSeasonRevenue`
- [ ] Replace monthly trend calculations with seasonal trends
- [ ] Update all date ranges to use cricket years

## Constraints, Risks, Assumptions

- **Constraints:** Backend API may need updates to support seasonal grouping
- **Risks:** Changing aggregation logic may affect existing data
- **Assumptions:** Cricket seasons are defined consistently in the database

---

# TKT-2025-003: Simplify Subscription Metrics for Annual Model

---

ID: TKT-2025-003
Status: Draft
Priority: Medium
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card]

---

## Overview

`SubscriptionTrendsWidget.tsx` displays metrics like "Active Subscriptions", "Renewal Rate", and "Churn Rate" which are relevant to monthly SaaS models, not Fixtura's annual "Season Pass" model. These metrics need to be simplified.

## What We Need to Do

Replace generic subscription metrics with cricket-specific metrics:

- Season Passes Sold (instead of "Active Subscriptions")
- Season Renewal Rate (year-over-year)
- Season Pass Status (Active/Inactive)
- Accounts by Season

## Affected Data Types

- **Card:** SubscriptionTrendsWidget.tsx (all 6 metric cards)
- **Misc:** Subscription lifecycle data structure
- **Misc:** API response types need seasonal terminology

## Phases & Tasks

### Phase 1: Update Metrics

- [ ] Replace "Active Subscriptions" with "Active Season Passes"
- [ ] Update "Renewal Rate" to "Season Pass Renewal Rate"
- [ ] Simplify churn to focus on annual renewals only
- [ ] Remove monthly subscription trends

### Phase 2: Update Data Service

- [ ] Modify `fetchSubscriptionTrends.ts` to focus on season passes
- [ ] Group data by cricket seasons instead of calendar months
- [ ] Simplify renewal vs churn logic for annual model

### Phase 3: Update Component Display

- [ ] Update `SubscriptionTrendsWidget.tsx` to display season-specific metrics
- [ ] Add labels for "Current Season" and "Previous Season"
- [ ] Show season pass counts instead of subscription counts

## Constraints, Risks, Assumptions

- **Constraints:** Must maintain backward compatibility with existing data
- **Risks:** Simplification may lose some analytical depth
- **Assumptions:** All accounts renew annually (one season pass per year)

---

# TKT-2025-004: Remove SaaS-Specific Metrics from Analytics

---

ID: TKT-2025-004
Status: Draft
Priority: Medium
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card, Chart, Table]

---

## Overview

Several analytics widgets contain metrics that are not relevant to Fixtura's cricket club management platform, such as customer cohorts, engagement scores, and churn analysis designed for monthly SaaS businesses.

## What We Need to Do

Remove or replace irrelevant metrics with cricket-specific analytics that focus on:

- Total Season Passes Sold
- Revenue by Cricket Season
- Trial-to-Paid Conversion
- Accounts by Sport
- Season Pass Renewal Rate

## Affected Data Types

- **Card:** CohortRetentionWidget.tsx (cohort analysis cards)
- **Card:** GlobalAnalyticsWidget (churn metrics card)
- **Chart:** Customer lifetime value charts
- **Chart:** Monthly subscription trends
- **Table:** Cohort retention tables
- **Misc:** Engagement scoring algorithms

## Phases & Tasks

### Phase 1: Review and Identify Irrelevant Metrics

- [ ] Review `CohortRetentionWidget.tsx` for relevance
- [ ] Identify SaaS-specific metrics in all components
- [ ] List metrics that should be removed
- [ ] Define cricket-specific metrics to add

### Phase 2: Update or Remove Components

- [ ] Decide if `CohortRetentionWidget.tsx` should be removed or redesigned
- [ ] Remove "Monthly Subscription Trends" sections
- [ ] Remove "Customer Lifetime Value" (replace with "Season Pass Value")
- [ ] Remove churn analysis beyond annual renewals

### Phase 3: Add Cricket-Specific Metrics

- [ ] Add "Accounts by Sport" breakdown (cricket, netball, etc.)
- [ ] Add "Revenue by Cricket Season" chart
- [ ] Add "Season Pass Renewal Rate" metric
- [ ] Add "Total Season Passes Sold" counter

## Constraints, Risks, Assumptions

- **Constraints:** Some metrics may be used by other parts of the system
- **Risks:** Removing metrics may break dependencies
- **Assumptions:** Focus on metrics that add value to cricket club management

---

# TKT-2025-005: Standardize UI Styling Across Analytics Components

---

ID: TKT-2025-005
Status: Draft
Priority: Low
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card, Chart]

---

## Overview

The single account analytics implementation revealed inconsistent UI styling across components. The main analytics dashboard should use consistent card styling with emerald color scheme.

## What We Need to Do

Apply consistent styling to all analytics widgets following the pattern: `shadow-none bg-slate-50 border-b-4 border-b-slate-500` and use emerald icons (`text-emerald-500`).

## Affected Data Types

- **Card:** GlobalAnalyticsWidget.tsx (4 cards)
- **Card:** SubscriptionTrendsWidget.tsx (6 cards)
- **Card:** TrialConversionWidget.tsx (4 cards)
- **Card:** CohortRetentionWidget.tsx (5 cards)
- **Chart:** RevenueChart.tsx (chart card wrapper)
- **Misc:** All card borders, backgrounds, and icon colors

## Phases & Tasks

### Phase 1: Audit Current Styling

- [ ] Review all analytics widgets for consistency
- [ ] Identify styling inconsistencies
- [ ] Document current color schemes and borders

### Phase 2: Update Component Styling

- [ ] Apply `shadow-none bg-slate-50 border-b-4 border-b-slate-500` to all cards
- [ ] Replace icon colors with `text-emerald-500`
- [ ] Standardize card padding and spacing
- [ ] Ensure consistent typography

### Phase 3: Test and Refine

- [ ] Test all widgets display correctly
- [ ] Verify responsive behavior
- [ ] Ensure dark mode compatibility (if applicable)

## Constraints, Risks, Assumptions

- **Constraints:** Must maintain shadcn/ui compatibility
- **Risks:** Changing styles may affect other components
- **Assumptions:** Emerald color scheme works well for all contexts

---

# TKT-2025-006: Add FormatDate Utility for Consistent Date Display

---

ID: TKT-2025-006
Status: Draft
Priority: Low
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card, Chart, Misc]

---

## Overview

Dates are currently displayed inconsistently across analytics components. The single account analytics implementation uses `formatDate()` to display readable dates like "October 24, 2025" instead of "24/10/2025".

## What We Need to Do

Integrate or create a `formatDate()` utility and apply it consistently across all analytics date displays.

## Affected Data Types

- **Chart:** RevenueChart.tsx (month/season labels)
- **Card:** GlobalAnalyticsWidget (generatedAt timestamp)
- **Card:** SubscriptionTrendsWidget (date metadata)
- **Misc:** All API-generated timestamps

## Phases & Tasks

### Phase 1: Create or Find FormatDate Utility

- [ ] Check if `formatDate` utility already exists in codebase
- [ ] Create utility if it doesn't exist
- [ ] Place in shared utilities folder

### Phase 2: Apply to Analytics Components

- [ ] Update `RevenueChart.tsx` to use formatDate
- [ ] Update `SubscriptionTrendsWidget.tsx` for date formatting
- [ ] Update `TrialConversionWidget.tsx` for date formatting
- [ ] Update all other components that display dates

### Phase 3: Test Date Display

- [ ] Verify all dates are readable
- [ ] Test various date formats
- [ ] Ensure consistent formatting across dashboard

## Constraints, Risks, Assumptions

- **Constraints:** Must handle different date input formats
- **Risks:** Changing date format may confuse users
- **Assumptions:** Users prefer full date format over short format

---

# TKT-2025-007: Update Analytics Documentation and ReadMe

---

ID: TKT-2025-007
Status: Draft
Priority: Low
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Misc]

---

## Overview

Update the analytics folder documentation to reflect cricket-focused metrics and remove references to SaaS-style analytics.

## What We Need to Do

Update `readMe.md` to accurately describe cricket-specific analytics features and remove outdated references to monthly trends and churn analysis.

## Affected Data Types

- **Misc:** readMe.md documentation
- **Misc:** Component descriptions
- **Misc:** API endpoint documentation
- **Misc:** Type definitions documentation

## Phases & Tasks

### Phase 1: Review Current Documentation

- [ ] Read current `readMe.md` in analytics folder
- [ ] Identify outdated descriptions
- [ ] List what needs to be updated

### Phase 2: Update Documentation

- [ ] Replace SaaS terminology with cricket terminology
- [ ] Update component descriptions
- [ ] Update metrics descriptions
- [ ] Add notes about seasonal data aggregation

### Phase 3: Validate Documentation

- [ ] Ensure documentation matches code
- [ ] Cross-reference with updated components
- [ ] Update "Future Enhancements" section

## Constraints, Risks, Assumptions

- **Constraints:** Documentation should remain concise
- **Risks:** Outdated docs may mislead developers
- **Assumptions:** Future enhancements will remain cricket-focused

---

# Summaries of Completed Tickets

_No tickets completed yet_
