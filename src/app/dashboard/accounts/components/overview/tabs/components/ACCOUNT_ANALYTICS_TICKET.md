# Account Analytics Dashboard Implementation

## Ticket – TKT-2025-006

### Status

**In Progress** ⏳ - Planning and design phase

### Overview

Transform the account analytics display from simple metric cards into a comprehensive, data-rich dashboard that provides actionable insights for managing club/association accounts. The goal is to create a visual overview that helps track season passes, subscription activity, financial performance, and account health.

### What We Need to Do

Implement a multi-section analytics dashboard that provides:

- Financial overview with key metrics
- Current subscription status and timeline
- Historical order data in an interactive table
- Account activity timeline visualization
- Trial performance tracking
- Health score with detailed breakdown
- Risk assessment indicators
- Usage pattern insights

---

## Phase 1: Foundation Setup & Financial Overview ✅ COMPLETE

**Goal**: Display key financial metrics prominently and show current subscription status

### Tasks

- [x] Create `FinancialOverview.tsx` component

  - [x] Display Total Lifetime Value prominently
  - [x] Show Monthly Recurring Revenue (MRR)
  - [x] Display Average Monthly Spend
  - [x] Add Last Payment Date & Amount
  - [x] Show Payment Method & Billing Cycle
  - [x] Implement loading and error states
  - [x] Add responsive grid layout
  - [x] Fix cents to dollars conversion for all monetary values

- [x] Create `SubscriptionStatusCard.tsx` component

  - [x] Display current subscription status badge (Active/Inactive/Trial)
  - [x] Show subscription tier
  - [x] Display start/end dates with countdown
  - [x] Auto-renew indicator
  - [x] Add "Next renewal" date if applicable
  - [ ] Implement status color coding

- [ ] Update `AccountAnalyticsCards.tsx`
  - [ ] Replace simple cards with Financial Overview section
  - [ ] Replace subscription card with Subscription Status Card
  - [ ] Ensure proper integration
  - [ ] Add section headers

### Deliverables

- Financial metrics prominently displayed
- Current subscription status clearly visible
- Responsive design for all screen sizes
- Proper loading and error handling

---

## Phase 2: Historical Data & Activity Timeline ✅ COMPLETE

**Goal**: Provide comprehensive historical view of orders and account activity

### Tasks

- [x] Create `OrderHistoryTable.tsx` component

  - [x] Display full order history in sortable table
  - [x] Columns: Date, Amount, Status, Tier, Payment Method
  - [x] Add filtering by status
  - [x] Add sorting functionality
  - [x] Show total/filtered order count
  - [x] Fix cents to dollars conversion
  - [x] Add defensive checks for undefined data

- [x] Create `AccountTimeline.tsx` component

  - [x] Display chronological timeline of account events
  - [x] Show: Account creation, subscription events, trial events, payments
  - [x] Visual timeline with event markers
  - [x] Add event icons and badges
  - [x] Fix import errors

- [x] Create `SubscriptionHistory.tsx` component
  - [x] Display subscription timeline events
  - [x] Show: started, renewed, cancelled, upgraded, downgraded
  - [x] Display tier changes
  - [x] Add event filtering by action
  - [x] Fix undefined data access errors

### Deliverables

- Interactive, sortable order history table
- Visual account activity timeline
- Subscription history view
- All historical data accessible and navigable

---

## Phase 3: Trial Performance & Conversion Tracking ✅ COMPLETE

**Goal**: Provide insights into trial usage and conversion patterns

### Tasks

- [x] Create `TrialPerformancePanel.tsx` component

  - [x] Display active trial information (if applicable)
  - [x] Show trial countdown (days remaining)
  - [x] Display trial conversion rate visualization
  - [x] Show trial history summary
  - [x] Add conversion metrics display
  - [x] Implement loading and error states

- [x] Create `TrialHistory.tsx` component
  - [x] Display trial history table
  - [x] Show trial start/end dates
  - [x] Show conversion status
  - [x] Display subscription tier for converted trials
  - [x] Add trial duration metrics
  - [x] Add defensive checks for missing data

