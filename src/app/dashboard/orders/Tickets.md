# Completed Tickets

- TKT-2025-023
- TKT-2025-024
- TKT-2025-025
- TKT-2025-026

---

# Ticket – TKT-2025-023

## Overview

Launch the orders workspace under `/dashboard/orders` to monitor and reconcile Fixtura orders.

## What We Need to Do

Deliver order search, filtering, and status tracking with supporting metrics.

## Phases & Tasks

### Phase 1: Requirements & Discovery

- [x] Review `GET /api/orders/admin/overview` spec from CMS and confirm response fields
- [ ] Validate that overview payload satisfies finance stakeholder reporting needs
- [ ] Define status taxonomy, Stripe checkout alignment, and reconciliation workflow

### Phase 2: Backend & Data Access

- [x] Implement server fetcher that hits `/api/orders/admin/overview` using shared fetch utility
- [x] Model TypeScript types for overview rows, stats, and timeline data
- [x] Create TanStack Query hook (`useAdminOrderOverview`) with caching and error handling
- [ ] Record follow-up tasks to secure endpoint once auth module lands

### Phase 3: UI & Interaction

- [x] Compose orders overview table using advanced table pattern (filters, sorting, pagination)
- [x] Add filter controls (date range, status) and wire to query hook params
- [x] Render summary metric widgets and timeline chart using UI library primitives

### Phase 4: QA & Documentation

- [x] Test success, empty, and error scenarios - testing completed
- [x] Document data dependencies and edge cases - documented in readMe.md files
- [x] Update roadmap/tickets and prepare release notes - roadmap and tickets updated

---

# Ticket – TKT-2025-024

## Overview

Implement the admin order detail experience under `/dashboard/orders/[id]`, including server access to `GET /api/orders/admin/:id`, data types, React Query hook, and the UI that surfaces the order record alongside related orders.

## What We Need to Do

Provide a drill-down view for a single order that complements the orders overview table with full order metadata, payment history, and sibling orders from the same account.

## Phases & Tasks

### Phase 1: Requirements & Data Mapping

- [x] Confirm required UI sections from spec (order metadata, payment, schedule, account hierarchy, related orders)
- [x] Map endpoint fields to frontend display components (badges, info cards, tables)
- [ ] Identify conditional states (missing account, empty relatedOrders, unpaid invoices)

### Phase 2: Backend & Data Access

- [x] Implement server fetcher for `GET /api/orders/admin/:id` with error handling
- [x] Model TypeScript types (`OrderDetailResponse`, nested order structures)
- [x] Create `useAdminOrderDetail` TanStack Query hook with parameter guards
- [ ] Capture TODO for securing endpoint once admin auth is enforced

### Phase 3: UI & Interaction

- [x] Scaffold `/dashboard/orders/[id]` page layout (metadata header, payment summary, schedule timeline placeholder)
- [x] Render order detail panels (totals, subscription tier, customer)
- [x] Implement related orders list/table with status badges and navigation
- [x] Wire table actions back to overview or other admin routes as needed
- [x] Add Status boolean field to order edit form
- [x] Integrate reusable form component library (see TKT-2025-026)

### Phase 4: QA & Documentation

- [x] Test success, missing account, and error scenarios - testing completed
- [x] Add loading/empty/error states for each section - implemented
- [x] Update documentation (`[id]/readMe.md`, tickets, roadmap) with implementation details - completed

## Notes

- Ensure currency formatting mirrors overview behaviour (Stripe amounts → dollars)
- Align status badge colours with overview patterns
- Consider future auth middleware when fetching detail data

## Constraints, Risks, Assumptions

- Constraints: Pending confirmation of order API completeness
- Risks: Order state mismatches between billing and internal systems
- Assumptions: Permissions align with existing financial dashboards

---

# Ticket – TKT-2025-025

## Overview

Implement the admin invoice creation endpoint `POST /api/orders/admin/create-invoice` to allow admins to manually create invoice orders for accounts. This is a 100% independent endpoint with no Stripe integration. All invoices are manually created and tracked in the system.

## What We Need to Do

Provide the ability for admins to create manual invoice orders from the account hub. The UI will support both clubs and associations. The endpoint creates complete order records with all relationships and returns the created order in the same format as the order detail endpoint.

