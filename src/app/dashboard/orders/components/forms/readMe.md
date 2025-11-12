# Folder Overview

This folder contains reusable form components for order creation and editing. These components abstract common form patterns to reduce duplication and improve maintainability.

## Files

- `types.ts`: Shared TypeScript types and interfaces for all form components
- `constants.ts`: Shared constants, configurations, and default values
- `index.ts`: Central export point for types, constants, and components
- `CheckoutStatusSelect.tsx`: Reusable checkout status dropdown ✅
- `PaymentStatusSelect.tsx`: Reusable payment status dropdown ✅
- `OrderStatusSwitch.tsx`: Reusable single boolean switch component ✅
- `OrderStatusSwitches.tsx`: Reusable boolean switch group for order status flags ✅
- `CurrencyInput.tsx`: Reusable currency input/select component ✅
- `DateRangeInputs.tsx`: Reusable start/end date inputs ✅
- `AmountInput.tsx`: Reusable amount input with validation ✅
- `SubscriptionTierSelect.tsx`: Reusable subscription tier select with metadata display ✅
- `PaymentChannelSelect.tsx`: Reusable payment channel select ✅
- `AccountInfoSidebar.tsx`: Reusable account information sidebar component ✅
- `ReadOnlyField.tsx`: Reusable read-only field component ✅
- `StatusSection.tsx`: Combined status section component ✅
- `OrderFlagsSection.tsx`: Combined order flags section component ✅

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: `CreateInvoiceForm.tsx`, `OrderEditForm.tsx`
- Key dependencies: `../../utils/` for form helpers and validation

## Dependencies

- Internal: `../../utils/formConstants.ts`, `../../utils/formValidationHelpers.ts`, `../../utils/subscriptionTierHelpers.ts`
- External: `@/components/ui` (Select, Input, Label, Switch, etc.), `@/components/ui-library`

---

## Component Usage Examples

### Status Components

#### CheckoutStatusSelect

```tsx
import { CheckoutStatusSelect } from "@/app/dashboard/orders/components/forms";

// In CreateInvoiceForm (required field)
<CheckoutStatusSelect
  value={formData.checkoutStatus}
  onChange={(value) => setFormData({ ...formData, checkoutStatus: value })}
  required
  error={errors.checkoutStatus}
  includeNone={false}
/>

// In OrderEditForm (optional field)
<CheckoutStatusSelect
  value={formData.status.checkoutStatus}
  onChange={(value) => setFormData({
    ...formData,
    status: { ...formData.status, checkoutStatus: value }
  })}
  required={false}
  includeNone={true}
/>
```

#### PaymentStatusSelect

```tsx
import { PaymentStatusSelect } from "@/app/dashboard/orders/components/forms";

// In CreateInvoiceForm (required field)
<PaymentStatusSelect
  value={formData.payment_status}
  onChange={(value) => setFormData({ ...formData, payment_status: value })}
  required
  error={errors.payment_status}
  includeNone={false}
/>

// In OrderEditForm (optional field)
<PaymentStatusSelect
  value={formData.payment.status}
  onChange={(value) => setFormData({
    ...formData,
    payment: { ...formData.payment, status: value || "" }
  })}
  required={false}
  includeNone={true}
/>
```

#### StatusSection (Combined)

```tsx
import { StatusSection } from "@/app/dashboard/orders/components/forms";

// Combines CheckoutStatusSelect and PaymentStatusSelect
<StatusSection
  checkoutStatus={formData.checkoutStatus}
  paymentStatus={formData.payment_status}
  onCheckoutStatusChange={(value) => setFormData({ ...formData, checkoutStatus: value })}
  onPaymentStatusChange={(value) => setFormData({ ...formData, payment_status: value })}
  errors={{
    checkoutStatus: errors.checkoutStatus,
    paymentStatus: errors.payment_status,
  }}
  required={true}
  includeNone={false}
/>
```

### Boolean Switch Components

#### OrderStatusSwitch (Single)

```tsx
import { OrderStatusSwitch } from "@/app/dashboard/orders/components/forms";

<OrderStatusSwitch
  id="is-active"
  label="Is Active"
  checked={formData.isActive}
  onChange={(checked) => setFormData({ ...formData, isActive: checked })}
/>
```

#### OrderStatusSwitches (Group)

