/**
 * Shared constants and configurations for order form components
 */

import { CheckoutStatus } from "@/types/orderOverview";
import type { PaymentStatus, PaymentChannel, OrderStatusFlagConfig } from "./types";

/**
 * Available checkout status options for dropdowns
 * Excludes null since SelectItem value must be a string
 */
export const CHECKOUT_STATUS_OPTIONS: Array<{
  value: Exclude<CheckoutStatus, null>;
  label: string;
}> = [
  { value: "active", label: "Active" },
  { value: "canceled", label: "Canceled" },
  { value: "past_due", label: "Past Due" },
  { value: "incomplete", label: "Incomplete" },
  { value: "incomplete_expired", label: "Incomplete Expired" },
  { value: "trialing", label: "Trialing" },
  { value: "unpaid", label: "Unpaid" },
  { value: "complete", label: "Complete" },
];

/**
 * Available payment status options for dropdowns
 */
export const PAYMENT_STATUS_OPTIONS: Array<{
  value: PaymentStatus;
  label: string;
}> = [
  { value: "open", label: "Open" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "past_due", label: "Past Due" },
  { value: "void", label: "Void" },
  { value: "draft", label: "Draft" },
];

/**
 * Available payment channel options for dropdowns
 */
export const PAYMENT_CHANNEL_OPTIONS: Array<{
  value: PaymentChannel;
  label: string;
}> = [
  { value: "stripe", label: "Stripe" },
  { value: "invoice", label: "Invoice" },
  { value: "none", label: "None" },
];

/**
 * Available currencies for invoice/order forms
 */
export const CURRENCIES = [
  { value: "AUD", label: "AUD - Australian Dollar" },
];

/**
 * Default values for form fields
 */
export const FORM_DEFAULTS = {
  checkoutStatus: "incomplete" as CheckoutStatus,
  paymentStatus: "open" as PaymentStatus,
  currency: "AUD",
  paymentChannel: "none" as PaymentChannel,
  daysUntilDue: 30,
} as const;

/**
 * Order status flag configurations with labels
 */
export const ORDER_STATUS_FLAG_CONFIGS: OrderStatusFlagConfig[] = [
  { field: "Status", label: "Status" },
  { field: "isActive", label: "Is Active" },
  { field: "OrderPaid", label: "Order Paid" },
  { field: "isExpiringSoon", label: "Is Expiring Soon" },
  { field: "expiringSoonEmail", label: "Expiring Soon Email" },
  { field: "hasOrderExpired", label: "Has Order Expired" },
  { field: "expireEmailSent", label: "Expire Email Sent" },
  { field: "cancel_at_period_end", label: "Cancel at Period End" },
  { field: "isPaused", label: "Is Paused" },
];

/**
 * Default section titles and descriptions
 */
export const SECTION_DEFAULTS = {
  status: {
    title: "Status & Payment",
    description: "Set the checkout and payment status for this order.",
  },
  orderFlags: {
    title: "Order Status & Flags",
    description: "Configure order status and expiration flags for this order.",
  },
  dates: {
    title: "Dates",
    description: "Set the start and end dates for this order.",
  },
} as const;

/**
 * Grid column configurations for form layouts
 */
export const GRID_COLUMNS = {
  default: "md:grid-cols-2",
  three: "md:grid-cols-2 lg:grid-cols-3",
  single: "grid-cols-1",
} as const;

/**
 * Switch component styling classes
 */
export const SWITCH_STYLES = {
  checked: "data-[state=checked]:bg-emerald-500",
  container: "flex items-center justify-between p-3 border rounded-lg",
  label: "cursor-pointer",
} as const;

