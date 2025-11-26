# Fixture Insights - Architecture Diagram

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CMS Backend                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /api/game-meta-data/admin/insights                        │ │
│  │  - Returns overview stats, categories, charts              │ │
│  │  - Response time: 10-15 seconds                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  /api/game-meta-data/admin/fixtures?association=X          │ │
│  │  - Returns filtered fixture list                           │ │
│  │  - Response time: Fast                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  fetchFixtureInsights()                                    │ │
│  │  - Uses axiosInstance                                      │ │
│  │  - Error handling (400, 500, timeout)                      │ │
│  │  - Logging                                                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  fetchFixtureDetails(filters)                              │ │
│  │  - Builds query string from filters                        │ │
│  │  - Error handling                                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    React Query Layer                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  useFixtureInsights()                                      │ │
│  │  - Query key: ["fixture-insights"]                         │ │
│  │  - Stale time: 5 minutes                                   │ │
│  │  - Cache time: 10 minutes                                  │ │
│  │  - Retry: 3 attempts with exponential backoff              │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  useFixtureDetails(filters)                                │ │
│  │  - Query key: ["fixture-details", filters]                 │ │
│  │  - Stale time: 2 minutes                                   │ │
│  │  - Cache time: 5 minutes                                   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      UI Components                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  FixturesOverview (Main Container)                         │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  FixturesStats                                       │ │ │
│  │  │  - Uses: useFixtureInsights()                        │ │ │
│  │  │  - Shows: Total fixtures, past/future/today counts   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  AssociationSelector (if no selection)               │ │ │
│  │  │  - Uses: useFixtureInsights()                        │ │ │
│  │  │  - Shows: Table of associations                      │ │ │
│  │  │  - Action: onSelect(associationId)                   │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │  AssociationFixturesTable (if selected)              │ │ │
│  │  │  - Uses: useFixtureDetails({ association: id })      │ │ │
│  │  │  - Shows: Table of fixtures                          │ │ │
│  │  │  - Action: Navigate to fixture detail                │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  FixtureDetail (Detail Page)                               │ │
│  │  - Uses: useFixtureDetails() or useFixtureById()          │ │
│  │  - Shows: Fixture info + games table                      │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
/dashboard/fixtures (page.tsx)
│
└── FixturesOverview
    ├── FixturesStats
    │   └── useFixtureInsights() → Display overview metrics
    │
    ├── [Conditional Rendering based on selectedAssociation state]
    │
    ├── AssociationSelector (when selectedAssociation === null)
    │   ├── useFixtureInsights() → Get associations list
    │   └── Table with associations
    │       └── Select button → setSelectedAssociation(id)
    │
    └── AssociationFixturesTable (when selectedAssociation !== null)
        ├── useFixtureDetails({ association: selectedAssociation })
        ├── Back button → setSelectedAssociation(null)
        └── Table with fixtures
            └── View Details button → Navigate to /fixtures/[id]

/dashboard/fixtures/[id] (page.tsx)
│
└── FixtureDetail
    ├── useFixtureDetails() or useFixtureById(id)
    ├── FixtureInfo
    │   └── Display fixture metadata
    └── GamesTable
        └── Display games within fixture
```

## State Management

```typescript
// In FixturesOverview.tsx
const [selectedAssociation, setSelectedAssociation] = useState<number | null>(null);

// When user selects an association
<AssociationSelector onSelect={(id) => setSelectedAssociation(id)} />

// When user wants to go back
<Button onClick={() => setSelectedAssociation(null)}>Back to Associations</Button>

// Conditional rendering
{selectedAssociation === null ? (
  <AssociationSelector onSelect={setSelectedAssociation} />
) : (
  <AssociationFixturesTable
    associationId={selectedAssociation}
    onBack={() => setSelectedAssociation(null)}
  />
)}
```

## Type Flow

```typescript
// API Response
FixtureInsightsResponse
└── data
    ├── overview: FixtureOverview
    ├── categories: FixtureCategories
    │   ├── byAssociation: AssociationSummary[]
    │   ├── byCompetition: CompetitionSummary[]
    │   └── byGrade: GradeSummary[]
    ├── charts: FixtureCharts
    ├── distributions: FixtureDistributions
    └── meta: FixtureInsightsMeta

FixtureDetailsResponse
└── data
    ├── fixtures: FixtureSummary[]
    ├── filters: FixtureFilters
    └── meta: FixtureDetailsMeta

// Component Props
AssociationSelector
├── onSelect: (associationId: number) => void
└── Uses: AssociationSummary[] from insights