```tsx
import { OrderStatusSwitches } from "@/app/dashboard/orders/components/forms";

<OrderStatusSwitches
  switches={[
    { id: "status", label: "Status", field: "Status", checked: formData.Status },
    { id: "is-active", label: "Is Active", field: "isActive", checked: formData.isActive },
    { id: "order-paid", label: "Order Paid", field: "OrderPaid", checked: formData.OrderPaid },
  ]}
  onChange={(field, checked) => setFormData({ ...formData, [field]: checked })}
  columns={3}
/>
```

#### OrderFlagsSection (Combined)

```tsx
import { OrderFlagsSection } from "@/app/dashboard/orders/components/forms";

<OrderFlagsSection
  switches={[
    { id: "status", label: "Status", field: "Status", checked: formData.Status },
    { id: "is-active", label: "Is Active", field: "isActive", checked: formData.isActive },
    // ... more switches
  ]}
  onChange={(field, checked) => setFormData({ ...formData, [field]: checked })}
  columns={3}
  title="Order Status & Flags"
  description="Configure order status and expiration flags for this order."
/>
```

### Input Components

#### CurrencyInput

```tsx
import { CurrencyInput } from "@/app/dashboard/orders/components/forms";

// Select mode (CreateInvoiceForm)
<CurrencyInput
  value={formData.currency}
  onChange={(value) => setFormData({ ...formData, currency: value })}
  mode="select"
  required
  error={errors.currency}
/>

// Input mode (OrderEditForm)
<CurrencyInput
  value={formData.currency}
  onChange={(value) => setFormData({ ...formData, currency: value })}
  mode="input"
  required={false}
/>
```

#### AmountInput

```tsx
import { AmountInput } from "@/app/dashboard/orders/components/forms";

<AmountInput
  value={formData.amount}
  onChange={(value) => setFormData({ ...formData, amount: value })}
  required
  error={errors.amount}
  currency={formData.currency}
  showHelperText
  placeholder="650.00"
/>
```

#### DateRangeInputs

```tsx
import { DateRangeInputs } from "@/app/dashboard/orders/components/forms";

// Editable mode (CreateInvoiceForm)
<DateRangeInputs
  startDate={formData.startDate}
  endDate={formData.endDate}
  onStartDateChange={(value) => setFormData({ ...formData, startDate: value })}
  onEndDateChange={(value) => setFormData({ ...formData, endDate: value })}
  errors={{
    startDate: errors.startDate,
    endDate: errors.endDate,
  }}
  required
/>

// Read-only mode (OrderEditForm)
<DateRangeInputs
  startDate={formData.schedule.startOrderAt}
  endDate={formData.schedule.endOrderAt}
  onStartDateChange={() => {}} // No-op for read-only
  onEndDateChange={() => {}} // No-op for read-only
  readOnly={true}
  startLabel="Start Date"
  endLabel="End Date"
/>
```

### Selection Components

#### SubscriptionTierSelect

```tsx
import { SubscriptionTierSelect } from "@/app/dashboard/orders/components/forms";
import { useSubscriptionTiers } from "@/hooks/subscription-tiers/useSubscriptionTiers";
import { transformSubscriptionTiers } from "../../../utils/subscriptionTierHelpers";

const { data: subscriptionTiersData } = useSubscriptionTiers();
const subscriptionTiers = transformSubscriptionTiers(subscriptionTiersData?.data);

<SubscriptionTierSelect
  value={formData.subscriptionTierId}
  onChange={(value) => setFormData({ ...formData, subscriptionTierId: value })}
  tiers={subscriptionTiers}
  showMetadata={true}
  required
  error={errors.subscriptionTierId}
  isLoading={isSubscriptionTiersLoading}
/>
```

#### PaymentChannelSelect

```tsx
import { PaymentChannelSelect } from "@/app/dashboard/orders/components/forms";

<PaymentChannelSelect
  value={formData.payment.channel === "none" ? null : formData.payment.channel}
  onChange={(value) => setFormData({
    ...formData,
    payment: { ...formData.payment, channel: value === null ? "none" : value }
  })}
  includeNone={true}
  required={false}
/>
```

### Display Components

#### ReadOnlyField

```tsx
import { ReadOnlyField } from "@/app/dashboard/orders/components/forms";

<ReadOnlyField
  label="Order Name"
  value={formData.name}
  id="order-name"
  placeholder="Order name"
/>

<ReadOnlyField
  label="Account ID"
  value={accountId}
  id="account-id"
/>
```

