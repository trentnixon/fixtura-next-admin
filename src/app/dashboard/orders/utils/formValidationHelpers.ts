/**
 * Form validation helpers for invoice creation
 */

import { InvoiceFormState } from "./formConstants";

/**
 * Validation errors object
 */
export interface FormValidationErrors {
  [key: string]: string;
}

/**
 * Validates invoice creation form
 * @param formData - Form data to validate
 * @returns Object with validation errors (empty if valid)
 */
export function validateInvoiceForm(
  formData: InvoiceFormState
): FormValidationErrors {
  const errors: FormValidationErrors = {};

  // Validate subscriptionTierId
  if (!formData.subscriptionTierId) {
    errors.subscriptionTierId = "Subscription tier is required";
  }

  // Validate checkoutStatus
  if (!formData.checkoutStatus) {
    errors.checkoutStatus = "Checkout status is required";
  }

  // Validate payment_status
  if (!formData.payment_status) {
    errors.payment_status = "Payment status is required";
  }

  // Validate amount
  if (!formData.amount) {
    errors.amount = "Amount is required";
  } else {
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || !isFinite(amountValue)) {
      errors.amount = "Amount must be a valid number";
    } else if (amountValue <= 0) {
      errors.amount = "Amount must be greater than 0";
    } else if (amountValue > 999999999999) {
      errors.amount = "Amount is too large (max: 999,999,999,999)";
    }
  }

  // Validate currency (must be 3 characters, letters only)
  if (!formData.currency) {
    errors.currency = "Currency is required";
  } else {
    const trimmedCurrency = formData.currency.trim();
    if (trimmedCurrency === "") {
      errors.currency = "Currency cannot be empty";
    } else if (trimmedCurrency.length !== 3) {
      errors.currency = "Currency must be a 3-character code (e.g., AUD, USD)";
    } else if (!/^[A-Za-z]{3}$/.test(trimmedCurrency)) {
      errors.currency = "Currency must contain only letters";
    }
  }

  // Validate startDate
  if (!formData.startDate) {
    errors.startDate = "Start date is required";
  } else {
    const startDate = new Date(formData.startDate);
    if (isNaN(startDate.getTime())) {
      errors.startDate = "Start date must be a valid date";
    } else {
      const minDate = new Date("2000-01-01");
      const maxDate = new Date("2100-12-31");
      if (startDate < minDate) {
        errors.startDate =
          "Start date is too far in the past (min: 2000-01-01)";
      } else if (startDate > maxDate) {
        errors.startDate =
          "Start date is too far in the future (max: 2100-12-31)";
      }
    }
  }

  // Validate endDate
  if (!formData.endDate) {
    errors.endDate = "End date is required";
  } else {
    const endDate = new Date(formData.endDate);
    if (isNaN(endDate.getTime())) {
      errors.endDate = "End date must be a valid date";
    } else {
      const minDate = new Date("2000-01-01");
      const maxDate = new Date("2100-12-31");
      if (endDate < minDate) {
        errors.endDate = "End date is too far in the past (min: 2000-01-01)";
      } else if (endDate > maxDate) {
        errors.endDate = "End date is too far in the future (max: 2100-12-31)";
      }

      // Validate endDate is after startDate
      if (formData.startDate) {
        const startDate = new Date(formData.startDate);
        if (!isNaN(startDate.getTime()) && endDate <= startDate) {
          errors.endDate = "End date must be after start date";
        }
      }
    }
  }

  return errors;
}

/**
 * Checks if form is valid (no errors)
 * @param errors - Validation errors object
 * @returns True if form is valid, false otherwise
 */
export function isFormValid(errors: FormValidationErrors): boolean {
  return Object.keys(errors).length === 0;
}
