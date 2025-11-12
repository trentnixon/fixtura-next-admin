# Folder Overview

Orders workspace for financial tracking and order management. Provides comprehensive order overview, detail views, editing capabilities, and invoice creation functionality.

## Files

- `page.tsx`: Renders the admin orders overview dashboard with filters, stats, timeline, and table.
- `DevelopmentRoadMap.md`: Roadmap for orders feature delivery and completed tasks.
- `Tickets.md`: Tickets and tasks governing orders development (TKT-2025-023, TKT-2025-024, TKT-2025-025, TKT-2025-026).
- `components/`: Client components for orders overview dashboard.
  - `OrdersOverviewDashboard.tsx`: Main dashboard component
  - `OrdersOverviewFilters.tsx`: Filter controls (date range, status)
  - `OrdersOverviewMetrics.tsx`: Summary metric widgets
  - `OrdersOverviewTimeline.tsx`: Timeline chart component
  - `OrdersOverviewTable.tsx`: Orders table with sorting and pagination
  - `forms/`: Reusable form components for order creation and editing (see `components/forms/readMe.md` and TKT-2025-026).
- `[id]/`: Dynamic order detail route for viewing and editing individual orders (see `[id]/readMe.md`).
- `create/[id]/`: Dynamic invoice creation route that accepts an account ID parameter (see `create/[id]/readMe.md`).
- `utils/`: Shared utility functions for order forms, currency, dates, badges, and validation.
  - `badgeHelpers.ts`: Badge styling and variant determination
  - `currencyHelpers.ts`: Currency formatting and conversion (dollars ↔ cents)
  - `dateHelpers.ts`: Date calculations and formatting
  - `formConstants.ts`: Form state constants and defaults
  - `formHelpers.ts`: Form state management helpers
  - `formValidationHelpers.ts`: Form validation logic
  - `invoiceHelpers.ts`: Invoice creation helpers (date calculations, due date generation)
  - `orderHelpers.ts`: Order-specific utility functions
  - `subscriptionTierHelpers.ts`: Subscription tier data transformation
  - `textHelpers.ts`: Text formatting utilities

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `@/components/scaffolding`, `@/components/ui`, `@/components/ui-library`
- Consumed by: `/dashboard/orders`, account hub (invoice creation)
- Related: Account hub (club/association account pages for invoice creation)

## Dependencies

- Internal:
  - `@/hooks/orders/useAdminOrderOverview` - Orders overview data fetching
  - `@/hooks/orders/useAdminOrderDetail` - Order detail data fetching
  - `@/hooks/orders/useAdminOrderUpdate` - Order update mutation
  - `@/hooks/orders/useAdminCreateInvoice` - Invoice creation mutation
  - `@/hooks/accounts/useAccountQuery` - Account data fetching
  - `@/hooks/subscription-tiers/useSubscriptionTiers` - Subscription tier data fetching
  - `@/lib/services/orders/fetchAdminOrderOverview` - Orders overview API client
  - `@/lib/services/orders/fetchAdminOrderDetail` - Order detail API client
  - `@/lib/services/orders/updateAdminOrder` - Order update API client
  - `@/lib/services/orders/createAdminInvoice` - Invoice creation API client
- External:
  - `@tanstack/react-query` - Data fetching and caching
  - `recharts` - Chart visualization
  - `sonner` - Toast notifications
  - `next/navigation` - Routing and navigation

---

## Feature Overview

### Orders Overview Dashboard

The main orders dashboard (`/dashboard/orders`) provides:
- **Summary Metrics**: Total orders, paid vs unpaid counts, revenue totals
- **Timeline Chart**: Order creation trends over time
- **Filters**: Date range and status filters
- **Orders Table**: Sortable, paginated table with order details
- **Navigation**: Click on order rows to view order detail page

### Order Detail Page

The order detail page (`/dashboard/orders/[id]`) provides:
- **View Mode**: Read-only display of order information
  - Order summary card with financial highlights and progress chart
  - Schedule card with start/end dates
  - Payment card with invoice details
  - Customer card with customer information
  - Related orders table
- **Edit Mode**: Editable form for order fields
  - Status and payment fields
  - Currency and payment channel
  - Boolean status flags
  - Account information sidebar

### Invoice Creation

The invoice creation page (`/dashboard/orders/create/[id]`) provides:
- **Invoice Form**: Comprehensive form for creating manual invoice orders
  - Subscription tier selection with metadata display
  - Amount and currency inputs (auto-populated from tier)
  - Date range inputs (end date auto-calculated from tier)
  - Status and payment status selects
  - Boolean status flags
  - Account information sidebar
