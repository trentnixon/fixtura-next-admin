/**
 * Shared types and interfaces for order form components
 * These types define the contracts for reusable form components used in
 * order creation and editing workflows.
 */

import { CheckoutStatus } from "@/types/orderOverview";
import { TransformedSubscriptionTier } from "../../utils/subscriptionTierHelpers";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";

/**
 * Payment status values for invoice/order forms
 */
export type PaymentStatus =
  | "open"
  | "paid"
  | "unpaid"
  | "past_due"
  | "void"
  | "draft";

/**
 * Payment channel values
 */
export type PaymentChannel = "stripe" | "invoice" | "none";

/**
 * Base props for form field components
 */
export interface BaseFormFieldProps {
  id?: string;
  label?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Props for CheckoutStatusSelect component
 */
export interface CheckoutStatusSelectProps extends BaseFormFieldProps {
  value: CheckoutStatus | null | string;
  onChange: (value: CheckoutStatus | null) => void;
  includeNone?: boolean;
  placeholder?: string;
}

/**
 * Props for PaymentStatusSelect component
 */
export interface PaymentStatusSelectProps extends BaseFormFieldProps {
  value: string | null;
  onChange: (value: string) => void;
  includeNone?: boolean;
  placeholder?: string;
}

/**
 * Props for OrderStatusSwitch component (single switch)
 */
export interface OrderStatusSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Configuration for a single order status switch
 */
export interface OrderStatusSwitchConfig {
  id: string;
  label: string;
  field: string; // Form field path (e.g., "Status", "isActive", "OrderPaid")
  checked: boolean;
}

/**
 * Props for OrderStatusSwitches component (switch group)
 */
export interface OrderStatusSwitchesProps {
  switches: OrderStatusSwitchConfig[];
  onChange: (field: string, checked: boolean) => void;
  disabled?: boolean;
  columns?: 2 | 3;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Props for CurrencyInput component
 */
export interface CurrencyInputProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  mode?: "input" | "select";
  placeholder?: string;
}

/**
 * Props for AmountInput component
 */
export interface AmountInputProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  showHelperText?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
}

/**
 * Props for DateRangeInputs component
 */
export interface DateRangeInputsProps {
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
  startId?: string;
  endId?: string;
  className?: string;
}

/**
 * Props for SubscriptionTierSelect component
 */
export interface SubscriptionTierSelectProps extends BaseFormFieldProps {
  value: string;
  onChange: (value: string) => void;
  tiers: TransformedSubscriptionTier[];
  showMetadata?: boolean;
  onTierSelect?: (tier: TransformedSubscriptionTier | undefined) => void;
  placeholder?: string;
  isLoading?: boolean;
}

/**
 * Props for PaymentChannelSelect component
 */
export interface PaymentChannelSelectProps extends BaseFormFieldProps {
  value: PaymentChannel | null;
  onChange: (value: PaymentChannel | null) => void;
  includeNone?: boolean;
  placeholder?: string;
}

/**
 * Props for AccountInfoSidebar component
 */
export interface AccountInfoSidebarProps {
  account: fixturaContentHubAccountDetails | undefined;
  accountId: number;
  showViewButton?: boolean;
  className?: string;
  isLoading?: boolean;
  error?: Error | null;
  actionButtons?: React.ReactNode;
}

/**
 * Props for ReadOnlyField component
 */
export interface ReadOnlyFieldProps {
  label: string;
  value: string | number | null | undefined;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Props for StatusSection component
 */
export interface StatusSectionProps {
  checkoutStatus: CheckoutStatus | null | string;
  paymentStatus: string | null;
  onCheckoutStatusChange: (value: CheckoutStatus | null) => void;
  onPaymentStatusChange: (value: string) => void;
  errors?: {
    checkoutStatus?: string;
    paymentStatus?: string;
  };
  disabled?: boolean;
  required?: boolean;
  includeNone?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Props for OrderFlagsSection component
 */
export interface OrderFlagsSectionProps {
  switches: OrderStatusSwitchConfig[];
  onChange: (field: string, checked: boolean) => void;
  disabled?: boolean;
  columns?: 2 | 3;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Order status boolean flag configuration
 * Maps field names to their display labels
 */
export interface OrderStatusFlagConfig {
  field: string;
  label: string;
}
