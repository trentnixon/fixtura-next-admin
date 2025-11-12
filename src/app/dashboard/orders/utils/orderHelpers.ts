/**
 * Finds the first non-null currency from an array of orders
 * @param orders - Array of orders with totals.currency property
 * @returns Currency code string or null if no currency found
 */
export function findCurrencyFromOrders(
  orders: Array<{ totals: { currency: string | null } }>
): string | null {
  for (const order of orders) {
    if (order.totals.currency) {
      return order.totals.currency;
    }
  }
  return null;
}