- **Validation**: Client-side validation for all required fields
- **Auto-Population**: Automatic population of amount, currency, and end date from selected tier
- **Navigation**: Redirects to created order detail page on success

### Reusable Form Component Library

The form component library (`components/forms/`) provides:
- **Status Components**: CheckoutStatusSelect, PaymentStatusSelect, StatusSection
- **Boolean Switch Components**: OrderStatusSwitch, OrderStatusSwitches, OrderFlagsSection
- **Input Components**: CurrencyInput, AmountInput, DateRangeInputs
- **Selection Components**: SubscriptionTierSelect, PaymentChannelSelect
- **Display Components**: AccountInfoSidebar, ReadOnlyField

See `components/forms/readMe.md` for detailed usage examples and API documentation.

---

## API Endpoints

### GET /api/orders/admin/overview

Fetches orders overview data including:
- Summary metrics (total orders, paid/unpaid counts, revenue totals)
- Timeline data (order creation trends)
- Orders table data (paginated, sortable, filterable)

### GET /api/orders/admin/:id

Fetches detailed order information including:
- Order metadata (id, name, currency, totals)
- Payment information (status, channel, method, invoice details)
- Status information (display, checkoutStatus, boolean flags)
- Schedule information (start/end dates, fixture window)
- Account information (id, name, sport, type, contact, clubs, associations)
- Subscription tier information (id, name, price, billing interval)
- Customer information (id, name, email, stripeCustomerId)
- Timestamps (createdAt, updatedAt, strapiCreated)
- Related orders (sibling orders for the same account)

### POST /api/orders/admin/:id

Updates order fields. See `[id]/readMe.md` for payload structure.

### POST /api/orders/admin/create-invoice

Creates a new invoice order. See `create/[id]/readMe.md` for payload structure.

### GET /api/accounts/:id

Fetches account details for display in forms and sidebars.

### GET /api/subscription-tiers

Fetches available subscription tiers for invoice creation.

---

## Data Dependencies

### Order Data

- Orders are fetched from `/api/orders/admin/overview` and `/api/orders/admin/:id`
- Order data includes nested relationships (account, customer, subscription tier)
- Related orders are included in the order detail response

### Account Data

- Account data is fetched from `/api/accounts/:id`
- Used in order detail page sidebar and invoice creation form
- Includes organization details, contact information, clubs, and associations

### Subscription Tier Data

- Subscription tier data is fetched from `/api/subscription-tiers`
- Used in invoice creation form for tier selection
- Includes price, currency, days in pass, and metadata

### Cache Management

- Order queries have 1-minute stale time
- After mutations (update, create), relevant query caches are invalidated
- Account and subscription tier queries have longer stale times (data changes infrequently)

---

## Edge Cases & Considerations

### Missing Data

- **Missing Account**: Displays loading or error state, form still functional
- **Missing Customer**: Customer card shows "N/A" for missing fields
- **Missing Subscription Tier**: Displays "—" for missing tier name
- **Empty Related Orders**: Table shows empty state message
- **No Subscription Tiers**: Invoice creation form shows error state

### Date Handling

- Dates are stored as ISO strings in form state
- Dates are displayed in local timezone using `formatDate` utility
- Date calculations handle null/undefined dates gracefully
- End date is auto-calculated from start date + subscription tier's days in pass

### Currency & Amount Handling

- User enters amounts in dollars (e.g., "650.00")
- Backend expects amounts in cents (e.g., 65000)
- Conversion handled by `unitsToCents()` and `centsToUnits()` utilities
- Currency is validated to ensure 3-character codes

### Status Handling

- Status badges use dynamic variants based on status value
- Checkout status uses CheckoutStatus enum values
- Payment status uses string values (open, paid, unpaid, past_due, void, draft)
- Boolean status flags are stored as booleans in form state

### Form Validation

- All required fields are validated before submission
- Date validation ensures end date is after start date
- Amount validation ensures positive values
- Currency validation ensures 3-character codes
- Validation errors are displayed below each field

### Error Handling

- Loading states: Skeleton loading for initial load, minimal loading for refetch
- Error states: ErrorState component with retry functionality
- Empty states: EmptyState component when no data is available
- Toast notifications: Success/error toasts for mutations
- API errors: Error messages displayed in toasts and error states

---

## Future Enhancements

- Add CSV export functionality for orders table
- Add bulk edit functionality for multiple orders
- Add order history/audit log
- Add order cancellation workflow
- Add invoice regeneration functionality
- Add payment retry functionality
- Add order notes/comments
- Add order attachments
- Add advanced filters (account, tier, date range)
- Add order scheduling (create invoice for future date)
- Add invoice template selection
- Add invoice preview before creation
- Add invoice duplication from existing order
