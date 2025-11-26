# Fixtures Module

This module handles the display and management of fixtures and games within the Fixtura admin dashboard.

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Start here! Quick overview and implementation order
- **[IMPLEMENTATION_TICKET.md](./IMPLEMENTATION_TICKET.md)** - Detailed implementation plan with all phases
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Visual diagrams showing data flow and component hierarchy
- **[handOverNotes.md](./handOverNotes.md)** - API documentation and type definitions from CMS team

## ⚠️ Current Status

**Using Dummy Data** - This module currently uses dummy data for demonstration. See `IMPLEMENTATION_TICKET.md` for the plan to integrate real API data from the CMS.

## Structure

```
fixtures/
├── page.tsx                    # Main fixtures list page
├── [id]/
│   └── page.tsx               # Individual fixture detail page
├── _components/
│   ├── FixturesOverview.tsx   # Main overview component with tabs
│   ├── FixturesStats.tsx      # Statistics cards
│   ├── FixturesFilters.tsx    # Filter controls
│   ├── FixturesTable.tsx      # Fixtures table display
│   ├── FixtureDetail.tsx      # Single fixture detail view
│   ├── FixtureInfo.tsx        # Fixture information cards
│   └── GamesTable.tsx         # Games table within a fixture
└── types.ts                   # TypeScript type definitions
```

## Features

### Fixtures List Page (`/dashboard/fixtures`)
- **Statistics Overview**: Displays total fixtures, scheduled, in progress, and completed counts
- **Filters**: Filter by competition name and status
- **Tabbed Interface**:
  - All Fixtures
  - Upcoming (scheduled only)
  - Live (in progress only)
  - Completed
- **Fixtures Table**: Shows all fixtures with:
  - Competition and grade information
  - Round details
  - Date and time
  - Venue
  - Game progress (completed/total)
  - Status badges
  - View action to navigate to detail page

### Fixture Detail Page (`/dashboard/fixtures/[id]`)
- **Fixture Information**:
  - Competition and grade details
  - Round information
  - Schedule and venue details
  - Games progress with visual progress bar
- **Games Table**: Lists all games in the fixture with:
  - Scheduled time
  - Field assignment
  - Home and away teams
  - Live scores (when available)
  - Status badges
  - View and Edit actions

## Dummy Data

Currently using dummy data for demonstration purposes. The data includes:

### Sample Fixtures
1. **Fixture #1**: Premier League 2024 - Division 1, Round 1 (8 games, scheduled)
2. **Fixture #2**: Premier League 2024 - Division 2, Round 1 (6 games, scheduled)
3. **Fixture #3**: Summer Cup 2024 - Open Grade, Round 2 (4 games, 2 completed, 1 in progress)

### Game Statuses
- `scheduled`: Game is scheduled but hasn't started
- `in_progress`: Game is currently being played
- `completed`: Game has finished with final scores
- `cancelled`: Game has been cancelled
- `postponed`: Game has been postponed

## Next Steps

When API routes and type definitions are available:

1. **Replace Dummy Data**:
   - Update `FixturesOverview.tsx` to fetch from API
   - Update `FixtureDetail.tsx` to fetch from API
   - Remove `DUMMY_FIXTURES` and `DUMMY_FIXTURES_DATA` constants

2. **Update Types**:
   - Replace types in `types.ts` with actual API types
   - Ensure all components use the updated types

3. **Add Hooks**:
   - Create `useFixtures` hook in `/hooks/fixtures/`
   - Create `useFixtureDetail` hook in `/hooks/fixtures/`
   - Implement proper loading and error states

4. **Add Mutations**:
   - Implement game score updates
   - Implement fixture status changes
   - Add game creation/editing functionality

5. **Enhance Features**:
   - Add real-time updates for live games
   - Implement fixture creation wizard
   - Add bulk operations
   - Implement advanced filtering and sorting
   - Add export functionality

## Component Dependencies

- **UI Components**: Uses shadcn/ui components (Card, Table, Badge, Tabs, etc.)
- **Date Formatting**: Uses `date-fns` for date formatting
- **Icons**: Uses `lucide-react` for icons
- **Routing**: Uses Next.js App Router for navigation

## Styling

All components follow the existing design system and use:
- Tailwind CSS for styling
- shadcn/ui component variants
- Consistent spacing and typography
- Responsive grid layouts