AssociationFixturesTable
├── associationId: number
├── onBack: () => void
└── Uses: FixtureSummary[] from details
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  Query Key: ["fixture-insights"]                            │
│  Stale Time: 5 minutes                                      │
│  Cache Time: 10 minutes                                     │
│  ─────────────────────────────────────────────────────────  │
│  First request: Fetch from API (10-15s)                     │
│  Within 5 min: Use cached data (instant)                    │
│  After 5 min: Refetch in background, show cached data       │
│  After 10 min: Cache cleared, fresh fetch required          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Query Key: ["fixture-details", { association: 2771 }]      │
│  Stale Time: 2 minutes                                      │
│  Cache Time: 5 minutes                                      │
│  ─────────────────────────────────────────────────────────  │
│  Different filters = Different cache entries                │
│  association=2771 and association=2772 cached separately    │
└─────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
API Error
    ↓
Service Layer catches AxiosError
    ↓
Logs error details (status, message, url)
    ↓
Throws user-friendly error message
    ↓
React Query catches error
    ↓
Retries up to 3 times with exponential backoff
    ↓
If still fails, sets error state
    ↓
Component displays error UI
    ↓
User can click "Retry" button
    ↓
Triggers refetch
```

## Loading States

```
Component Mount
    ↓
Hook called (useFixtureInsights or useFixtureDetails)
    ↓
isLoading = true
    ↓
Display loading skeleton/spinner
    ↓
API request completes
    ↓
isLoading = false, data populated
    ↓
Display actual data
```

---

## File Structure

```
src/
├── types/
│   └── fixtureInsights.ts          # All type definitions
│
├── lib/
│   └── services/
│       └── fixtures/
│           ├── fetchFixtureInsights.ts
│           ├── fetchFixtureDetails.ts
│           └── readMe.md
│
├── hooks/
│   └── fixtures/
│       ├── useFixtureInsights.ts
│       └── useFixtureDetails.ts
│
└── app/
    └── dashboard/
        └── fixtures/
            ├── page.tsx                        # Main list page
            ├── [id]/
            │   └── page.tsx                    # Detail page
            ├── _components/
            │   ├── FixturesOverview.tsx        # Main container
            │   ├── FixturesStats.tsx           # Stats overview
            │   ├── AssociationSelector.tsx     # NEW: Association table
            │   ├── AssociationFixturesTable.tsx # NEW: Fixtures table
            │   ├── FixtureDetail.tsx           # Detail view
            │   ├── FixtureInfo.tsx             # Info cards
            │   └── GamesTable.tsx              # Games table
            ├── types.ts                        # Local types (deprecated)
            ├── README.md                       # This file
            ├── QUICK_START.md                  # Quick start guide
            ├── IMPLEMENTATION_TICKET.md        # Detailed ticket
            ├── handOverNotes.md                # API docs
            └── ARCHITECTURE.md                 # This file
```

---

## Key Decisions

### Why Two Endpoints?

1. **Insights Endpoint** (`/insights`)
   - Slow (10-15s) but comprehensive
   - Used for overview stats and association list
   - Cached for 5 minutes to avoid repeated slow requests

2. **Details Endpoint** (`/fixtures`)
   - Fast, filtered results
   - Used when user selects an association
   - Cached for 2 minutes (more dynamic data)

### Why Association-First Navigation?

- Fixtures are organized by association in the CMS
- Association is the primary filter for most use cases
- Reduces initial data load (don't fetch all fixtures upfront)
- Matches user mental model (select association → see fixtures)

### Why React Query?

- Built-in caching (reduces API calls)
- Automatic retry logic
- Loading/error states handled
- Background refetching
- Already used throughout the app

### Why Server Actions for Services?

- Follows Next.js 13+ best practices
- Keeps API keys secure (server-side only)
- Consistent with existing patterns in the app
- Better error handling on server

---

## Performance Optimizations

1. **Caching**: 5-10 min for insights, 2-5 min for details
2. **Lazy Loading**: Only fetch fixtures when association selected
3. **Pagination**: Consider for large fixture lists (future)
4. **Memoization**: Use `useMemo` for expensive calculations
5. **Virtualization**: Consider for very long tables (future)

---

## Future Enhancements

- [ ] Add competition and grade filters
- [ ] Add date range filtering
- [ ] Add search functionality
- [ ] Add export to CSV/PDF
- [ ] Add real-time updates for live fixtures
- [ ] Add charts and visualizations
- [ ] Add bulk operations
- [ ] Add fixture creation wizard