### Deliverables

- Complete trial performance overview
- Historical trial data accessible
- Conversion insights and recommendations
- Data-driven trial recommendations

---

## Phase 4: Health Score & Risk Assessment ✅ COMPLETE

**Goal**: Visualize account health with detailed breakdown and risk factors

### Tasks

- [x] Create `AccountHealthDashboard.tsx` component

  - [x] Display overall health score prominently
  - [x] Show health level badge (excellent/good/fair/poor/critical)
  - [x] Create breakdown visualization for health factors:
    - [x] Account setup score
    - [x] Account activity score
    - [x] Payment success score
    - [x] Subscription continuity score
    - [x] Trial conversion score
  - [x] Implement visual health meter with progress bars
  - [x] Add recommendations based on score
  - [x] Add health factor icons and descriptions

- [x] Create `RiskAssessment.tsx` component
  - [x] Display risk level (low/medium/high)
  - [x] Show risk factors list
  - [x] Detail each risk indicator:
    - [x] Payment failures count
    - [x] Subscription cancellations
    - [x] Long inactivity periods
    - [x] Downgrade history
  - [x] Add risk mitigation recommendations
  - [x] Color-code risk severity
  - [x] Add visual indicators and badges

### Deliverables

- Comprehensive health score visualization
- Detailed risk assessment display
- Actionable recommendations
- Visual indicators for quick assessment

---

## Phase 5: Usage Patterns & Insights ✅ COMPLETE

**Goal**: Provide insights into account usage behavior and patterns

### Tasks

- [x] Create `UsagePatterns.tsx` component

  - [x] Display order frequency (high/medium/low)
  - [x] Show seasonal patterns
  - [x] Display peak usage months
  - [x] Show average days between orders
  - [x] Add color-coded badges for frequency levels
  - [x] Format month labels for readability

- [x] Create `OrderFrequencyChart.tsx` component

  - [x] Chart showing order frequency over time
  - [x] Monthly breakdown with bar visualization
  - [x] Calculate and display trend percentage
  - [x] Highlight peak periods
  - [x] Show summary stats (total orders, active months, orders/month)

- [x] Create `RevenueTrendChart.tsx` component
  - [x] Display revenue trend over time
  - [x] Convert cents to dollars for display
  - [x] Identify growth/decline patterns with trend indicator
  - [x] Show summary stats (total revenue, average monthly, active months)
  - [x] Visual bar chart for monthly revenue

### Deliverables

- Usage pattern insights panel
- Visual representations of usage trends
- Revenue trend analysis
- Actionable insights based on patterns

---

## Phase 6: Seasonal Intelligence & Action-Driven Features

**Goal**: Provide actionable insights for seasonal renewals, retention management, and usage optimization for cricket clubs and associations

### Tasks

- [ ] Create `RenewalForecast.tsx` component

  - [ ] Calculate days until season ends (6-month window)
  - [ ] Estimate renewal likelihood based on usage patterns
  - [ ] Display next renewal date based on season calendar
  - [ ] Show proactive reminders for early renewal discounts
  - [ ] Flag accounts needing immediate outreach
  - [ ] Add "Renewal Probability Score" based on activity

