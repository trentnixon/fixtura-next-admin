# Edit Submit Pathway Review

## Current Flow

1. **OrderEditForm.tsx** → `handleSubmit` → transforms form data to `OrderUpdatePayload`
2. **page.tsx** → `handleSave` → calls `updateOrder` mutation
3. **useAdminOrderUpdate.ts** → TanStack Query mutation → calls server action
4. **updateAdminOrder.ts** → Server action → POST `/orders/admin/:id`

## Issues Identified

### 1. Missing `status.display` Field ✅ FIXED

- **Location**: `OrderEditForm.tsx` line 89-91
- **Issue**: The form has a status display dropdown but the value was never included in the `updates` payload
- **Impact**: Status changes were not persisted to the backend
- **Fix**: Added `status` field to `OrderUpdatePayload` interface and included `updates.status = formData.status.display` in the payload mapping

### 2. Error Handling - No User Feedback ✅ FIXED

- **Location**: `page.tsx` line 53-60
- **Issue**: Errors are only logged to console, no toast notification
- **Impact**: Users don't know when saves fail
- **Fix**: Added `toast.error()` with error message description

### 3. Success Feedback - No Toast ✅ FIXED

- **Location**: `page.tsx` line 47-49
- **Issue**: No success notification when order is updated
- **Impact**: Users don't get confirmation that changes were saved
- **Fix**: Added `toast.success()` with order ID in description

### 4. Subscription Tier Mismatch ✅ FIXED

- **Location**: `OrderEditForm.tsx` (removed)
- **Issue**: Form allowed editing `subscriptionTier.name` as text input, but API expects `subscription_tier` as number ID
- **Impact**: Subscription tier updates won't work correctly (sending ID instead of name)
- **Fix**: Removed subscription tier editing field from form. Season pass type should not be changeable.

### 5. Date Timezone Handling ✅ FIXED

- **Location**: `OrderEditForm.tsx` (removed)
- **Issue**: `cancel_at` date conversion might have timezone issues when converting from `datetime-local` to ISO string
- **Impact**: Dates might be saved with incorrect timezone offset
- **Fix**: Removed `cancel_at` field from form. This field is calculated automatically when the pass expires.

### 6. Validation ⏳ FUTURE IMPROVEMENT

- **Location**: `OrderEditForm.tsx` line 71-117
- **Issue**: No form validation before submission
- **Impact**: Invalid data might be sent to API
- **Status**: API handles validation, but client-side validation would improve UX

## Recommendations

### ✅ Completed

1. ✅ Add `status.display` to the payload mapping - **FIXED**
2. ✅ Add toast notifications for success and error states - **FIXED**
3. ✅ Fix subscription tier handling - **FIXED** (removed from form)
4. ✅ Improve date handling - **FIXED** (removed cancel_at field)

### ⏳ Future Improvements (Optional)

5. **Form validation** - Add client-side validation for better UX (API already validates)
6. **Loading states** - Form is disabled during submission, but could add visual loading indicators
7. **Optimistic updates** - Consider optimistic updates for better UX
8. **Additional editable fields** - Consider adding `payment_status`, `payment_method`, `checkout_status` if business requirements change

## API Payload Fields Summary

Based on `OrderUpdatePayload` interface:

### ✅ Handled Fields (in form and payload)

- `payment_channel` - Editable dropdown
- `OrderPaid` - Editable switch
- `status` - Editable dropdown (✅ **FIXED**)
- `isActive` - Editable switch
- `isPaused` - Editable switch
- `cancel_at_period_end` - Editable switch
- `hasOrderExpired` - Editable switch
- `isExpiringSoon` - Editable switch
- `expireEmailSent` - Editable switch
- `expiringSoonEmail` - Editable switch
- `currency` - Editable input

### ⚠️ Available Fields (in payload interface but not sent)

These fields are **defined in the `OrderUpdatePayload` interface** (API accepts them), but they're **not being sent** because they're not editable in the form:

- `payment_status` - ✅ Defined in payload interface, ❌ Not in form state, ❌ Not in form UI, ❌ Not mapped in `handleSubmit`
  - Exists in `OrderDetail.payment.status`, displayed in view mode (`OrderPaymentCard`) but not editable
- `payment_method` - ✅ Defined in payload interface, ❌ Not in form state, ❌ Not in form UI, ❌ Not mapped in `handleSubmit`
  - Exists in `OrderDetail.payment.method`, displayed in view mode (`OrderPaymentCard`) but not editable
- `checkout_status` - ✅ Defined in payload interface, ❌ Not in form state, ❌ Not in form UI, ❌ Not mapped in `handleSubmit`
  - Exists in `OrderDetail.status.checkoutStatus`, not displayed or editable

**Note**: These fields can be added to the form if business requirements change. The API already supports them.

### ❌ Intentionally Not Editable

- `cancel_at` - Calculated automatically when pass expires
- `subscription_tier` - Season pass type cannot be changed
- `Name` - Order name cannot be changed
- `startOrderAt` - Start date cannot be changed
- `endOrderAt` - End date cannot be changed
- `account` - Account cannot be changed
- `customer` - Customer cannot be changed
- `total` - Total amount cannot be changed
- `invoice_id`, `invoice_number`, `hosted_invoice_url`, `invoice_pdf` - Invoice fields cannot be changed
- `Fixture_start`, `Fixture_end` - Fixture dates not in form (removed per requirements)

---

## Summary

### ✅ All Critical Issues Resolved

All critical issues in the edit submit pathway have been addressed:

1. **Status field** - Now properly included in payload
2. **User feedback** - Toast notifications for success and error states
3. **Field management** - Removed non-editable fields (subscription_tier, cancel_at)
4. **Payload mapping** - All editable fields are correctly mapped to API format

### 📊 Current Status

- **Form Fields**: 11 editable fields properly mapped
- **Payload Mapping**: All form data correctly transformed to API format
- **User Feedback**: Success and error notifications implemented
- **Error Handling**: Comprehensive error handling with user-friendly messages

### 🎯 Next Steps (Optional)

- Consider adding client-side form validation
- Enhance loading states with visual indicators
- Evaluate need for additional editable fields based on business requirements

---

**Review Status**: ✅ **COMPLETE** - All critical issues resolved. Edit pathway is functional and ready for use.
