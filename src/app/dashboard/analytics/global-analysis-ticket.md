# TKT-2025-008: Global Analytics In-Depth Analysis - Data Exploration & Display Options

---

ID: TKT-2025-008
Status: Draft
Priority: Medium
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-ImproveAnalytics
Types: [Card, Widget, Data Analysis]

---

## Overview

Explore the Global Analytics endpoint data structure comprehensively and design a comprehensive in-depth analysis view for the `GlobalAnalyticsWidget.tsx` component. This ticket focuses on understanding what data is available from the `/orders/analytics/global-summary` endpoint and creating a rich, detailed analytics dashboard.

## What We Need to Do

1. Document all available data fields from the Global Analytics endpoint
2. Analyze the data structure and identify key insights
3. Design and implement a comprehensive data analysis view with multiple layout options
4. Create helper utilities for data processing and formatting

## Available Data from Endpoint

### Account Overview

- `totalAccounts`: Total number of accounts (Club + Association)
- `activeAccounts`: Number of currently active accounts
- `inactiveAccounts`: Number of inactive accounts
- `accountTypesDistribution`: Object with counts by account type (e.g., Club: 6, Association: 8)

### Subscription Analysis

- `subscriptionTierDistribution`:
  - `distribution`: Percentage breakdown by tier (e.g., Season Pass: 81.25%, 3 Month Pass: 18.75%)
  - `totalSubscriptions`: Total number of subscriptions
  - `averageSubscriptionValue`: Average value in cents

### Trial Conversion

- `trialConversionRates`:
  - `totalTrials`: Total number of trial instances
  - `convertedTrials`: Number of converted trials
  - `conversionRate`: Conversion percentage
  - `conversionByAccountType`: Conversion breakdown by account type

### Revenue Analysis

- `revenueTrends`:
  - `monthlyRevenue`: Object with monthly revenue data (e.g., "2025-10": 130000 in cents)
  - `quarterlyRevenue`: Object with quarterly revenue data
  - `totalRevenue`: Total revenue in cents
  - `averageMonthlyRevenue`: Average monthly revenue in cents
  - `growthRate`: Percentage growth
  - `trend`: "increasing" | "decreasing" | "stable"

### Churn Analysis

- `churnRates`:
  - `totalChurned`: Number of churned accounts
  - `churnRate`: Churn percentage
  - `churnByAccountType`: Churn breakdown by account type
  - `retentionRate`: Retention percentage

### Customer Value

- `averageCustomerLifetimeValue`: Average CLV in cents
- `medianCustomerLifetimeValue`: Median CLV in cents

### Sports Distribution

- `sportsDistribution`: Object showing sports breakdown (e.g., Cricket: 100%)

### Metadata

- `generatedAt`: ISO timestamp of when data was generated
- `dataPoints`:
  - `totalAccounts`: Account count for validation
  - `totalOrders`: Total order count
  - `subscriptionTiers`: Number of subscription tiers
  - `trialInstances`: Total trial instances

## Design & Layout

**Layout:** Main Content + Sidebar Layout

**Structure:**

- **Main Section (Center):**

  - Top: 4 key metric cards (accounts, revenue, conversion, retention)
  - Middle: Visualizations and detailed analysis (charts, trends, distributions)
  - Bottom: Key performance indicators

- **Sidebar (Right):**
  - Meta details and supplementary information
  - Quick stats
  - Data quality info
  - Additional context

**Benefits:**

1. Visualizations take center stage for better data comprehension
2. Meta details available without cluttering main view
3. Better use of screen space (especially on larger monitors)
4. Sidebar provides contextual information on demand
5. Maintains focus on key metrics while offering supplementary details

**Additional Features to Add:**

1. **Currency Formatting Utility:** `formatCurrency(cents)` helper
2. **Percentage Formatting:** `formatPercent(value)` helper
3. **Activity Rate Calculation:** Active accounts / Total accounts
4. **Per-Account Metrics:** Revenue per active account
5. **Latest Period Highlight:** Emphasize most recent month/quarter
6. **Visual Progress Bars:** For distribution percentages
7. **Color-Coded Trend Indicators:** Green for increasing, red for decreasing
8. **Data Quality Footer:** Show data points count and generation time

## Phases & Tasks

### Phase 1: Data Exploration and Documentation

- [x] Review endpoint data structure
- [x] Document all available fields
- [x] Create data flow diagram
- [x] Identify derived metrics to calculate

#### Derived Metrics to Calculate:

**Account Metrics:**

- Activity Rate: `(activeAccounts / totalAccounts) * 100`
- Inactivity Rate: `(inactiveAccounts / totalAccounts) * 100`

**Revenue Metrics:**

- Revenue per Active Account: `totalRevenue / activeAccounts` (if activeAccounts > 0)
- Latest Month Revenue: From `monthlyRevenue` object (last entry)
- Latest Quarter Revenue: From `quarterlyRevenue` object (last entry)
- Growth Trend Indicator: Based on `trend` field + `growthRate`

