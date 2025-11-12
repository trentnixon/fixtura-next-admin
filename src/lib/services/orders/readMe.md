# Folder Overview

Server-side service functions for the orders domain. These wrappers call Fixtura CMS endpoints to expose admin order data to React Query hooks and UI components.

## Files

- `fetchAdminOrderOverview.ts`: Retrieves aggregated order overview data including table rows, summary statistics, and timeline series for the admin dashboard.
- `fetchAdminOrderDetail.ts`: Retrieves detailed order information for a single order, including payment, schedule, account, and customer data.
- `updateAdminOrder.ts`: Updates an admin order via POST request to the CMS backend.
- `createAdminInvoice.ts`: Creates a manual invoice order for an account via POST request to the CMS backend. Independent of Stripe integration.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/lib/axios`, `@/types/orderOverview`, `@/types/orderDetail`
- Consumed by: `src/hooks/orders/useAdminOrderOverview.ts`, `src/hooks/orders/useAdminOrderDetail.ts`, `src/hooks/orders/useAdminOrderUpdate.ts`, `src/hooks/orders/useAdminCreateInvoice.ts`, orders dashboard UI

## Dependencies

- Internal: `@/lib/axios`, `@/types/orderOverview`, `@/types/orderDetail`
- External: CMS endpoints `/orders/admin/overview`, `/orders/admin/:id`, `POST /orders/admin/:id`, `POST /orders/admin/create-invoice`