- [ ] Create `UsageInsights.tsx` component

  - [ ] Track weekly render frequency trends
  - [ ] Identify accounts with declining engagement
  - [ ] Show credit usage vs. available credits
  - [ ] Highlight peak usage weeks during season
  - [ ] Detect inactivity (>3 weeks threshold
  - [ ] Recommend credit top-ups when nearing limits

- [ ] Add Quick Action Cards

  - [ ] "Send Renewal Reminder" action button
  - [ ] "Check Render Activity" status indicator
  - [ ] "View Credits Remaining" with warning states
  - [ ] "Recent Render Success Rate" metric
  - [ ] Add sticky action bar for key operations

- [ ] Create `SeasonalCalendar.tsx` component

  - [ ] Visual cricket season timeline
  - [ ] Mark trial periods, active season, renewal windows
  - [ ] Highlight key dates (pre-season prep, mid-season, post-season)
  - [ ] Show expected renewal dates based on season start
  - [ ] Compare account activity vs. seasonal norms

- [ ] Performance optimization

  - [ ] Implement React.memo for expensive components
  - [ ] Add virtualization for long order tables
  - [ ] Lazy load chart components
  - [ ] Cache seasonal calendar calculations
  - [ ] Optimize data aggregation logic

- [ ] Polish & Responsive Design

  - [ ] Ensure mobile-first layout works for admin dashboard
  - [ ] Test tablet view for team reviews
  - [ ] Desktop optimization for detailed analysis
  - [ ] Add print-friendly view for internal reports
  - [ ] Implement accessibility improvements (ARIA labels, keyboard nav)

### Deliverables

- Renewal forecasting with probability scores
- Usage engagement tracking and risk indicators
- Seasonal calendar visualization
- Quick action tools for retention management
- Optimized performance and responsive design
- Actionable insights aligned with cricket season cycle

---

## Phase 7: Testing & Quality Assurance

**Goal**: Ensure quality, reliability, and user experience

### Tasks

- [ ] Component testing

  - [ ] Test each component in isolation
  - [ ] Test data loading states
  - [ ] Test error states
  - [ ] Test edge cases (empty data, null values)

- [ ] Integration testing

  - [ ] Test component interactions
  - [ ] Test data flow between components
  - [ ] Test API integration
  - [ ] Test caching behavior

- [ ] User experience testing

  - [ ] Test with real account data
  - [ ] Verify all sections display correctly
  - [ ] Test responsive behavior
  - [ ] Verify performance on slow networks

- [ ] Browser compatibility testing

  - [ ] Chrome, Firefox, Safari, Edge
  - [ ] Test different versions
  - [ ] Verify polyfills where needed

- [ ] Performance testing
  - [ ] Test with large datasets
  - [ ] Verify rendering performance
  - [ ] Test memory usage
  - [ ] Optimize if needed

### Deliverables

- Fully tested implementation
- Bug-free experience
- Documented edge cases
- Performance benchmarks

---

## Constraints, Risks, Assumptions

### Constraints

- Must work with existing `AccountAnalytics` type structure
- Must maintain backward compatibility
- Must integrate with existing Overview tab layout
- Must follow existing UI component patterns
- Must use existing React Query hook

### Risks

- Large datasets may impact performance
- Complex timeline visualizations may be challenging
- Too much data could overwhelm users
- Multiple API calls may need coordination
- Table pagination with filters might be complex

### Assumptions

- API returns all expected fields populated
- Historical data is available for timeline
- Health score calculation is done server-side
- Usage pattern analysis is server-side
- Real-time updates are not required (cached data acceptable)

---

## Success Criteria

### Must Have

- All financial metrics clearly displayed
- Current subscription status visible
- Historical orders accessible
- Account health score visible
- Responsive design
- Error handling

### Nice to Have

- Interactive timeline
- Export functionality
- Charts and visualizations
- Trend analysis
- Recommendations engine
- Real-time updates

### Future Enhancements

- Compare accounts side-by-side
- Customizable dashboard layout
- Saved views/filters
- Scheduled reports
- Alerts and notifications
- Export to PDF/CSV

---

## Timeline Estimate

- **Phase 1**: 3-4 hours
- **Phase 2**: 4-6 hours
- **Phase 3**: 2-3 hours
- **Phase 4**: 3-4 hours
- **Phase 5**: 2-3 hours
- **Phase 6**: 4-5 hours
- **Phase 7**: 3-4 hours

**Total**: ~21-29 hours of development time

---

## Dependencies

### Technical

- React Query hooks already in place
- TypeScript types defined
- API endpoints ready
- UI component library available

### External

- Account analytics API
- Historical data availability
- Support for complex queries

---

## Notes

- Start with Phase 1 to establish pattern
- Iterate based on user feedback
- Prioritize data that's most actionable
- Keep performance in mind from the start
- Document component patterns for reuse