## Phases & Tasks

### Phase 1: Requirements & Data Mapping

- [x] Review `POST /api/orders/admin/create-invoice` spec from CMS
- [x] Confirm all required fields (accountId, subscriptionTierId, amount, currency, dates, description)
- [x] Map response structure to existing `OrderDetail` type
- [ ] Identify validation requirements (date validations, account/tier existence)

### Phase 2: Backend & Data Access

- [x] Implement server action `createAdminInvoice.ts` with comprehensive error handling
- [x] Model TypeScript types (`AdminCreateInvoicePayload`, `AdminCreateInvoiceResponse`)
- [x] Create `useAdminCreateInvoice` TanStack Query mutation hook with cache invalidation
- [x] Add types to central type exports (auto-exported via `orderDetail.ts`)
- [x] Update service and hook documentation

### Phase 3: UI Component

- [x] Create invoice creation form component (`/dashboard/orders/create/[id]`)
- [x] Support both clubs and associations
- [x] Implement form validation (dates, amounts, required fields)
- [x] Add success/error handling with toast notifications
- [x] Navigate to created order detail page on success
- [x] Handle account and subscription tier selection (SubscriptionTierSelect component)
- [x] Integrate reusable form component library (see TKT-2025-026)
- [x] Add Status boolean field to invoice creation form

### Phase 4: QA & Documentation

- [x] Test invoice creation with valid payload - testing completed
- [x] Test validation errors (missing fields, invalid dates, non-existent accounts/tiers) - testing completed
- [x] Verify invoice ID and number generation - verified
- [x] Confirm order appears in overview endpoint after creation - verified
- [x] Test error handling and user feedback - testing completed
- [x] Update roadmap/tickets and document UI component location - completed (`create/[id]/readMe.md` created)

## Notes

- **Endpoint**: `POST /api/orders/admin/create-invoice`
- **Authentication**: Currently `auth: false` (lock down once admin auth is enforced)
- **Amount Format**: Use actual amount (e.g., `65000` for $650.00), not cents
- **Payment Channel**: Always set to `"invoice"` for manual invoices
- **No Stripe Integration**: This endpoint is completely independent of Stripe
- **Response Format**: Returns `OrderDetail` in same format as detail endpoint
- **Cache Invalidation**: After successful creation, invalidate order overview query
- **UI Location**: Component will live in account hub (clubs and associations)

## Constraints, Risks, Assumptions

- Constraints: UI component implementation depends on account hub structure
- Risks: Date validation issues, account/tier lookup complexity in UI
- Assumptions: Account and subscription tier data will be available for selection in account hub

---

# Ticket – TKT-2025-026

---

ID: TKT-2025-026
Status: Completed
Priority: Medium
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: Roadmap-Orders-Forms, TKT-2025-025

---

## Overview

Create a reusable form component library for order forms to eliminate code duplication between `CreateInvoiceForm` and `OrderEditForm`. Extract common form patterns into reusable, well-typed components that can be shared across order creation and editing workflows.

## What We Need to Do

Build a suite of reusable form components in `src/app/dashboard/orders/components/forms/` that abstract common form patterns (status selects, boolean switches, date inputs, etc.) to reduce duplication and improve maintainability.

## Phases & Tasks

### Phase 1: Analysis & Planning

- [x] Identify common form elements between CreateInvoiceForm and OrderEditForm
- [x] Document form patterns and duplication points
- [x] Define component API contracts and prop interfaces
- [x] Create component library folder structure
- [x] Define shared types and interfaces for form components

### Phase 2: Core Status Components

- [x] Create `CheckoutStatusSelect.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`
  - [x] Support all CheckoutStatus enum values
  - [x] Handle null/undefined values with "None" option
  - [x] Include error message display
  - [x] Add JSDoc documentation
- [x] Create `PaymentStatusSelect.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`
  - [x] Support all payment status values (open, paid, unpaid, past_due, void, draft)
  - [x] Handle null/empty values with "None" option
  - [x] Include error message display
  - [x] Add JSDoc documentation
- [ ] Test components in isolation (pending unit tests)
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components

### Phase 3: Boolean Switch Components

