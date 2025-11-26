# Fixture Insights API Integration - Implementation Ticket

## Overview

Integrate the Cricket Fixture Insights API into the Fixtura Admin Dashboard, replacing dummy data with real API data. This implementation follows the established patterns for services, types, and hooks used throughout the application.

**Related Documentation:**
- Handover Notes: `./handOverNotes.md`
- Current README: `./README.md`
- Current Types: `./types.ts`

---

## API Endpoints

### 1. Fixture Insights Endpoint
- **URL**: `GET /api/game-meta-data/admin/insights`
- **Purpose**: Overview insights with categorized summaries
- **Response Time**: 10-15 seconds for large datasets
- **Caching**: 5-10 minutes recommended

### 2. Fixture Details Endpoint
- **URL**: `GET /api/game-meta-data/admin/fixtures`
- **Query Params**: `association`, `grade`, `competition` (all optional)
- **Purpose**: Detailed fixtures filtered by association/grade/competition
- **Response Time**: Faster than insights endpoint
- **Caching**: 2-5 minutes recommended

---

## Implementation Phases

### Phase 1: Type Definitions ✅

**Location**: `src/types/fixtureInsights.ts`

**Tasks**:
1. ✅ Create new type definition file following the pattern from `handOverNotes.md`
2. ✅ Define all API response types:
   - `FixtureInsightsResponse`
   - `FixtureDetailsResponse`
   - `FixtureOverview`
   - `FixtureCategories` (with `AssociationSummary`, `CompetitionSummary`, `GradeSummary`)
   - `FixtureCharts` (with timeline and distribution types)
   - `FixtureDistributions`
   - `FixtureSummary`
   - `FixtureFilters`
   - Meta types (`FixtureInsightsMeta`, `FixtureDetailsMeta`)
3. ✅ Add type guards for runtime validation
4. ✅ Export all types from `src/types/index.ts`

**Files to Create**:
- `src/types/fixtureInsights.ts`

**Files to Update**:
- `src/types/index.ts` (add exports)

---

### Phase 2: Service Layer ✅

**Location**: `src/lib/services/fixtures/`

**Pattern Reference**: `src/lib/services/association/fetchAssociationInsights.ts`

**Tasks**:
1. ✅ Create service directory: `src/lib/services/fixtures/`
2. ✅ Create `fetchFixtureInsights.ts`:
   - Use `axiosInstance` from `@/lib/axios`
   - Implement error handling (400, 500, timeout errors)
   - Add logging for debugging
   - Validate response structure
   - Return typed `FixtureInsightsResponse`
3. ✅ Create `fetchFixtureDetails.ts`:
   - Accept optional `FixtureFilters` parameter
   - Build query string from filters
   - Use `axiosInstance` from `@/lib/axios`
   - Implement error handling
   - Add logging for debugging
   - Return typed `FixtureDetailsResponse`
4. ✅ Create `readMe.md` documenting the services

**Files to Create**:
- `src/lib/services/fixtures/fetchFixtureInsights.ts`
- `src/lib/services/fixtures/fetchFixtureDetails.ts`
- `src/lib/services/fixtures/readMe.md`

**Service Implementation Pattern**:
```typescript
"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { FixtureInsightsResponse } from "@/types/fixtureInsights";

export async function fetchFixtureInsights(): Promise<FixtureInsightsResponse> {
  try {
    const endpoint = `/game-meta-data/admin/insights`;

    console.log(`[fetchFixtureInsights] Fetching fixture insights`);

    const response = await axiosInstance.get<FixtureInsightsResponse>(endpoint);

    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response structure from fixture insights API");
    }

    return response.data;
  } catch (error) {
    // Handle AxiosError with proper error messages
    // See fetchAssociationInsights.ts for full pattern
  }
}
```

---

### Phase 3: React Query Hooks ✅

**Location**: `src/hooks/fixtures/`

**Pattern Reference**: `src/hooks/association/useAssociationInsights.ts`

**Tasks**:
1. ✅ Create hooks directory: `src/hooks/fixtures/`
2. ✅ Create `useFixtureInsights.ts`:
   - Use `@tanstack/react-query`
   - Query key: `["fixture-insights"]`
   - Stale time: 5 minutes (as recommended)
   - Cache time: 10 minutes
   - Retry: 3 attempts with exponential backoff
