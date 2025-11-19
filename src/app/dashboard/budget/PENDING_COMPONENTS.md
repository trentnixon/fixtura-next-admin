# Pending Components - To Be Completed

This document tracks components that have been removed from the main budget page and need to be integrated into dedicated pages with proper ID-based navigation.

**Last Updated**: 2025-11-16

---

## ✅ Components Already Updated

These components have been updated to accept IDs as props and are ready for use:

1. **AccountCostWidget** ✅
   - **Status**: Updated to accept `accountId` prop
   - **Location**: Used on `/dashboard/budget/account/[accountId]` page
   - **Removed from**: Main budget page

2. **AccountMonthlyTrendChart** ✅
   - **Status**: Updated to accept `accountId` prop
   - **Location**: Used on `/dashboard/budget/account/[accountId]` page
   - **Removed from**: Main budget page

3. **AccountSummary** ✅
   - **Status**: Updated to accept `accountId` prop
   - **Location**: Used on `/dashboard/budget/account/[accountId]` page
   - **Removed from**: Main budget page

4. **RenderCostBreakdown** ✅
   - **Status**: Updated to accept `renderId` prop
   - **Location**: Ready for use on render detail pages
   - **Removed from**: Main budget page

5. **SchedulerCostTable** ✅
   - **Status**: Updated to accept `schedulerId` prop
   - **Location**: Ready for use on scheduler detail pages
   - **Removed from**: Main budget page

---

## ⏳ Components Pending Update

These components still need to be updated to accept IDs as props and integrated into dedicated pages:

### Render-Specific Components

1. **AssetTypeBreakdown**
   - **Current State**: Requires manual render ID input
   - **Needs**: Update to accept `renderId` prop, remove input form
   - **Future Location**: `/dashboard/budget/render/[renderId]` page
   - **Removed from**: Main budget page (Detailed Analytics section)

2. **ModelTokenAnalysis**
   - **Current State**: Requires manual render ID input
   - **Needs**: Update to accept `renderId` prop, remove input form
   - **Future Location**: `/dashboard/budget/render/[renderId]` page
   - **Removed from**: Main budget page (Detailed Analytics section)

### Scheduler-Specific Components

3. **EfficiencyMetrics**
   - **Current State**: Requires manual scheduler ID input
   - **Needs**: Update to accept `schedulerId` prop, remove input form
   - **Future Location**: `/dashboard/budget/scheduler/[schedulerId]` page
   - **Removed from**: Main budget page (Detailed Analytics section)

4. **AverageCostBenchmarks**
   - **Current State**: Requires manual scheduler ID input
   - **Needs**: Update to accept `schedulerId` prop, remove input form
   - **Future Location**: `/dashboard/budget/scheduler/[schedulerId]` page
   - **Removed from**: Main budget page (Detailed Analytics section)

5. **FileSizeDurationAnalysis**
   - **Current State**: Requires manual scheduler ID input
   - **Needs**: Update to accept `schedulerId` prop, remove input form
   - **Future Location**: `/dashboard/budget/scheduler/[schedulerId]` page
   - **Removed from**: Main budget page (Detailed Analytics section)

---

## 📋 Pages to Create

### Render Pages

1. **`/dashboard/budget/render/page.tsx`** ⏳
   - **Status**: Placeholder created, needs data source
   - **Purpose**: List of renders for selection
   - **Data Source Needed**: Global endpoint for listing renders (or aggregate from account summaries)
   - **Components to Include**: List of recent renders with navigation

2. **`/dashboard/budget/render/[renderId]/page.tsx`** ⏳
   - **Status**: Not created
   - **Purpose**: Render detail page with cost analytics
   - **Components to Include**:
     - `RenderCostBreakdown` (already updated ✅)
     - `AssetTypeBreakdown` (needs update)
     - `ModelTokenAnalysis` (needs update)

### Scheduler Pages

3. **`/dashboard/budget/scheduler/page.tsx`** ⏳
   - **Status**: Not created
   - **Purpose**: List of schedulers for selection
   - **Data Source Needed**: Global endpoint for listing schedulers (or aggregate from account summaries)
   - **Components to Include**: List of schedulers with navigation

4. **`/dashboard/budget/scheduler/[schedulerId]/page.tsx`** ⏳
   - **Status**: Not created
   - **Purpose**: Scheduler detail page with cost analytics
   - **Components to Include**:
     - `SchedulerCostTable` (already updated ✅)
     - `EfficiencyMetrics` (needs update)
     - `AverageCostBenchmarks` (needs update)
     - `FileSizeDurationAnalysis` (needs update)

---

## 🔗 Navigation Integration Points

These are places where render/scheduler IDs are available and can link to detail pages:

1. **AccountSummary Component**
   - `recentRenders` array contains render IDs → Link to `/dashboard/budget/render/[renderId]`
   - `recentSchedulers` array contains scheduler IDs → Link to `/dashboard/budget/scheduler/[schedulerId]`

2. **SchedulerCostTable Component**
   - Table rows already have click handlers → Navigate to render detail pages
   - Can also link scheduler ID to scheduler detail page

3. **Period Tables**
   - May contain render/scheduler references that can be made clickable

---

## 📝 Implementation Checklist

### Phase 1: Update Components
- [ ] Update `AssetTypeBreakdown` to accept `renderId` prop
- [ ] Update `ModelTokenAnalysis` to accept `renderId` prop
- [ ] Update `EfficiencyMetrics` to accept `schedulerId` prop
- [ ] Update `AverageCostBenchmarks` to accept `schedulerId` prop
- [ ] Update `FileSizeDurationAnalysis` to accept `schedulerId` prop

### Phase 2: Create Render Pages
- [ ] Create `/dashboard/budget/render/[renderId]/page.tsx`
- [ ] Integrate `RenderCostBreakdown`, `AssetTypeBreakdown`, `ModelTokenAnalysis`
- [ ] Update render list page with actual data source
- [ ] Add navigation from `AccountSummary` recent renders

### Phase 3: Create Scheduler Pages
- [ ] Create `/dashboard/budget/scheduler/page.tsx`
- [ ] Create `/dashboard/budget/scheduler/[schedulerId]/page.tsx`
- [ ] Integrate `SchedulerCostTable`, `EfficiencyMetrics`, `AverageCostBenchmarks`, `FileSizeDurationAnalysis`
- [ ] Add navigation from `AccountSummary` recent schedulers

### Phase 4: Data Sources
- [ ] Identify or create global endpoint for listing renders
- [ ] Identify or create global endpoint for listing schedulers
- [ ] Or implement aggregation from account summaries

---

## 💡 Notes

- All components should follow the same pattern as account components:
  - Accept ID as prop (no input forms)
  - Use white background container style (`bg-white border shadow-none`)
  - Consistent padding (`p-4` on CardHeader and CardContent)
  - Proper loading and error states

- Navigation should be consistent:
  - List pages show selection interface
  - Detail pages show analytics components
  - Clickable IDs throughout the app link to detail pages

- Consider creating utility functions for:
  - Getting render list (aggregate from accounts or dedicated endpoint)
  - Getting scheduler list (aggregate from accounts or dedicated endpoint)

---

## 🔄 Related Files

- **Account Pages**: `/dashboard/budget/account/page.tsx` and `/dashboard/budget/account/[accountId]/page.tsx` (✅ Complete)
- **Render Placeholder**: `/dashboard/budget/render/page.tsx` (⏳ Needs data source)
- **Component Files**: All in `/src/app/dashboard/budget/components/`