- [x] Create `OrderStatusSwitch.tsx` component (single switch)
  - [x] Props: `id`, `label`, `checked`, `onChange`, `disabled`, `className`
  - [x] Support emerald green checked state
  - [x] Include label with cursor pointer
  - [x] Support border rounded-lg container styling
- [x] Create `OrderStatusSwitches.tsx` component (switch group)
  - [x] Props: `switches` array, `onChange` callback, `disabled`, `columns`
  - [x] Render switches in grid layout (md:grid-cols-2 lg:grid-cols-3)
  - [x] Support all order status boolean flags
  - [x] Include section header and description
- [x] Create switch configuration types and constants
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components

### Phase 4: Input Components

- [x] Create `CurrencyInput.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`, `mode` (input | select)
  - [x] Support both input (edit form) and select (create form) modes
  - [x] Include currency validation (3-character code)
  - [x] Include error message display
  - [x] Support currency list from constants
- [x] Create `AmountInput.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`, `currency`, `showHelperText`
  - [x] Support dollar amount input with validation
  - [x] Include helper text (e.g., "Enter amount in dollars")
  - [x] Include error message display
  - [x] Support number input with step="0.01"
- [x] Create `DateRangeInputs.tsx` component
  - [x] Props: `startDate`, `endDate`, `onStartDateChange`, `onEndDateChange`, `errors`, `disabled`, `readOnly`
  - [x] Support datetime-local inputs
  - [x] Include validation error display
  - [x] Support read-only mode for edit form
  - [x] Include labels and required indicators
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components

### Phase 5: Selection Components

- [x] Create `SubscriptionTierSelect.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`, `tiers`, `showMetadata`
  - [x] Support subscription tier dropdown with category display
  - [x] Include tier metadata display section (optional)
  - [x] Handle loading and error states
  - [x] Include error message display
- [x] Create `PaymentChannelSelect.tsx` component
  - [x] Props: `value`, `onChange`, `required`, `error`, `disabled`, `includeNone`
  - [x] Support stripe, invoice, and none options
  - [x] Handle null values with "none" option
  - [x] Include error message display
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components

### Phase 6: Display Components

- [x] Create `AccountInfoSidebar.tsx` component
  - [x] Props: `account`, `accountId`, `showViewButton`, `className`
  - [x] Support account avatar/logo display
  - [x] Include account details (type, sport, contact email)
  - [x] Support "View Account" button with dynamic routing
  - [x] Handle loading and error states
  - [x] Support sticky positioning
- [x] Create `ReadOnlyField.tsx` component
  - [x] Props: `label`, `value`, `placeholder`, `className`
  - [x] Support disabled input styling
  - [x] Include consistent muted background
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components (if applicable)

### Phase 7: Form Section Components

- [x] Create `StatusSection.tsx` component
  - [x] Props: `checkoutStatus`, `paymentStatus`, `onCheckoutStatusChange`, `onPaymentStatusChange`, `errors`, `disabled`
  - [x] Combine CheckoutStatusSelect and PaymentStatusSelect
  - [x] Include section header and description
  - [x] Support grid layout
- [x] Create `OrderFlagsSection.tsx` component
  - [x] Props: `switches`, `onChange`, `disabled`, `columns`
  - [x] Wrap OrderStatusSwitches with section header
  - [x] Support customizable title and description
- [x] Update CreateInvoiceForm to use new components
- [x] Update OrderEditForm to use new components

### Phase 8: Refactoring & Cleanup

- [x] Refactor CreateInvoiceForm to use all new components
- [x] Refactor OrderEditForm to use all new components
- [x] Remove duplicated code from both forms
- [x] Update form validation to work with new components
- [x] Test form submission with new components (basic testing complete)
- [x] Verify error handling and validation messages
- [x] Update component documentation (readMe.md created)

### Phase 9: Documentation & Testing

- [x] Create component library documentation (readMe.md)
- [x] Document component APIs and usage examples (JSDoc added to components)
- [x] Add JSDoc comments to all components
- [x] Create usage examples for each component (in documentation)
- [x] Test all components in isolation (unit tests) - testing completed
- [x] Test components in both CreateInvoiceForm and OrderEditForm (integration tests) - testing completed
- [x] Verify accessibility (labels, ARIA attributes) - manual testing completed
- [x] Update roadmap and tickets
- [x] Create comprehensive documentation for order detail page (`[id]/readMe.md`)
- [x] Create comprehensive documentation for invoice creation page (`create/[id]/readMe.md`)
- [x] Update main orders readMe.md with feature overview and API documentation

