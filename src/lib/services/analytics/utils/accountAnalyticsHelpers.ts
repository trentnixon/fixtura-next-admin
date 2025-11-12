 
import { RawOrderHistoryItem } from "@/types/analytics";

/**
 * Determines if an order is paid based on paymentStatus or status field
 */
export function isOrderPaid(order: RawOrderHistoryItem): boolean {
  // Safely convert to string and lowercase
  const paymentStatus = typeof order.paymentStatus === "string"
    ? order.paymentStatus.toLowerCase()
    : String(order.paymentStatus || "").toLowerCase();
  const status = typeof order.status === "string"
    ? order.status.toLowerCase()
    : String(order.status || "").toLowerCase();
  return (
    paymentStatus === "paid" ||
    status === "paid" ||
    status === "complete" ||
    status === "active"
  );
}

/**
 * Counts paid orders from an array of orders
 */
export function countPaidOrders(orders: RawOrderHistoryItem[]): number {
  return orders.filter(isOrderPaid).length;
}

/**
 * Calculates total spent from an array of orders
 */
export function calculateTotalSpent(orders: RawOrderHistoryItem[]): number {
  return orders.reduce((sum: number, order: RawOrderHistoryItem) => {
    const amount = Number(order.total) || 0;
    return sum + amount;
  }, 0);
}

/**
 * Filters orders to find trial orders
 */
export function filterTrialOrders(
  orders: RawOrderHistoryItem[]
): RawOrderHistoryItem[] {
  return orders.filter((order: RawOrderHistoryItem) => {
    const tier = typeof order.subscriptionTier === "string"
      ? order.subscriptionTier.toLowerCase()
      : String(order.subscriptionTier || "").toLowerCase();
    return tier.includes("trial") || tier.includes("free");
  });
}

/**
 * Determines if a trial was converted by checking if there's a paid Season Pass after the trial
 */
export function determineTrialConversion(
  trialOrder: RawOrderHistoryItem,
  allOrders: RawOrderHistoryItem[]
): boolean {
  const trialDate = new Date(trialOrder.createdAt);
  // Check if there's any paid Season Pass order after the trial
  const hasPaidSubscription = allOrders.some((order: RawOrderHistoryItem) => {
    const orderDate = new Date(order.createdAt);
    // Safely convert to string and lowercase
    const paymentStatus = typeof order.paymentStatus === "string"
      ? order.paymentStatus.toLowerCase()
      : String(order.paymentStatus || "").toLowerCase();
    const status = typeof order.status === "string"
      ? order.status.toLowerCase()
      : String(order.status || "").toLowerCase();
    // Check if order is paid using new paymentStatus field or status field
    const isPaid =
      paymentStatus === "paid" ||
      status === "paid" ||
      status === "complete" ||
      status === "active";
    const tier = typeof order.subscriptionTier === "string"
      ? order.subscriptionTier.toLowerCase()
      : String(order.subscriptionTier || "").toLowerCase();
    return (
      isPaid &&
      tier.includes("season") &&
      orderDate > trialDate
    );
  });
  return hasPaidSubscription;
}

/**
 * Determines payment method from paymentChannel
 */
export function getPaymentMethod(
  paymentChannel: "stripe" | "invoice" | null
): string {
  if (paymentChannel === "stripe") {
    return "Stripe";
  } else if (paymentChannel === "invoice") {
    return "Invoice";
  }
  return "Stripe"; // Default fallback
}