#### AccountInfoSidebar

```tsx
import { AccountInfoSidebar } from "@/app/dashboard/orders/components/forms";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { Button } from "@/components/ui/button";

const { data: accountData, isLoading, error } = useAccountQuery(accountId.toString());
const account = accountData?.data;

<AccountInfoSidebar
  account={account}
  accountId={accountId}
  showViewButton={true}
  isLoading={isLoading}
  error={error || undefined}
  actionButtons={
    <>
      <Button type="submit" variant="primary" form="order-form">
        Save Changes
      </Button>
      <Button type="button" variant="accent" onClick={onCancel}>
        Cancel
      </Button>
    </>
  }
/>
```

---

## Common Patterns

### Form State Management

All components work with React state management. Forms typically use `useState` to manage form data:

```tsx
const [formData, setFormData] = useState({
  subscriptionTierId: "",
  amount: "",
  currency: "AUD",
  startDate: "",
  endDate: "",
  checkoutStatus: "incomplete",
  payment_status: "open",
  Status: false,
  isActive: false,
  // ... more fields
});
```

### Error Handling

Components support error display through the `error` prop:

```tsx
const [errors, setErrors] = useState({});

// Validation
const validationErrors = validateInvoiceForm(formData);
setErrors(validationErrors);

// Component usage
<AmountInput
  value={formData.amount}
  onChange={(value) => setFormData({ ...formData, amount: value })}
  error={errors.amount}
  required
/>
```

### Nested Form State

Some forms have nested state structures (e.g., `status`, `payment`). Use spread operators to update nested fields:

```tsx
// Update nested status field
setFormData({
  ...formData,
  status: {
    ...formData.status,
    checkoutStatus: value,
  },
});

// Update nested payment field
setFormData({
  ...formData,
  payment: {
    ...formData.payment,
    status: value || "",
  },
});
```

### Integration with Form Libraries

Components are designed to work with native HTML forms and can be integrated with form libraries like React Hook Form:

```tsx
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

const { control } = useForm();

<Controller
  name="checkoutStatus"
  control={control}
  render={({ field, fieldState }) => (
    <CheckoutStatusSelect
      value={field.value}
      onChange={field.onChange}
      error={fieldState.error?.message}
      required
    />
  )}
/>
```

---

## Data Dependencies

### Required Hooks

- `useSubscriptionTiers()`: Fetches subscription tiers for `SubscriptionTierSelect`
- `useAccountQuery(accountId)`: Fetches account details for `AccountInfoSidebar`

### Required Utilities

- `transformSubscriptionTiers()`: Transforms subscription tier data for dropdown
- `validateInvoiceForm()`: Validates form data
- `getDefaultInvoiceDates()`: Provides default date values
- `calculateEndDateFromDaysInPass()`: Calculates end date from subscription tier

### API Endpoints

- `GET /api/subscription-tiers`: Fetches subscription tiers
- `GET /api/accounts/:id`: Fetches account details
- `POST /api/orders/admin/create-invoice`: Creates invoice
- `POST /api/orders/admin/:id`: Updates order

---

## Edge Cases & Considerations

### Null/Undefined Values

- `CheckoutStatusSelect` and `PaymentStatusSelect` handle `null` values with "None" option when `includeNone={true}`
- `PaymentChannelSelect` converts `null` to "none" internally
- All components provide default values to prevent undefined errors

### Date Handling

- Dates are stored as ISO strings in form state
- `DateRangeInputs` uses `datetime-local` input type (requires `YYYY-MM-DDTHH:mm` format)
- Read-only dates are displayed but cannot be edited

### Currency Formatting

- `CurrencyInput` in input mode accepts 3-character uppercase codes
- `AmountInput` expects dollar amounts (e.g., "650.00" for $650.00)
- Backend expects amounts in cents (e.g., 65000 for $650.00)

### Loading States

- `SubscriptionTierSelect` shows loading state when `isLoading={true}`
- `AccountInfoSidebar` shows loading state when `isLoading={true}`
- Other components are synchronous and don't require loading states

### Validation

- All required fields are validated before form submission
- Date validation ensures `endDate` is after `startDate`
- Amount validation ensures positive values
- Currency validation ensures 3-character codes

### Accessibility

- All components include proper `label` elements
- Error messages use `role="alert"` for screen readers
- Disabled states are properly handled
- Keyboard navigation is supported for all interactive elements
