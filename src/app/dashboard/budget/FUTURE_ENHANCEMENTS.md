# Future Enhancements - Budget Analytics

**Date Created**: November 16, 2025
**Status**: Backlog / Future Consideration

---

## Advanced Filtering (Phase 2.3) ⏳

**Priority**: Medium
**Effort**: ~2-3 hours
**Status**: Documented for future implementation

### Overview
Enhance the budget dashboard with advanced filtering capabilities to allow users to drill down into specific data subsets and perform more targeted analysis.

### Features to Implement

#### 1. Custom Date Range Picker
- **Current**: Preset periods only (current-month, last-month, current-year, all-time)
- **Enhancement**: Allow users to select any custom date range
- **Use Case**: Analyze specific time periods (e.g., "Jan 15 - Feb 20, 2025")
- **Implementation**:
  - Add date input fields (start date, end date)
  - Replace or supplement the current period selector
  - Validate date ranges (start < end, not in future, etc.)
  - Apply to all dashboard components

#### 2. Account Multi-Select Filter
- **Current**: No account filtering
- **Enhancement**: Filter dashboard data by one or multiple accounts
- **Use Case**: Compare costs across specific accounts or analyze a subset
- **Implementation**:
  - Multi-select dropdown with account list
  - Fetch accounts from API or use existing account data
  - Show selected account count badge
  - Filter all components (charts, tables, summaries) by selected accounts

#### 3. Scheduler Filter
- **Current**: No scheduler filtering
- **Enhancement**: Filter by specific scheduler(s)
- **Use Case**: Analyze costs for specific schedulers
- **Implementation**:
  - Multi-select dropdown with scheduler list
  - Filter components that show scheduler-specific data
  - Useful for scheduler cost analysis

#### 4. Cost Threshold Filters
- **Current**: No cost-based filtering
- **Enhancement**: Filter periods/renders by cost thresholds
- **Use Cases**:
  - "Show only periods with cost > $1000"
  - "Show only renders with cost < $50"
  - "Show periods with cost between $500-$2000"
- **Implementation**:
  - Min/Max cost input fields
  - Apply to relevant components (tables, charts)
  - Highlight filtered results

#### 5. Combined Filters
- **Enhancement**: Apply multiple filters simultaneously
- **Example**: "Show accounts 1, 2, 3 from Jan 1-15 with cost > $500"
- **Implementation**:
  - Filter state management
  - Combine all filter types
  - Show active filter badges
  - Clear/reset all filters button

### UI/UX Considerations

#### Filter Panel Design
- Collapsible filter section at top of dashboard
- Visual filter badges showing active filters
- "Clear All" button when filters are active
- Filter count indicator
- Responsive design for mobile

#### Filter State Management
- Centralized filter state in BudgetPage component
- Pass filters down to all child components
- Update URL query parameters for shareable filtered views
- Persist filters in localStorage (optional)

#### Component Integration
- Update all components to accept and apply filters:
  - `PeriodTrendsChart` - filter by date range, accounts
  - `TopAccountsList` - filter by date range, cost threshold
  - `GlobalCostSummary` - filter by date range, accounts
  - `SchedulerCostTable` - filter by scheduler, cost threshold
  - `PeriodTable` - filter by date range, accounts, cost threshold
  - All other relevant components

### Technical Implementation Notes

#### Date Range Picker
- Use existing `DateRangeInputs` component pattern from orders section
- Or use a date picker library (react-datepicker, etc.)
- Validate date ranges
- Handle timezone considerations

#### Account Multi-Select
- Fetch accounts list (may need new API endpoint or use existing)
- Use multi-select component (shadcn/ui Select with multiple, or custom)
- Store selected account IDs in filter state

#### Scheduler Multi-Select
- Similar to account multi-select
- May need scheduler list endpoint

#### Cost Threshold
- Simple number inputs for min/max
- Validate numeric inputs
- Apply to cost fields in data

#### Filter State Structure
```typescript
interface BudgetFilters {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  accountIds?: number[];
  schedulerIds?: number[];
  costThreshold?: {
    min?: number;
    max?: number;
  };
}
```

### Dependencies
- May need new API endpoints for:
  - Account list (if not already available)
  - Scheduler list (if not already available)
- Date picker component/library
- Multi-select component

### Testing Considerations
- Test filter combinations
- Test filter clearing/resetting
- Test with empty results
- Test URL parameter persistence
- Test mobile responsiveness

---

## Related Features
- See `NEXT_PHASE.md` for other planned enhancements
- See `AnalyticsRoadMap.md` for analytics feature ideas
- See `BUILDABLE_NOW.md` for completed features

---

**Next Steps When Ready**:
1. Review and prioritize filter features
2. Design filter UI/UX
3. Implement filter state management
4. Update components to accept filters
5. Add filter UI components
6. Test and refine

