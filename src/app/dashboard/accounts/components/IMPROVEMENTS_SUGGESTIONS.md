# Account Table & Dashboard Improvements

## 📊 Table Enhancements

### 1. Subscription Status Badges

**Priority: High**

- Replace text with color-coded badges:
  - 🟢 Active (green) - `hasActiveOrder === true`
  - 🟡 Expiring Soon (yellow) - `daysLeftOnSubscription < 30`
  - 🔴 Expired/Inactive (red) - `hasActiveOrder === false`
- Add tooltip showing exact days remaining

### 2. Expiring Soon Alert

**Priority: High**

- Add visual indicator (badge/icon) for accounts expiring in <30 days
- Could be a small warning icon next to subscription status
- Consider highlighting entire row with subtle background color

---

## 📈 Stats Cards (Add Above Table)

### Implementation Location

Add to `ClubsTable.tsx` and `AssociationsTable.tsx` before the tabs section.

### Cards to Add:

#### 1. Subscription Overview Card

```typescript
- Total Accounts: {total}
- Active Subscriptions: {activeCount} ({percentage}%)
- Inactive Subscriptions: {inactiveCount} ({percentage}%)
- Icon: CreditCard or TrendingUp
```

#### 2. Expiring Soon Card

```typescript
- Expiring in 30 days: {count}
- Expiring in 60 days: {count}
- Expiring in 90 days: {count}
- Icon: AlertTriangle or Clock
- Color: Warning (yellow/orange)
```

#### 3. Accounts by Sport Card

```typescript
- Cricket: {count}
- AFL: {count}
- Netball: {count}
- Hockey: {count}
- Basketball: {count}
- Icon: Trophy
```

#### 4. Setup Status Card

```typescript
- Setup Complete: {count} ({percentage}%)
- Not Setup: {count} ({percentage}%)
- Icon: CheckCircle or Settings
```

---

## 📊 Charts & Visualizations

### 1. Subscription Status Distribution (Pie Chart)

**Location:** Add above or below the table
**Data:** Active vs Inactive subscriptions
**Use Case:** Quick visual overview of subscription health

### 2. Accounts by Sport (Bar Chart)

**Location:** Stats section
**Data:** Count of accounts per sport
**Use Case:** See which sports have most accounts

### 3. Subscription Expiration Timeline (Bar Chart)

**Location:** Stats section
**Data:**

- Expiring in 0-30 days
- Expiring in 31-60 days
- Expiring in 61-90 days
- Expiring in 90+ days
- No subscription
  **Use Case:** Identify upcoming renewals/churn risk

### 4. Days Remaining Distribution (Histogram)

**Location:** Analytics section
**Data:** Distribution of `daysLeftOnSubscription` values
**Use Case:** Understand subscription lifecycle patterns

### 5. Account Type Comparison (Grouped Bar Chart)

**Location:** Stats section
**Data:**

- Clubs: Active vs Inactive
- Associations: Active vs Inactive
  **Use Case:** Compare subscription health between account types

### 6. Logo Coverage Chart

**Location:** Stats section
**Data:** Accounts with logos vs without logos
**Use Case:** Track account completeness

---

## 🎨 UI/UX Improvements

### 1. Empty States

- More helpful messages
- Action buttons (e.g., "Create New Account")
- Illustrations/icons

### 2. Loading States

- Skeleton loaders for table rows
- Shimmer effect on cards
- Progress indicators

### 3. Responsive Design

- Mobile-friendly table (card view on small screens)
- Collapsible filters on mobile
- Horizontal scroll with sticky columns on tablet

### 4. Search Enhancements

- Search suggestions/autocomplete
- Recent searches
- Saved filter presets
- Clear all filters button

### 5. Pagination Improvements

- Jump to page input
- Items per page selector (10, 25, 50, 100)
- Show total count more prominently

---

## 🔧 Technical Implementation Notes

### Data Processing

All stats can be calculated from the existing `useAccountsQuery` hook data:

- No additional API calls needed
- Use `useMemo` for performance
- Calculate stats from `active` and `inactive` arrays

### Chart Library

- Use existing `recharts` library
- Follow patterns from `TestCharts.tsx`
- Use `ChartContainer` from `@/components/ui/chart`

### Component Structure

```
ClubsTable.tsx
├── StatsCards (new)
│   ├── SubscriptionOverviewCard
│   ├── ExpiringSoonCard
│   ├── AccountsBySportCard
│   └── SetupStatusCard
├── Charts (new)
│   ├── SubscriptionStatusPieChart
│   ├── AccountsBySportBarChart
│   └── ExpirationTimelineChart
└── AccountTable (existing)
    └── [enhanced with badges, bulk actions, etc.]
```

---

## 📋 Implementation Priority

### Phase 1 (Quick Wins - High Impact)

1. ✅ Subscription status badges
2. ✅ Expiring soon indicator
3. ✅ Stats cards (4 cards above table)
4. ✅ Subscription status pie chart

### Phase 2 (Medium Priority)

1. Export to CSV
2. Row actions menu
3. Accounts by sport bar chart
4. Expiration timeline chart

### Phase 3 (Nice to Have)

1. Bulk actions
2. Column visibility toggle
3. Days remaining histogram
4. Logo coverage chart

---

## 💡 Additional Ideas

### Advanced Features

- **Email Campaigns**: Send emails to filtered accounts
- **Subscription Renewal Reminders**: Automated alerts
- **Account Health Score**: Composite metric based on multiple factors
- **Comparison View**: Compare two accounts side-by-side
- **Activity Timeline**: Show account activity history
- **Notes/Comments**: Add notes to accounts
- **Tags/Labels**: Categorize accounts with custom tags

### Analytics Dashboard

- **Trend Analysis**: Subscription trends over time (requires historical data)
- **Churn Prediction**: Identify at-risk accounts
- **Engagement Metrics**: Track account activity levels
- **Revenue Metrics**: If subscription pricing data available
