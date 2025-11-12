# Folder Overview

Dynamic route for viewing and editing a single order within the admin dashboard. This page surfaces detailed order metadata, billing history, and timeline activity, with the ability to edit order fields.

## Files

- `page.tsx`: Main page component that orchestrates order detail display, edit mode, and related orders.
- `components/OrderEditForm.tsx`: Form component for editing order fields (status, payment, currency). Uses reusable form component library.
- `components/OrderSummaryCard.tsx`: Displays order summary with badges, totals, subscription tier, account information, progress chart, and timestamps.
- `components/OrderScheduleCard.tsx`: Displays order schedule information (start/end dates, fixture window, Stripe expiration).
- `components/OrderPaymentCard.tsx`: Displays payment information including status, method, and invoice details with view/download buttons.
- `components/OrderCustomerCard.tsx`: Displays customer information linked to the order.
- `components/RelatedOrdersTable.tsx`: Table component displaying related orders for the same account.
- `components/utils/badgeHelpers.ts`: Shared utility functions for badge styling and variant determination (moved to `../../utils/badgeHelpers.ts`).

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: navigations from the orders overview table (`/dashboard/orders`)
- Key dependencies: `@/components/scaffolding`, `@/hooks/orders/useAdminOrderDetail`, `@/hooks/orders/useAdminOrderUpdate`, `@/lib/services/orders/fetchAdminOrderDetail`, `@/lib/services/orders/updateAdminOrder`, `@/app/dashboard/orders/components/forms`

## Dependencies

- Internal: `@/components/scaffolding/containers`, `@/hooks/orders/useAdminOrderDetail`, `@/hooks/orders/useAdminOrderUpdate`, `@/hooks/accounts/useAccountQuery`, `@/lib/services/orders/fetchAdminOrderDetail`, `@/lib/services/orders/updateAdminOrder`, `@/app/dashboard/orders/components/forms`, `@/components/ui` (Button, Card, Badge, Table, Separator), `@/components/ui-library`
- External: `@tanstack/react-query`, `recharts`, `sonner` (toast notifications)

---

## Implementation Details

### Page Structure

The order detail page (`page.tsx`) supports two modes:
1. **View Mode**: Displays order information in read-only cards (OrderSummaryCard, OrderScheduleCard, OrderPaymentCard, OrderCustomerCard, RelatedOrdersTable)
2. **Edit Mode**: Displays OrderEditForm for editing order fields

Mode switching is managed via `isEditMode` state. The page title (`CreatePageTitle`) dynamically updates based on the current mode.

### OrderEditForm

The edit form uses the reusable form component library from `@/app/dashboard/orders/components/forms`:
- **StatusSection**: Combines checkout status and payment status selects
- **OrderFlagsSection**: Displays all boolean status flags (Status, isActive, OrderPaid, etc.)
- **CurrencyInput**: Currency input field (input mode)
- **DateRangeInputs**: Start/end dates (read-only)
- **PaymentChannelSelect**: Payment channel selection
- **ReadOnlyField**: Read-only fields for order name and Stripe customer ID
- **AccountInfoSidebar**: Account information sidebar with action buttons

#### Editable Fields

- Currency
- Payment channel
- Checkout status
- Payment status
- Status boolean
- isActive boolean
- OrderPaid boolean
- isExpiringSoon boolean
- expiringSoonEmail boolean
- hasOrderExpired boolean
- expireEmailSent boolean
- cancel_at_period_end boolean
- isPaused boolean

#### Read-Only Fields

- Order name
- Stripe customer ID
- Start date
- End date
- Account ID
- Customer information

### OrderSummaryCard

Displays comprehensive order information:
- **Hero Header**: Order name, ID, currency, and status badges
- **Financial Highlight Box**: Total amount, payment status, payment channel (dynamic background color based on payment status)
- **Account Section**: Account name, type, sport, contact email, clubs, associations
- **Timeline**: Created and updated timestamps
- **Progress Chart**: Pie chart showing days used vs. days remaining for season pass

The financial highlight box uses emerald (green) colors for paid orders and amber (yellow) colors for unpaid orders.

### Data Flow

1. **Fetch Order**: `useAdminOrderDetail(orderId)` fetches order data from `/api/orders/admin/:id`
2. **Fetch Account**: `useAccountQuery(accountId)` fetches account details for sidebar display
3. **Update Order**: `useAdminOrderUpdate()` mutation updates order via `/api/orders/admin/:id`
4. **Cache Invalidation**: After successful update, order detail query is refetched

### Error Handling

- Loading states: Skeleton loading for initial load, minimal loading for refetch
- Error states: ErrorState component with retry functionality
- Empty states: EmptyState component when order not found
- Toast notifications: Success/error toasts for update operations

### Related Orders

The `RelatedOrdersTable` displays other orders for the same account, sorted by recency. Each row includes:
- Order ID (linked to order detail page)
- Order name
- Total amount
- Status badges
- Created date

---

## API Integration

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

Updates order fields. Payload includes:
- `currency`: Currency code (string)
- `payment_channel`: Payment channel ("stripe" | "invoice" | null)
- `payment_status`: Payment status (string | null)
- `OrderPaid`: Order paid flag (boolean)
- `Status`: Status boolean flag (boolean)
- `checkout_status`: Checkout status (CheckoutStatus enum)
- `isActive`: Active flag (boolean)
- `isPaused`: Paused flag (boolean)
- `cancel_at_period_end`: Cancel at period end flag (boolean)
- `hasOrderExpired`: Expired flag (boolean)
- `isExpiringSoon`: Expiring soon flag (boolean)
- `expireEmailSent`: Expire email sent flag (boolean)
- `expiringSoonEmail`: Expiring soon email sent flag (boolean)

---

## Edge Cases & Considerations

### Missing Data

- **Missing Account**: Account information displays "Loading..." or error state
- **Missing Customer**: Customer card shows "N/A" for missing fields
- **Missing Subscription Tier**: Subscription tier displays "—" for missing name
- **Empty Related Orders**: RelatedOrdersTable shows empty state message

### Date Handling

- Dates are displayed in local timezone using `formatDate` utility
- Date calculations (days in season pass) handle null/undefined dates gracefully
- Progress chart calculations handle edge cases (order not started, order ended)

### Status Badges

- Status badges use dynamic variants based on status value
- Checkout status badges use outline variant with custom colors
- Active badge uses primary variant when active, outline when inactive
- Expired and paused badges use destructive and secondary variants

### Payment Status Styling

- Financial highlight box background color changes based on payment status
- Emerald (green) for paid orders (`orderPaid === true` or `payment.status === "paid"`)
- Amber (yellow) for unpaid orders
- Payment status and channel are displayed below the total amount

### Form Validation

- All fields are validated before submission
- Currency must be a valid 3-character code
- Payment channel must be "stripe", "invoice", or null
- Checkout status must be a valid CheckoutStatus enum value
- Payment status must be a valid payment status string

### Cache Management

- Order detail query has 1-minute stale time
- After successful update, order detail query is refetched
- Related orders are included in the same response, so they update automatically

---

## Future Enhancements

- Add order history/audit log
- Add bulk edit functionality for multiple orders
- Add order cancellation workflow
- Add invoice regeneration functionality
- Add payment retry functionality
- Add order notes/comments
- Add order attachments
- Add order export functionality
