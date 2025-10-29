# Account Analytics Dashboard - Implementation Plan

## Overview

Transform the account analytics display from simple cards to a comprehensive, data-rich dashboard that provides actionable insights for managing club/association accounts. The goal is to create a visual overview that helps track season passes, subscription activity, financial performance, and account health.

## Data Available

Based on the `AccountAnalytics` type definition, we have access to:

### 1. **Account Overview**

- Account ID, type, sport
- Account creation date
- Account creation timestamp

### 2. **Order History**

- Total orders, paid orders count
- Total spent, average order value
- Full array of `OrderSummary[]` with details:
  - Order ID, date, amount, status
  - Subscription tier, payment method

### 3. **Subscription Timeline**

- Current subscription info (tier, dates, active status, auto-renew)
- Subscription history array `SubscriptionEvent[]`
  - Events: started, renewed, cancelled, upgraded, downgraded
  - With dates, tiers, and amounts
- Total subscriptions count
- Average subscription duration

### 4. **Trial Usage**

- Active trial status
- Trial instance details (start/end dates, days remaining)
- Trial history array `TrialEvent[]`
- Total trials count
- Trial conversion rate

### 5. **Payment Status**

- Success rate percentage
- Total, successful, failed payment counts
- Last payment date
- Average payment amount

### 6. **Renewal Patterns**

- Has renewed flag
- Renewal count
- Average renewal interval
- Last renewal date
- Next expected renewal
- Renewal consistency (consistent/irregular/unknown)

### 7. **Account Health Score**

- Overall score (0-100)
- Breakdown by category:
  - Account setup
  - Account activity
  - Payment success
  - Subscription continuity
  - Trial conversion
- Health level: excellent/good/fair/poor/critical

### 8. **Financial Summary**

- Total lifetime value
- Monthly recurring revenue
- Average monthly spend
- Payment method
- Billing cycle

### 9. **Usage Patterns**

- Order frequency (high/medium/low)
- Seasonal patterns array
- Peak usage months array
- Average days between orders

### 10. **Risk Indicators**

- Payment failures count
- Subscription cancellations count
- Long inactivity periods count
- Downgrade history count
- Risk level (low/medium/high)
- Risk factors array

## Current Implementation

Currently displays 6 basic cards:

- Total Orders
- Total Spent
- Trial Conversion Rate
- Payment Success Rate
- Account Health Score
- Total Subscriptions

## Proposed New Layout

### Section 1: **Financial Overview** (Grid/Tiles)

- Total Lifetime Value (prominent)
- Monthly Recurring Revenue
- Average Monthly Spend
- Last Payment Date & Amount
- Payment Method & Billing Cycle

### Section 2: **Subscription Status** (Detailed Card)

- Current subscription status (Active/Inactive/Trial)
- Subscription timeline visualization
- Next renewal date (countdown)
- Subscription history table
- Auto-renew status badge

### Section 3: **Order History** (Table)

- Full table of orders with:
  - Date
  - Amount
  - Status
  - Tier
  - Payment method
- Sortable and filterable
- Date range filtering

### Section 4: **Account Activity Timeline** (Visual Timeline)

- Chronological timeline showing:
  - Account creation
  - Subscription events (started/renewed/cancelled)
  - Trial events
  - Payment milestones
- Visual representation of account journey

### Section 5: **Trial Performance** (Stats + Conversion Rate)

- Active trial info (if applicable)
- Trial conversion rate visualization
- Trial history summary
- Days remaining (if active trial)

### Section 6: **Health & Risk Assessment** (Cards + Breakdown)

- Overall health score with breakdown
- Risk level indicator
- Risk factors list
- Key metrics affecting health score

### Section 7: **Usage Patterns** (Insights Panel)

- Order frequency indicator
- Peak usage months
- Seasonal patterns
- Average days between orders

## Implementation Approach

### Phase 1: Enhanced Financial Summary

**Components to create:**

1. `FinancialOverview.tsx` - Key financial metrics in prominent display
2. `SubscriptionStatusCard.tsx` - Current subscription status with timeline

### Phase 2: Historical Data Visualization

**Components to create:** 3. `OrderHistoryTable.tsx` - Sortable, filterable order history table 4. `AccountTimeline.tsx` - Visual timeline of account activity 5. `TrialPerformance.tsx` - Trial metrics and conversion tracking

### Phase 3: Health & Risk Analysis

**Components to create:** 6. `AccountHealthDashboard.tsx` - Health score with breakdown visualization 7. `RiskAssessment.tsx` - Risk level and factors display 8. `UsagePatterns.tsx` - Usage insights and patterns

### Phase 4: Integration & Polish

- Integrate all components into `AccountAnalyticsCards.tsx` or create new layout
- Add loading states for each section
- Ensure responsive design
- Add error boundaries

## Visual Design Principles

### Financial Data

- **Prominent**: Use large, readable numbers
- **Contextual**: Show comparisons (avg, trends)
- **Hierarchical**: Emphasize key metrics (LTV, MRR)

### Historical Data

- **Chronological**: Timeline/table view
- **Interactive**: Sortable, filterable tables
- **Actionable**: Highlight important events

### Status Indicators

- **Clear**: Visual badges for active/inactive/trial
- **Color-coded**: Green (good), Yellow (warning), Red (critical)
- **Detailed**: Show what makes up status

### Trend Analysis

- **Visual**: Charts for patterns
- **Insightful**: Explain what trends mean
- **Predictive**: Show expected behavior

## Technical Considerations

### Data Loading

- Consider lazy loading for heavy components
- Implement progressive rendering
- Cache data appropriately (already using React Query)

### Performance

- Virtualize long lists (order history)
- Memoize expensive calculations
- Lazy load timeline visualizations

### Responsive Design

- Stack vertically on mobile
- Horizontal scroll for tables if needed
- Collapsible sections for detailed views

## Success Metrics

1. **Completeness**: All major data points are visible
2. **Clarity**: Easy to understand account status at a glance
3. **Actionability**: Clear indication of what to do next
4. **Performance**: Fast loading and smooth interactions
5. **Usability**: Intuitive navigation between sections

## Next Steps

1. Review and approve this approach
2. Start with Phase 1 (Financial Summary + Subscription Status)
3. Iterate based on feedback
4. Progressively add more detailed views
5. Polish and optimize for production

---

**Note**: This ticket focuses on making the account analytics data accessible and actionable. The goal is to provide a comprehensive view that helps understand the account's complete journey, current status, and future health.
