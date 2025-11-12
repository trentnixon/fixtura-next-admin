# Folder Overview

Dynamic route for creating a new invoice order for a specific account. This page provides a form for admins to manually create invoice orders with all required fields and validation.

## Files

- `page.tsx`: Main page component that renders the invoice creation form for a specific account ID.
- `components/CreateInvoiceForm.tsx`: Form component for creating invoice orders. Uses reusable form component library.

## Relations

- Parent folder: [../../readMe.md](../../readMe.md)
- Consumed by: Navigations from account hub (club/association account pages)
- Key dependencies: `@/components/scaffolding`, `@/hooks/orders/useAdminCreateInvoice`, `@/hooks/accounts/useAccountQuery`, `@/hooks/subscription-tiers/useSubscriptionTiers`, `@/app/dashboard/orders/components/forms`

## Dependencies

- Internal: `@/components/scaffolding/containers`, `@/hooks/orders/useAdminCreateInvoice`, `@/hooks/accounts/useAccountQuery`, `@/hooks/subscription-tiers/useSubscriptionTiers`, `@/lib/services/orders/createAdminInvoice`, `@/app/dashboard/orders/components/forms`, `@/app/dashboard/orders/utils`, `@/components/ui` (Button, Separator), `@/components/ui-library`
- External: `@tanstack/react-query`, `sonner` (toast notifications), `next/navigation`

---

## Implementation Details

### Page Structure

The invoice creation page (`page.tsx`) accepts an account ID parameter from the URL (`/dashboard/orders/create/[id]`) and renders the `CreateInvoiceForm` component with the account ID.

### CreateInvoiceForm

The form uses the reusable form component library from `@/app/dashboard/orders/components/forms`:
- **ReadOnlyField**: Account ID (read-only)
- **SubscriptionTierSelect**: Subscription tier selection with metadata display
- **AmountInput**: Invoice amount input with currency helper text
- **CurrencyInput**: Currency selection (select mode)
- **DateRangeInputs**: Start and end date inputs
- **StatusSection**: Checkout status and payment status selects
- **OrderFlagsSection**: All boolean status flags
- **AccountInfoSidebar**: Account information sidebar with action buttons

#### Required Fields

- Account ID (from URL parameter)
- Subscription Tier ID
- Amount (in dollars)
- Currency
- Start Date
- End Date
- Checkout Status
- Payment Status

#### Optional Fields

- Status (boolean, defaults to false)
- isActive (boolean, defaults to false)
- OrderPaid (boolean, defaults to false)
- isExpiringSoon (boolean, defaults to false)
- expiringSoonEmail (boolean, defaults to false)
- hasOrderExpired (boolean, defaults to false)
- expireEmailSent (boolean, defaults to false)
- cancel_at_period_end (boolean, defaults to false)
- isPaused (boolean, defaults to false)

#### Auto-Populated Fields

- **Due Date**: Automatically set to today's date
- **Days Until Due**: Automatically set to 30 days
- **Amount**: Auto-populated from selected subscription tier
- **Currency**: Auto-populated from selected subscription tier
- **End Date**: Auto-calculated from start date + subscription tier's days in pass

### Data Flow

1. **Fetch Account**: `useAccountQuery(accountId)` fetches account details for display
2. **Fetch Subscription Tiers**: `useSubscriptionTiers()` fetches available subscription tiers
3. **Transform Tiers**: `transformSubscriptionTiers()` transforms tier data for dropdown
4. **Auto-Populate**: `useEffect` hooks auto-populate amount, currency, and end date from selected tier
5. **Validate Form**: `validateInvoiceForm()` validates all required fields and date logic
6. **Create Invoice**: `useAdminCreateInvoice()` mutation creates invoice via `/api/orders/admin/create-invoice`
7. **Navigate**: On success, navigates to the created order detail page

### Form Validation

Validation is performed client-side before submission:
- **Required Fields**: All required fields must be filled
- **Date Validation**: End date must be after start date
- **Amount Validation**: Amount must be a positive number
- **Currency Validation**: Currency must be a valid 3-character code
- **Subscription Tier**: Must select a valid subscription tier

### Error Handling

- Loading states: Skeleton loading for account and subscription tiers
- Error states: ErrorState component for account or subscription tier errors
- Validation errors: Displayed below each field with error message
- API errors: Toast notification with error message
- Success feedback: Toast notification with success message and order ID

### Auto-Population Logic

When a subscription tier is selected:
1. **Amount**: Set to tier's price (formatted to 2 decimal places, e.g., "140.00")
2. **Currency**: Set to tier's currency
3. **End Date**: Calculated from start date + tier's `daysInPass` using `calculateEndDateFromDaysInPass()`

