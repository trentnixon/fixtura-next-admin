/**
 * Form helper utilities for invoice creation
 */

import { InvoiceFormState } from "./formConstants";
import { TransformedSubscriptionTier } from "./subscriptionTierHelpers";

/**
 * Gets the formatted price from a subscription tier
 * @param tier - Transformed subscription tier
 * @returns Formatted price string (2 decimal places) or undefined
 */
export function getTierFormattedPrice(
  tier: TransformedSubscriptionTier | undefined
): string | undefined {
  if (!tier || tier.price === undefined) {
    return undefined;
  }
  return tier.price.toFixed(2);
}

/**
 * Gets the currency from a subscription tier, with fallback
 * @param tier - Transformed subscription tier
 * @param fallbackCurrency - Fallback currency if tier doesn't have one
 * @returns Currency code
 */
export function getTierCurrency(
  tier: TransformedSubscriptionTier | undefined,
  fallbackCurrency: string = "AUD"
): string {
  return tier?.currency || fallbackCurrency;
}

/**
 * Checks if form amount should be auto-populated from tier
 * Only auto-populates if amount is empty or zero
 * @param currentAmount - Current amount value in form
 * @returns True if amount should be auto-populated
 */
export function shouldAutoPopulateAmount(currentAmount: string): boolean {
  return !currentAmount || currentAmount === "0" || currentAmount === "0.00";
}

/**
 * Checks if form currency should be auto-populated from tier
 * Only auto-populates if currency is empty
 * @param currentCurrency - Current currency value in form
 * @returns True if currency should be auto-populated
 */
export function shouldAutoPopulateCurrency(currentCurrency: string): boolean {
  return !currentCurrency || currentCurrency === "";
}

/**
 * Creates updated form state with auto-populated amount from tier
 * @param currentFormData - Current form data
 * @param tier - Selected subscription tier
 * @returns Updated form data with amount populated, or original if no update needed
 */
export function autoPopulateAmountFromTier(
  currentFormData: InvoiceFormState,
  tier: TransformedSubscriptionTier | undefined
): InvoiceFormState {
  if (!tier || !shouldAutoPopulateAmount(currentFormData.amount)) {
    return currentFormData;
  }

  const formattedPrice = getTierFormattedPrice(tier);
  if (!formattedPrice) {
    return currentFormData;
  }

  return {
    ...currentFormData,
    amount: formattedPrice,
  };
}

/**
 * Creates updated form state with auto-populated currency from tier
 * @param currentFormData - Current form data
 * @param tier - Selected subscription tier
 * @returns Updated form data with currency populated, or original if no update needed
 */
export function autoPopulateCurrencyFromTier(
  currentFormData: InvoiceFormState,
  tier: TransformedSubscriptionTier | undefined
): InvoiceFormState {
  if (!tier || !shouldAutoPopulateCurrency(currentFormData.currency)) {
    return currentFormData;
  }

  const currency = getTierCurrency(tier, currentFormData.currency);
  if (currency === currentFormData.currency) {
    return currentFormData;
  }

  return {
    ...currentFormData,
    currency,
  };
}

/**
 * Creates updated form state with auto-populated values from tier (amount and currency)
 * @param currentFormData - Current form data
 * @param tier - Selected subscription tier
 * @returns Updated form data with auto-populated values
 */
export function autoPopulateFromTier(
  currentFormData: InvoiceFormState,
  tier: TransformedSubscriptionTier | undefined
): InvoiceFormState {
  let updated = autoPopulateAmountFromTier(currentFormData, tier);
  updated = autoPopulateCurrencyFromTier(updated, tier);
  return updated;
}