**Subscription Metrics:**

- Most Popular Tier: From `subscriptionTierDistribution.distribution` (highest percentage)
- Total Subscribers vs Accounts: `totalSubscriptions / totalAccounts`

**Trial Metrics:**

- Trial Non-Conversion Rate: `100 - conversionRate`
- Trials per Account Type: From `conversionByAccountType`

**Churn Metrics:**

- Worst Performing Account Type: From `churnByAccountType` (highest churn)
- Best Retaining Account Type: From `churnByAccountType` (lowest churn)

**Value Metrics:**

- CLV Ratio: `averageCustomerLifetimeValue / medianCustomerLifetimeValue`
- Revenue Distribution by Account Type: From account types and revenue data

#### Data Flow Diagram:

```
Backend API (/orders/analytics/global-summary)
    ↓
Server Service Layer (fetchGlobalAnalytics.ts)
    ↓ (raw API data in cents)
React Query Hook (useGlobalAnalytics.ts)
    ↓ (cached data in cents)
GlobalAnalyticsWidget Component
    ↓ (calculate derived metrics)
    ↓ (convert cents to dollars for display)
UI Display (formatted for users)
```

### Phase 2: Design and Layout Planning

- [x] Evaluate layout options
- [x] Create wireframe for recommended design
- [x] Plan responsive breakpoints
- [x] Define helper utilities needed

#### Wireframe Structure:

**Row 1: Key Metrics (4 cards)**

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│ Total Accounts│ Total Revenue │ Conversion    │ Retention     │
│     [value]   │     [value]   │    [value]%   │    [value]%   │
│  [active X]   │ [avg/mo $X]   │ [X converted] │ [X churned]   │
│ [activity %]  │[trend ↑↓→]    │ [X total]     │ [X rate]      │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

**Row 2: Distribution Analysis (2 columns)**

```
┌──────────────────────────────────┬──────────────────────────────────┐
│ Subscription Distribution        │ Account Types                    │
│ Total Subscriptions: [X]         │ Club: [X] ▓▓▓ 42.9%              │
│ Avg Value: $[X]                  │ Association: [X] ▓▓▓▓▓ 57.1%     │
│                                  │                                 │
│ Season Pass: ▓▓▓▓▓▓▓▓▓▓ 81.25%  │                                 │
│ 3 Month Pass: ▓▓▓ 18.75%        │                                 │
│ Free Trial: [0%]                │                                 │
└──────────────────────────────────┴──────────────────────────────────┘
```

**Row 3: Revenue Trends (full width)**

```
┌────────────────────────────────────────────────────────────────────┐
│ Revenue Trends                                                     │
│ ┌──────────────────────────┬────────────────────────────────┐     │
│ │ Monthly Revenue          │ Quarterly Revenue             │     │
│ │ 2025-10: $1,300          │ 2025-Q4: $1,300               │     │
│ │ 2025-09: $300            │ 2025-Q3: $300                 │     │
│ │ ...                      │ ...                           │     │
│ │ ┌────────────────────┐   │ ┌──────────────────────────┐ │     │
│ │ │ Latest: $1,300     │   │ │ Latest: $1,300          │ │     │
│ │ │ Oct 2025           │   │ │ Q4 2025                 │ │     │
│ │ └────────────────────┘   │ └──────────────────────────┘ │     │
│ └──────────────────────────┴────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────┘
```