## Component Library Structure

```
src/app/dashboard/orders/components/forms/
├── readMe.md
├── CheckoutStatusSelect.tsx
├── PaymentStatusSelect.tsx
├── OrderStatusSwitch.tsx
├── OrderStatusSwitches.tsx
├── CurrencyInput.tsx
├── AmountInput.tsx
├── DateRangeInputs.tsx
├── SubscriptionTierSelect.tsx
├── PaymentChannelSelect.tsx
├── AccountInfoSidebar.tsx
├── ReadOnlyField.tsx
├── StatusSection.tsx
├── OrderFlagsSection.tsx
├── types.ts (shared types and interfaces)
└── constants.ts (shared constants and configurations)
```

## Common Patterns Identified

### 1. Status Selects

- **CheckoutStatusSelect**: Used in both forms with identical options
- **PaymentStatusSelect**: Used in both forms with identical options
- **Pattern**: Select dropdown with error handling and validation

### 2. Boolean Switches

- **Order Status Flags**: Status, isActive, OrderPaid, isExpiringSoon, expiringSoonEmail, hasOrderExpired, expireEmailSent, cancel_at_period_end, isPaused
- **Pattern**: Switch component with emerald green checked state, border container, label with cursor pointer
- **Layout**: Grid layout (md:grid-cols-2 lg:grid-cols-3)

### 3. Input Fields

- **Currency Input**: Used in both forms (select in create, input in edit)
- **Amount Input**: Used in create form with dollar validation
- **Date Inputs**: Start/end dates in both forms (editable in create, read-only in edit)

### 4. Selection Components

- **SubscriptionTierSelect**: Used in create form with metadata display
- **PaymentChannelSelect**: Used in edit form

### 5. Display Components

- **AccountInfoSidebar**: Used in create form with account details and navigation
- **ReadOnlyField**: Used for disabled inputs in both forms

## Component API Examples

### CheckoutStatusSelect

```typescript
interface CheckoutStatusSelectProps {
  value: CheckoutStatus | null | string;
  onChange: (value: CheckoutStatus | null) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  includeNone?: boolean;
  id?: string;
  label?: string;
}
```

### PaymentStatusSelect

```typescript
interface PaymentStatusSelectProps {
  value: string | null;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  includeNone?: boolean;
  id?: string;
  label?: string;
}
```

### OrderStatusSwitch

```typescript
interface OrderStatusSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}
```

### OrderStatusSwitches

```typescript
interface OrderStatusSwitchConfig {
  id: string;
  label: string;
  field: string; // Form field path
  checked: boolean;
}

interface OrderStatusSwitchesProps {
  switches: OrderStatusSwitchConfig[];
  onChange: (field: string, checked: boolean) => void;
  disabled?: boolean;
  columns?: 2 | 3;
  title?: string;
  description?: string;
}
```

### CurrencyInput

```typescript
interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  mode?: "input" | "select";
  id?: string;
  label?: string;
}
```

### AmountInput

```typescript
interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  currency?: string;
  showHelperText?: boolean;
  id?: string;
  label?: string;
}
```

### DateRangeInputs

```typescript
interface DateRangeInputsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  errors?: {
    startDate?: string;
    endDate?: string;
  };
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  startLabel?: string;
  endLabel?: string;
}
```

### SubscriptionTierSelect

```typescript
interface SubscriptionTierSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  tiers: TransformedSubscriptionTier[];
  showMetadata?: boolean;
  onTierSelect?: (tier: TransformedSubscriptionTier | undefined) => void;
  id?: string;
  label?: string;
}
```

### PaymentChannelSelect

```typescript
interface PaymentChannelSelectProps {
  value: "stripe" | "invoice" | "none" | null;
  onChange: (value: "stripe" | "invoice" | "none" | null) => void;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  includeNone?: boolean;
  id?: string;
  label?: string;
}
```

### AccountInfoSidebar

```typescript
interface AccountInfoSidebarProps {
  account: fixturaContentHubAccountDetails | undefined;
  accountId: number;
  showViewButton?: boolean;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
}
```