The auto-population uses `useEffect` hooks that watch for changes in:
- `selectedTier.id`
- `selectedTier.daysInPass`
- `selectedTier.price`
- `selectedTier.currency`
- `formData.startDate`

### Account Information Sidebar

The sidebar displays:
- Account avatar/logo (from `accountOrganisationDetails.ParentLogo`)
- Account holder name (FirstName + LastName)
- Organization name (from `accountOrganisationDetails.Name`)
- Account type (Club or Association)
- Sport
- Contact email (clickable mailto: link)
- "View Account" button (navigates to club/association account page)
- Action buttons (Cancel and Create Invoice)

---

## API Integration

### POST /api/orders/admin/create-invoice

Creates a new invoice order. Payload includes:

#### Required Fields

- `accountId`: Account ID (number)
- `subscriptionTierId`: Subscription tier ID (number)
- `amount`: Invoice amount in cents (number, e.g., 65000 for $650.00)
- `currency`: Currency code (string, e.g., "AUD")
- `startDate`: Order start date (ISO date string)
- `endDate`: Order end date (ISO date string)
- `dueDate`: Invoice due date (ISO date string, set to today)
- `daysUntilDue`: Days until due (number, set to 30)
- `checkoutStatus`: Checkout status (string, e.g., "incomplete")
- `payment_status`: Payment status (string, e.g., "open")

#### Optional Fields

- `Status`: Status boolean (boolean, defaults to false)
- `isActive`: Active flag (boolean, defaults to false)
- `OrderPaid`: Order paid flag (boolean, defaults to false)
- `isExpiringSoon`: Expiring soon flag (boolean, defaults to false)
- `expiringSoonEmail`: Expiring soon email sent flag (boolean, defaults to false)
- `hasOrderExpired`: Expired flag (boolean, defaults to false)
- `expireEmailSent`: Expire email sent flag (boolean, defaults to false)
- `cancel_at_period_end`: Cancel at period end flag (boolean, defaults to false)
- `isPaused`: Paused flag (boolean, defaults to false)

#### Response

Returns `AdminCreateInvoiceResponse` with:
- `message`: "Invoice created successfully"
- `order`: Created order (OrderDetail type)

### GET /api/accounts/:id

Fetches account details for display in the sidebar.

### GET /api/subscription-tiers

Fetches available subscription tiers for the dropdown.

---

## Edge Cases & Considerations

### Missing Account

- If account ID is invalid or account not found, ErrorState is displayed
- Account query is disabled if account ID is missing

### Missing Subscription Tiers

- If subscription tiers fail to load, ErrorState is displayed
- Subscription tier dropdown shows "No subscription tiers available" when empty
- Form submission is disabled if no tiers are available

### Date Calculations

- End date is calculated from start date + subscription tier's `daysInPass`
- If start date changes after tier selection, end date is recalculated
- If tier changes, end date is recalculated based on new tier's `daysInPass`
- Date validation ensures end date is after start date

### Amount Formatting

- User enters amount in dollars (e.g., "650.00")
- Backend expects amount in cents (e.g., 65000)
- Conversion is handled by `unitsToCents()` utility function
- Amount is auto-populated from tier's price (formatted to 2 decimal places)

### Currency Handling

- Currency is auto-populated from selected subscription tier
- Currency input uses select mode with predefined currency options
- Currency is validated to ensure it's a valid 3-character code

### Form State Management

- Form state is managed with `useState` hook
- Default form state is created using `createDefaultFormState()` utility
- Default dates are generated using `getDefaultInvoiceDates()` utility
- Form validation errors are stored in separate `errors` state

### Navigation

- On success, navigates to `/dashboard/orders/${response.order.id}`
- On cancel, navigates back using `router.back()`
- "View Account" button navigates to `/dashboard/accounts/club/${accountId}` or `/dashboard/accounts/association/${accountId}`

### Cache Management

- After successful invoice creation, order overview query cache is invalidated
- Account query cache is not invalidated (account data doesn't change)
- Subscription tiers query cache is not invalidated (tiers don't change frequently)

### Validation Feedback

- Validation errors are displayed below each field
- Form submission is prevented if validation fails
- Toast notification is shown if form submission is attempted with errors
- Individual field errors are highlighted with red border

---

## Future Enhancements

- Add order name customization
- Add invoice description/notes field
- Add bulk invoice creation for multiple accounts
- Add invoice template selection
- Add invoice preview before creation
- Add invoice duplication from existing order
- Add invoice scheduling (create invoice for future date)