**Row 4: Detailed Metrics (3 columns)**

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│ Customer Value       │ Sports Distribution  │ Churn by Type        │
│ Avg CLV: $[X]        │ Cricket: ▓▓▓▓▓ 100% │ Club: [X]%           │
│ Median CLV: $[X]     │                     │ Association: [X]%    │
│ Per Account: $[X]    │                     │                      │
└──────────────────────┴──────────────────────┴──────────────────────┘
```

**Footer: Data Quality Info**

```
┌────────────────────────────────────────────────────────────────────┐
│ [Accounts] [Orders] [Tiers] [Trials] | Generated: [timestamp]      │
└────────────────────────────────────────────────────────────────────┘
```

#### Responsive Breakpoints:

**Desktop (lg: 1024px+):**

- Row 1: 4 columns (grid-cols-4)
- Row 2: 2 columns (grid-cols-2)
- Row 3: 1 full column
- Row 4: 3 columns (grid-cols-3)

**Tablet (md: 768px-1023px):**

- Row 1: 2 columns (grid-cols-2)
- Row 2: 1 column (stacked)
- Row 3: 1 full column
- Row 4: 1 column (stacked)

**Mobile (< 768px):**

- All rows: 1 column (stacked)
- Cards maintain full width

#### Helper Utilities Needed:

**File:** `src/lib/utils/analytics.ts`

```typescript
// Currency formatting
export const formatCurrency = (cents: number): string => {
  return `$${(cents / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Percentage formatting
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Activity rate calculation
export const calculateActivityRate = (
  active: number,
  total: number
): number => {
  return total > 0 ? (active / total) * 100 : 0;
};

// Revenue per account
export const calculateRevenuePerAccount = (
  revenue: number,
  accounts: number
): number => {
  return accounts > 0 ? revenue / accounts : 0;
};

// Get latest entry from time series
export const getLatestEntry = (
  data: Record<string, number>
): [string, number] | null => {
  const entries = Object.entries(data);
  return entries.length > 0 ? entries[entries.length - 1] : null;
};

// Find highest value in distribution
export const getHighestDistribution = (
  distribution: Record<string, number>
): [string, number] | null => {
  const entries = Object.entries(distribution);
  if (entries.length === 0) return null;
  return entries.reduce((max, curr) => (curr[1] > max[1] ? curr : max));
};

// Get trend color class
export const getTrendColor = (
  trend: "increasing" | "decreasing" | "stable"
): string => {
  switch (trend) {
    case "increasing":
      return "text-green-600";
    case "decreasing":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
```

### Phase 3: Implementation

- [x] Create currency formatting utility
- [x] Create percentage formatting utility
- [x] Add derived metric calculations
- [x] Implement multi-section layout
- [x] Add visual progress bars
- [x] Implement color-coded trends
- [x] Add data quality footer
- [x] Apply consistent styling to match application UI

#### Implementation Summary:

**Helper Utilities Created** (`src/lib/utils/analytics.ts`):

- ✅ `formatCurrency()` - Convert cents to dollars with proper formatting
- ✅ `formatPercent()` - Format percentages with 1 decimal place
- ✅ `calculateActivityRate()` - Calculate active account percentage
- ✅ `calculateRevenuePerAccount()` - Calculate revenue per active account
- ✅ `getLatestEntry()` - Get most recent entry from time series data
- ✅ `getHighestDistribution()` - Find highest value in distribution object
- ✅ `getTrendColor()` - Get color class for trend indicators
- ✅ `getTrendIcon()` - Get icon for trend direction
- ✅ `formatDate()` - Format ISO timestamps for display

**Layout Implemented** (`GlobalAnalyticsWidget.tsx`):

- ✅ Row 1: 4 key metric cards (accounts, revenue, conversion, retention) with derived metrics
- ✅ Row 2: 2-column distribution analysis (subscription tiers, account types) with progress bars
- ✅ Row 3: Full-width revenue trends (monthly & quarterly) with latest highlights
- ✅ Row 4: 3-column detailed metrics (CLV, sports distribution, churn by type)
- ✅ Footer: Data quality information (accounts, orders, tiers, trials, generation time)

**Features Added**:

- ✅ Currency conversion from cents to dollars throughout
- ✅ Progress bars for visual distribution representation
- ✅ Color-coded trend indicators (green↑, red↓, gray→)
- ✅ Derived metrics calculated and displayed
- ✅ Responsive grid layouts (mobile, tablet, desktop)
- ✅ Scrollable revenue history (last 12 months/8 quarters)
- ✅ Latest period highlights in revenue section
- ✅ Consistent card styling matching FinancialOverview component
- ✅ Color scheme: blue (accounts), green (revenue), purple (conversion), emerald (retention)
- ✅ Enhanced typography with text-3xl for key metrics
- ✅ Unified card design with shadow-none, bg-slate-50, border-b-4 border-b-slate-500, rounded-md

### Phase 4: Testing and Refinement

- [ ] Test with real endpoint data
- [ ] Verify all metrics calculate correctly
- [ ] Test responsive behavior
- [ ] Cross-reference with Strapi CMS data
- [ ] Get user feedback on layout

## Constraints, Risks, Assumptions

- **Constraints:**
  - All currency values are in cents (need conversion)
  - Data structure is fixed by backend API
  - Must work with existing React Query hooks
- **Risks:**
  - Overwhelming users with too much data at once
  - Performance issues with large datasets
  - Inconsistent formatting across components
- **Assumptions:**
  - Backend data is reliable and accurate
  - All required data fields are present
  - Users understand cricket-focused context

## Success Criteria

- [ ] All available data from endpoint is displayed
- [ ] Currency values are properly formatted (cents to dollars)
- [ ] Layout is responsive and works on all screen sizes
- [ ] Visual hierarchy guides users through data
- [ ] Helper utilities are reusable across components
- [ ] Performance is acceptable with real data
- [ ] Code follows existing component patterns

## Future Enhancements

- Add export functionality (CSV, PDF)
- Add data comparison with previous periods
- Add interactive charts and graphs
- Add drill-down capabilities
- Add filtering and sorting options
- Add data refresh controls