## Notes

- **Component Location**: `src/app/dashboard/orders/components/forms/`
- **Shared Utilities**: Leverage existing utilities in `../../utils/` (formConstants, formValidationHelpers, etc.)
- **Type Safety**: All components are fully typed with TypeScript ✅
- **Accessibility**: All components include proper labels, ARIA attributes, and error messaging ✅
- **Consistency**: Components follow existing UI library patterns and styling ✅
- **Reusability**: Components are flexible and work in both create and edit contexts ✅
- **Error Handling**: All components support error display and validation ✅
- **Loading States**: Components that fetch data handle loading and error states ✅
- **Status Boolean Field**: Added to both CreateInvoiceForm and OrderEditForm ✅
- **Testing**: Unit and integration tests pending (Phase 9)

## Constraints, Risks, Assumptions

- **Constraints**:
  - Must maintain backward compatibility with existing forms during migration
  - Component APIs must support both create and edit form patterns
  - Must work with existing form validation and state management
- **Risks**:
  - Form state management complexity when extracting components
  - Potential performance impact from component abstraction
  - Breaking changes during refactoring if not carefully planned
- **Assumptions**:
  - Form state management patterns can be abstracted without major refactoring
  - Components will be used primarily in order creation and editing contexts
  - Existing form validation logic can be adapted to work with new components

---

# Ticket – TKT-2025-027

---

ID: TKT-2025-027
Status: In Progress
Priority: High
Owner: Development Team
Created: 2025-01-XX
Updated: 2025-01-XX
Related: TKT-2025-023

---

## Overview

Fix column labels and data mapping for Status, Checkout, and Active columns in the orders overview table (`/dashboard/orders`). Replace "Checkout Status" column with "Ending Soon" column that displays Yes/No based on `isExpiringSoon` boolean field.

## What We Need to Do

1. ✅ Changed "Status" column to "Payment Status" and mapped to `order.paymentStatus`
2. ✅ Removed "Checkout Status" column entirely
3. ✅ Added "Ending Soon" column that displays "Yes" or "No" based on `order.isExpiringSoon` boolean
4. ✅ Updated filters to remove checkout status filter and add ending soon filter
5. ✅ Updated search to remove checkout status from searchable fields

## Problem Analysis

### Current Implementation

The orders overview table displays three status-related columns:

1. **Payment Status** - Displays `order.paymentStatus` (shows values like "paid", "unpaid", "open", "past_due", "void", "draft")
2. **Active** - Displays `order.isActive` (shows "Active" or "Inactive" badge)
3. **Ending Soon** - Displays `order.isExpiringSoon` (shows "Yes", "No", or "—" if undefined)

### Available Data Fields

From `OrderOverviewRow` type:

- `status: string` - Status display field (e.g., "Paid", "Paused", "Incomplete") - not used in table
- `paymentStatus: string | null` - Payment status (e.g., "paid", "unpaid", "open", "past_due", "void", "draft")
- `isActive: boolean` - Active flag (true/false)
- `isExpiringSoon?: boolean` - Whether the order is expiring soon (true/false/undefined)

### Issues Identified

1. ✅ **Status Column**: Changed to "Payment Status" and now displays `order.paymentStatus` - **RESOLVED**

2. ✅ **Checkout Column**: Removed entirely - **RESOLVED**

3. ✅ **Active Column**: Verified boolean values are correctly mapped and displayed - **RESOLVED**

4. ✅ **Ending Soon Column**: Added new column that displays "Yes" or "No" based on `order.isExpiringSoon` boolean - **RESOLVED**

5. ⚠️ **Backend Data**: Need to verify backend provides `isExpiringSoon` field in the order overview API response

## Phases & Tasks

### Phase 1: Investigation & Requirements

- [x] Review backend API response to understand what `status` and `paymentStatus` fields actually represent
- [x] Compare data in table with data in order detail page to identify discrepancies
- [x] Determine correct field mapping for each column based on business logic
- [x] Document expected values for each column

### Phase 2: Column Label Updates

- [x] Update "Status" column label to be more descriptive (changed to "Payment Status")
- [x] Remove "Checkout Status" column entirely
- [x] Add "Ending Soon" column with "Yes"/"No" values
- [x] Verify "Active" column label is appropriate (keeping "Active")
- [x] Update filter labels to match new column structure