3. ✅ Create `useFixtureDetails.ts`:
   - Accept optional `FixtureFilters` parameter
   - Query key: `["fixture-details", filters]`
   - Stale time: 2 minutes
   - Cache time: 5 minutes
   - Retry: 3 attempts with exponential backoff
   - `enabled` option based on filter requirements

**Files to Create**:
- `src/hooks/fixtures/useFixtureInsights.ts`
- `src/hooks/fixtures/useFixtureDetails.ts`

**Hook Implementation Pattern**:
```typescript
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { FixtureInsightsResponse } from "@/types/fixtureInsights";
import { fetchFixtureInsights } from "@/lib/services/fixtures/fetchFixtureInsights";

export function useFixtureInsights(): UseQueryResult<FixtureInsightsResponse, Error> {
  return useQuery<FixtureInsightsResponse, Error>({
    queryKey: ["fixture-insights"],
    queryFn: () => fetchFixtureInsights(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}
```

---

### Phase 4: UI Integration - Association Selection ✅

**Goal**: Create a table-based interface to select an association and view its fixtures

**Location**: `src/app/dashboard/fixtures/_components/`

**Tasks**:

#### 4.1: Create Association Selection Component
1. ✅ Create `AssociationSelector.tsx`:
   - Use `useFixtureInsights()` hook
   - Display loading state while fetching
   - Display error state if fetch fails
   - Render table of associations from `data.categories.byAssociation`
   - Table columns:
     - Association Name
     - Fixture Count
     - Competition Count
     - Grade Count
     - Date Range (earliest - latest)
     - Action (Select button)
   - On select, emit `onAssociationSelect(associationId)` callback
   - Use existing UI components from `@/components/ui/table`

#### 4.2: Create Fixtures Table Component
2. ✅ Create `AssociationFixturesTable.tsx`:
   - Accept `associationId` prop
   - Use `useFixtureDetails({ association: associationId })` hook
   - Display loading state while fetching
   - Display error state if fetch fails
   - Render table of fixtures from `data.fixtures`
   - Table columns:
     - Date
     - Round
     - Competition
     - Grade
     - Teams (Home vs Away)
     - Status
     - Type
     - Actions (View Details)
   - Implement sorting and filtering
   - Use existing UI components

#### 4.3: Update Main Fixtures Page
3. ✅ Update `FixturesOverview.tsx`:
   - Add state for selected association: `const [selectedAssociation, setSelectedAssociation] = useState<number | null>(null)`
   - Render `AssociationSelector` when no association is selected
   - Render `AssociationFixturesTable` when association is selected
   - Add "Back to Associations" button when viewing fixtures
   - Remove dummy data
   - Update to use real API data

**Files to Create**:
- `src/app/dashboard/fixtures/_components/AssociationSelector.tsx`
- `src/app/dashboard/fixtures/_components/AssociationFixturesTable.tsx`

**Files to Update**:
- `src/app/dashboard/fixtures/_components/FixturesOverview.tsx`

---

### Phase 5: Statistics Dashboard ✅

**Goal**: Display overview statistics from the insights endpoint

**Location**: `src/app/dashboard/fixtures/_components/`

**Tasks**:
1. ✅ Update `FixturesStats.tsx`:
   - Use `useFixtureInsights()` hook
   - Display stats from `data.overview`:
     - Total Fixtures
     - Fixtures Past / Future / Today
     - Unique Competitions
     - Unique Associations
     - Unique Grades
   - Use existing `MetricCard` or similar UI components
   - Add loading skeleton
   - Add error state

**Files to Update**:
- `src/app/dashboard/fixtures/_components/FixturesStats.tsx`

---

### Phase 6: Charts and Visualizations (Optional - Future Enhancement)

**Goal**: Visualize fixture timeline and distributions

**Location**: `src/app/dashboard/fixtures/_components/`

**Tasks**:
1. ⏳ Create `FixtureTimelineChart.tsx`:
   - Use `data.charts.fixtureTimeline` from insights
   - Display fixture count over time
   - Show status breakdown (upcoming, in progress, finished, cancelled)
   - Use chart library (e.g., Recharts, Chart.js)

2. ⏳ Create `FixtureDistributionCharts.tsx`:
   - Use `data.distributions` from insights
   - Display by status, day of week, etc.
   - Use pie charts or bar charts

**Files to Create** (Future):
- `src/app/dashboard/fixtures/_components/FixtureTimelineChart.tsx`
- `src/app/dashboard/fixtures/_components/FixtureDistributionCharts.tsx`

---

