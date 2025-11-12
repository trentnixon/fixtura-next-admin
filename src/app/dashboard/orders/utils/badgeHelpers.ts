/**
 * Badge helper functions for order status, checkout status, and active status
 * Used across order overview and order detail components
 */

/**
 * Determines the badge variant based on status
 * @param status - Status string (e.g., "paid", "incomplete", "active")
 * @returns Badge variant string
 */
export function formatStatusBadgeVariant(
  status: string | null | undefined
): "default" | "primary" | "secondary" | "accent" | "destructive" | "outline" {
  if (!status) {
    return "outline";
  }

  const normalized = status.toLowerCase();

  // Payment status values: paid, unpaid, open, past_due, void, draft
  // Also handle order status values that may appear in paymentStatus field
  if (normalized === "paid") {
    return "primary";
  }

  if (["unpaid", "past_due", "void"].includes(normalized)) {
    return "destructive";
  }

  if (normalized === "open" || normalized === "draft") {
    return "default";
  }

  // Handle order status values that may appear in paymentStatus
  // These are typically order-level statuses, not payment statuses
  if (normalized === "incomplete") {
    return "destructive"; // Incomplete payments are problematic
  }

  if (normalized === "paused") {
    return "secondary"; // Paused orders are in a special state
  }

  // Legacy support for other status display values
  if (["active", "complete"].includes(normalized)) {
    return "primary";
  }

  if (normalized === "pending") {
    return "destructive";
  }

  if (["canceled", "cancelled"].includes(normalized)) {
    return "outline";
  }

  return "secondary";
}

/**
 * Gets the CSS class name for status badges with color styling
 * @param status - Status string (e.g., "paid", "incomplete")
 * @returns CSS class string or undefined
 */
export function getStatusBadgeClassName(
  status: string | null | undefined
): string | undefined {
  if (!status) return undefined;

  const normalized = status.toLowerCase();

  // Payment status values: paid, unpaid, open, past_due, void, draft
  // Also handle order status values that may appear in paymentStatus field
  if (normalized === "paid") {
    return "rounded-full bg-emerald-500 text-white border-0";
  }

  if (["unpaid", "past_due", "void"].includes(normalized)) {
    return "rounded-full bg-red-500 text-white border-0";
  }

  if (normalized === "open" || normalized === "draft") {
    return "rounded-full bg-amber-500 text-white border-0";
  }

  // Handle order status values that may appear in paymentStatus
  // These are typically order-level statuses, not payment statuses
  if (normalized === "incomplete") {
    return "rounded-full bg-red-500 text-white border-0";
  }

  if (normalized === "paused") {
    return "rounded-full bg-slate-500 text-white border-0";
  }

  return "rounded-full";
}

/**
 * Gets the CSS class name for checkout status badges with color styling
 * @param checkoutStatus - Checkout status string (e.g., "complete", "incomplete")
 * @returns CSS class string
 */
export function getCheckoutBadgeClassName(
  checkoutStatus: string | null | undefined
): string {
  if (!checkoutStatus) return "rounded-full";

  const normalized = checkoutStatus.toLowerCase();

  // Checkout status values: active, complete, incomplete, incomplete_expired, trialing, unpaid, past_due, canceled
  if (normalized === "complete" || normalized === "active") {
    return "rounded-full bg-emerald-500 text-white border-0";
  }

  if (
    [
      "incomplete",
      "incomplete_expired",
      "unpaid",
      "past_due",
      "canceled",
      "cancelled",
    ].includes(normalized)
  ) {
    return "rounded-full bg-red-500 text-white border-0";
  }

  if (normalized === "trialing") {
    return "rounded-full bg-blue-500 text-white border-0";
  }

  return "rounded-full";
}

/**
 * Gets the CSS class name for active/inactive badges with color styling
 * @param isActive - Boolean indicating if order is active
 * @returns CSS class string
 */
export function getActiveBadgeClassName(isActive: boolean): string {
  return isActive
    ? "rounded-full bg-emerald-500 text-white border-0"
    : "rounded-full bg-red-500 text-white border-0";
}

/**
 * Gets the CSS class name for ending soon badges with color styling
 * @param isExpiringSoon - Boolean indicating if order is expiring soon
 * @returns CSS class string
 */
export function getEndingSoonBadgeClassName(isExpiringSoon: boolean): string {
  // Red for "Yes" (expiring soon - needs attention)
  // Green for "No" (not expiring soon - good)
  return isExpiringSoon
    ? "rounded-full bg-red-500 text-white border-0"
    : "rounded-full bg-emerald-500 text-white border-0";
}

/**
 * Gets the CSS class name for payment channel badges with color styling
 * @param paymentChannel - Payment channel string ("stripe" | "invoice" | null)
 * @returns CSS class string
 */
export function getPaymentChannelBadgeClassName(
  paymentChannel: "stripe" | "invoice" | null
): string {
  if (!paymentChannel) {
    return "rounded-full bg-slate-500 text-white border-0";
  }

  const normalized = paymentChannel.toLowerCase();

  if (normalized === "stripe") {
    return "rounded-full bg-purple-500 text-white border-0";
  }

  if (normalized === "invoice") {
    return "rounded-full bg-blue-500 text-white border-0";
  }

  return "rounded-full bg-slate-500 text-white border-0";
}

