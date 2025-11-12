# Folder Overview

React Query hooks for the orders domain. Provides client-side access to admin order data with consistent caching, retries, and error handling.

## Files

- `useAdminOrderOverview.ts`: Fetches the admin orders overview dataset (table rows, stats, timeline) with filterable query parameters.
- `useAdminOrderDetail.ts`: Fetches detailed order information for a single order, including payment, schedule, account, and customer data.
- `useAdminOrderUpdate.ts`: Mutation hook for updating an admin order with automatic cache invalidation.
- `useAdminCreateInvoice.ts`: Mutation hook for creating a manual invoice order with automatic cache invalidation. Independent of Stripe integration.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/lib/services/orders/fetchAdminOrderOverview`, `@/lib/services/orders/fetchAdminOrderDetail`, `@/lib/services/orders/updateAdminOrder`, `@/lib/services/orders/createAdminInvoice`, `@/types/orderOverview`, `@/types/orderDetail`
- Consumed by: `src/app/dashboard/orders` UI components, account hub (future)

## Dependencies

- Internal: `@/lib/services/orders/fetchAdminOrderOverview`, `@/lib/services/orders/fetchAdminOrderDetail`, `@/lib/services/orders/updateAdminOrder`, `@/lib/services/orders/createAdminInvoice`, `@/types/orderOverview`, `@/types/orderDetail`
- External: `@tanstack/react-query`