### Phase 7: Fixture Detail Page Enhancement ✅

**Goal**: Integrate real fixture data into the detail page

**Location**: `src/app/dashboard/fixtures/[id]/page.tsx`

**Tasks**:
1. ✅ Create `useFixtureById.ts` hook (if needed):
   - Fetch single fixture by ID
   - Use existing fixture detail endpoint if available
   - Otherwise, filter from `useFixtureDetails()` results

2. ✅ Update `FixtureDetail.tsx`:
   - Remove dummy data
   - Use real fixture data from hook
   - Ensure `FixtureInfo` and `GamesTable` components work with real data

**Files to Create** (if needed):
- `src/hooks/fixtures/useFixtureById.ts`

**Files to Update**:
- `src/app/dashboard/fixtures/_components/FixtureDetail.tsx`
- `src/app/dashboard/fixtures/[id]/page.tsx`

---

## Testing Checklist

### Unit Testing
- [ ] Test type guards with valid/invalid data
- [ ] Test service error handling (400, 500, timeout)
- [ ] Test query string building in `fetchFixtureDetails`

### Integration Testing
- [ ] Test `useFixtureInsights` hook with real API
- [ ] Test `useFixtureDetails` hook with different filters
- [ ] Test association selection flow
- [ ] Test fixture table rendering with real data

### UI Testing
- [ ] Verify loading states display correctly
- [ ] Verify error states display user-friendly messages
- [ ] Verify table sorting and filtering works
- [ ] Verify navigation between association list and fixtures works
- [ ] Verify fixture detail page loads correctly

### Performance Testing
- [ ] Verify caching works (5 min for insights, 2 min for details)
- [ ] Verify retry logic works on failed requests
- [ ] Monitor API response times (insights: 10-15s expected)

---

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_APP_API_BASE_URL=http://localhost:1337
APP_API_KEY=your_api_key_here
```

---

## Migration Path

### Step 1: Keep Dummy Data Initially
- Implement all services, types, and hooks
- Test with real API in isolation
- Keep dummy data in components for now

### Step 2: Gradual Component Migration
- Start with `FixturesStats` (simple, read-only)
- Then `AssociationSelector` (new component)
- Then `AssociationFixturesTable` (new component)
- Finally update `FixtureDetail` (existing component)

### Step 3: Remove Dummy Data
- Once all components use real data, remove:
  - `DUMMY_FIXTURES` from `FixturesOverview.tsx`
  - `DUMMY_FIXTURES_DATA` from `FixtureDetail.tsx`
- Update `types.ts` to remove old dummy types if needed

---

## Success Criteria

✅ **Phase 1-3 Complete**: Services, types, and hooks are implemented and tested
✅ **Phase 4 Complete**: Association selection and fixtures table work with real data
✅ **Phase 5 Complete**: Statistics dashboard displays real overview data
✅ **Phase 7 Complete**: Fixture detail page uses real data
⏳ **Phase 6**: Charts and visualizations (optional enhancement)

---

## Notes

### Performance Considerations
- Insights endpoint is slow (10-15s) - ensure good loading UX
- Implement proper caching to avoid unnecessary API calls
- Consider pagination for large fixture lists

### Error Handling
- Display user-friendly error messages
- Provide retry buttons on error states
- Log errors for debugging

### Future Enhancements
- Real-time updates for live fixtures
- Advanced filtering (date range, multiple associations)
- Export functionality (CSV, PDF)
- Bulk operations
- Fixture creation wizard

---

## Dependencies

- `@tanstack/react-query` - Already installed
- `axios` - Already installed
- `date-fns` - Already installed
- `lucide-react` - Already installed
- `@/components/ui/*` - shadcn/ui components already available

---

## Timeline Estimate

- **Phase 1**: 1-2 hours (Types)
- **Phase 2**: 2-3 hours (Services)
- **Phase 3**: 1-2 hours (Hooks)
- **Phase 4**: 4-6 hours (UI Integration)
- **Phase 5**: 2-3 hours (Statistics)
- **Phase 7**: 2-3 hours (Detail Page)
- **Testing**: 2-3 hours

**Total**: ~15-22 hours

---

## References

- Handover Notes: `./handOverNotes.md`
- Service Pattern: `src/lib/services/association/fetchAssociationInsights.ts`
- Hook Pattern: `src/hooks/association/useAssociationInsights.ts`
- Type Pattern: `src/types/associationInsights.ts`
- Axios Config: `src/lib/axios.ts`