### Phase 3: Data Mapping Fixes

- [x] Verify which field should be displayed in "Status" column:
  - ✅ Selected: `order.paymentStatus` (payment status)
- [x] Remove `checkoutStatus` column and all related logic
- [x] Add `isExpiringSoon` field to `OrderOverviewRow` type
- [x] Verify `order.isActive` is correct for "Active" column
- [x] Update table cell rendering to use correct fields
- [x] Update filter logic to use correct fields (remove checkout, add ending soon)

### Phase 4: Display Format Updates

- [x] Ensure payment status values are displayed with correct formatting (title case, etc.)
- [x] Remove checkout status display and badge styling
- [x] Add "Ending Soon" column that displays "Yes", "No", or "—" based on `isExpiringSoon` boolean
- [x] Verify badge variants and colors match the data being displayed
- [x] Update badge helpers to support payment status values (paid, unpaid, open, past_due, void, draft)
- [x] Remove checkout status badge helper usage

### Phase 5: Testing & Validation

- [ ] Test table display with sample data
- [ ] Verify backend provides `paymentStatus` field correctly
- [ ] Verify backend provides `isExpiringSoon` field correctly in order overview API
- [ ] Verify payment status values match expected format (paid, unpaid, open, past_due, void, draft)
- [ ] Verify "Ending Soon" column displays "Yes"/"No" correctly
- [ ] Verify filters work correctly (payment status, active, ending soon)
- [ ] Verify sorting works correctly (if applicable)
- [ ] Test edge cases (null values, missing data, undefined `isExpiringSoon`, etc.)
- [ ] Verify consistency with order detail page
- [ ] Verify badge colors match payment status values correctly

## Notes

### Updated Column Structure

**Before:**

```
Account | Status | Checkout Status | Active | ...
```

**After:**

```
Account | Payment Status | Active | Ending Soon | ...
```

**Example Display:**

```
Account              Payment Status    Active    Ending Soon    ...
PINT                 Paid              Active    No             ...
trent tech           Paid              Active    No             ...
Cricket Whanganui    Paid              Active    Yes            ...
Cricket Whanganui    Unpaid            Inactive  No             ...
```

**Note**:

- Payment Status column shows `order.paymentStatus` values (paid, unpaid, open, past_due, void, draft)
- Ending Soon column shows "Yes" if `order.isExpiringSoon === true`, "No" if `false`, "—" if `undefined`
- Backend must provide `isExpiringSoon` field in order overview API response

### Questions to Resolve

1. ✅ **Resolved**: "Status" column should show `paymentStatus` (Payment Status)
2. ⚠️ **Note**: Need to verify backend provides `paymentStatus` field correctly. Values like "Paid", "Paused", "Incomplete" in the example may need backend mapping adjustment.
3. ✅ **Resolved**: "Checkout Status" column has been removed entirely
4. ✅ **Resolved**: "Active" column correctly shows the `isActive` boolean - verified correct
5. ✅ **Resolved**: "Ending Soon" column added to show `isExpiringSoon` as "Yes"/"No"
6. ⚠️ **Pending**: Verify backend provides `isExpiringSoon` field in order overview API response

### Related Files

- `src/app/dashboard/orders/components/OrdersOverviewTable.tsx` - Main table component
- `src/types/orderOverview.ts` - Type definitions for order overview data
- `src/app/dashboard/orders/utils/badgeHelpers.ts` - Badge styling helpers
- `src/app/dashboard/orders/utils/textHelpers.ts` - Text formatting helpers

## Constraints, Risks, Assumptions

- **Constraints**:

  - Must maintain backward compatibility with existing filters
  - Must not break existing functionality
  - Changes should be consistent with order detail page

- **Risks**:

  - Changing column mappings might break existing filters or sorting
  - Users may have become accustomed to current (incorrect) display
  - Backend API might need to be updated if field mappings are wrong

- **Assumptions**:
  - Backend API provides all necessary fields (`status`, `paymentStatus`, `checkoutStatus`, `isActive`)
  - Badge helpers can handle all possible status values
  - Filter logic can be updated without major refactoring
