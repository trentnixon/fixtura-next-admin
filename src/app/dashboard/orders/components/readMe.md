# Folder Overview

Client-side components that compose the orders dashboard experience. These widgets consume the admin order overview hook to render filters, metrics, timelines, and tables.

## Files

- `OrdersOverviewDashboard.tsx`: Fetches admin order overview data from provided filters and renders metrics, timeline, and table with loading/error states.
- `OrdersOverviewFilters.tsx`: Controlled filter form for start date, end date, and checkout status.
- `OrdersOverviewMetrics.tsx`: Displays summary stat cards derived from overview stats payload.
- `OrdersOverviewTimeline.tsx`: Renders the orders timeline chart with counts and revenue trends.
- `OrdersOverviewTable.tsx`: Data table presenting individual orders with status badges and date formatting.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `src/app/dashboard/orders/page.tsx`
- Key dependencies: `@/hooks/orders/useAdminOrderOverview`

## Dependencies

- Internal: `@/hooks/orders/useAdminOrderOverview`, `@/types/orderOverview`
- External: `lucide-react`, `recharts`, UI primitives from `@/components/ui` and `@/components/ui-library`
