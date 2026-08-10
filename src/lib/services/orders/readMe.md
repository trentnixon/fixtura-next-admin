# Folder Overview

Server-side service functions for the orders domain. These wrappers call Fixtura CMS endpoints to expose admin order data to React Query hooks and UI components.

## Files

- `fetchAdminOrderOverview.ts`: Retrieves aggregated order overview data including table rows, summary statistics, and timeline series for the admin dashboard.
- `fetchAdminOrderDetail.ts`: Retrieves detailed order information for a single order, including payment, schedule, account, and customer data.
- `updateAdminOrder.ts`: Updates an admin order via POST request to the CMS backend.
- `createAdminInvoice.ts`: Creates a manual invoice order for an account via POST request to the CMS backend. Independent of Stripe integration.
- `fetchAdminInvoices.ts`: Lists admin invoice requests (invoice workspace queue).
- `fetchAdminInvoiceDetail.ts`: Loads combined invoice-request/order aggregate.
- `updateAdminInvoice.ts`: PATCH combined invoice aggregate update.
- `adminInvoicePayloads.ts`: Query serialization, response parsers, React Query key helpers.
- `adminInvoiceTransitions.ts`: Client FSM helpers for allowed next statuses.
- `buildAdminInvoicePatch.ts`: Form diff → PATCH payload builder with concurrency gates.
- `reapplyDirtyInvoiceEditorFields.ts`: Stale-conflict Keep helper (dirty-field reapplication).
- `adminInvoiceErrorMessages.ts`: User-facing error copy for CMS codes.

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/lib/axios`, `@/types/orderOverview`, `@/types/orderDetail`
- Consumed by: `src/hooks/orders/useAdminOrderOverview.ts`, `src/hooks/orders/useAdminOrderDetail.ts`, `src/hooks/orders/useAdminOrderUpdate.ts`, `src/hooks/orders/useAdminCreateInvoice.ts`, `src/hooks/orders/useAdminInvoices.ts`, `src/hooks/orders/useAdminInvoiceDetail.ts`, `src/hooks/orders/useAdminInvoiceUpdate.ts`, orders dashboard UI

## Dependencies

- Internal: `@/lib/axios`, `@/types/orderOverview`, `@/types/orderDetail`
- External: CMS endpoints `/orders/admin/overview`, `/orders/admin/:id`, `POST /orders/admin/:id`, `POST /orders/admin/create-invoice`
