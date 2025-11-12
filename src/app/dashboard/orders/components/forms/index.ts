/**
 * Order Form Components Library
 *
 * Central export point for all form components, types, and constants.
 * This allows for clean imports like:
 *
 * import { CheckoutStatusSelect, type CheckoutStatusSelectProps } from '@/app/dashboard/orders/components/forms';
 */

// Types
export type {
  PaymentStatus,
  PaymentChannel,
  BaseFormFieldProps,
  CheckoutStatusSelectProps,
  PaymentStatusSelectProps,
  OrderStatusSwitchProps,
  OrderStatusSwitchConfig,
  OrderStatusSwitchesProps,
  CurrencyInputProps,
  AmountInputProps,
  DateRangeInputsProps,
  SubscriptionTierSelectProps,
  PaymentChannelSelectProps,
  AccountInfoSidebarProps,
  ReadOnlyFieldProps,
  StatusSectionProps,
  OrderFlagsSectionProps,
  OrderStatusFlagConfig,
} from "./types";

// Constants
export {
  CHECKOUT_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_CHANNEL_OPTIONS,
  CURRENCIES,
  FORM_DEFAULTS,
  ORDER_STATUS_FLAG_CONFIGS,
  SECTION_DEFAULTS,
  GRID_COLUMNS,
  SWITCH_STYLES,
} from "./constants";

// Components
export { CheckoutStatusSelect } from "./CheckoutStatusSelect";
export { PaymentStatusSelect } from "./PaymentStatusSelect";
export { OrderStatusSwitch } from "./OrderStatusSwitch";
export { OrderStatusSwitches } from "./OrderStatusSwitches";
export { CurrencyInput } from "./CurrencyInput";
export { AmountInput } from "./AmountInput";
export { DateRangeInputs } from "./DateRangeInputs";
export { SubscriptionTierSelect } from "./SubscriptionTierSelect";
export { PaymentChannelSelect } from "./PaymentChannelSelect";
export { AccountInfoSidebar } from "./AccountInfoSidebar";
export { ReadOnlyField } from "./ReadOnlyField";
export { StatusSection } from "./StatusSection";
export { OrderFlagsSection } from "./OrderFlagsSection";
