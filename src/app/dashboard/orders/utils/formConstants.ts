/**
 * Constants for invoice creation form
 */

/**
 * Available currencies for invoice creation
 * Can be expanded or fetched from API later
 */
export const CURRENCIES = [{ value: "AUD", label: "AUD - Australian Dollar" }];

/**
 * Default checkout status for new invoices
 */
export const DEFAULT_CHECKOUT_STATUS = "incomplete";

/**
 * Default payment status for new invoices
 */
export const DEFAULT_PAYMENT_STATUS = "open";

/**
 * Default currency for new invoices
 */
export const DEFAULT_CURRENCY = "AUD";

/**
 * Days until due date (hardcoded)
 */
export const DEFAULT_DAYS_UNTIL_DUE = 30;

/**
 * Default form state for invoice creation
 */
export interface InvoiceFormState {
  subscriptionTierId: string;
  amount: string;
  currency: string;
  startDate: string;
  endDate: string;
  checkoutStatus: string;
  payment_status: string;
  Status: boolean;
  isActive: boolean;
  OrderPaid: boolean;
  isExpiringSoon: boolean;
  expiringSoonEmail: boolean;
  hasOrderExpired: boolean;
  expireEmailSent: boolean;
  cancel_at_period_end: boolean;
  isPaused: boolean;
}

/**
 * Creates default form state for invoice creation
 * @param defaultDates - Default start and end dates
 * @returns Default form state object
 */
export function createDefaultFormState(defaultDates: {
  startDate: string;
  endDate: string;
}): InvoiceFormState {
  return {
    subscriptionTierId: "",
    amount: "",
    currency: DEFAULT_CURRENCY,
    startDate: defaultDates.startDate,
    endDate: defaultDates.endDate,
    checkoutStatus: DEFAULT_CHECKOUT_STATUS,
    payment_status: DEFAULT_PAYMENT_STATUS,
    Status: false,
    isActive: false,
    OrderPaid: false,
    isExpiringSoon: false,
    expiringSoonEmail: false,
    hasOrderExpired: false,
    expireEmailSent: false,
    cancel_at_period_end: false,
    isPaused: false,
  };
}
