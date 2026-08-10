import type { OrderOverviewRow } from "@/types/orderOverview";
import { formatCurrency } from "@/utils/chart-formatters";

export type PaymentMixSummary = {
  stripeCents: number;
  invoiceCents: number;
  totalCents: number;
  stripeSharePercent: number;
  stripeOrderCount: number;
  invoiceOrderCount: number;
};

export function summarizePaymentMixByRevenue(
  orders: OrderOverviewRow[],
): PaymentMixSummary {
  let stripeCents = 0;
  let invoiceCents = 0;
  let stripeOrderCount = 0;
  let invoiceOrderCount = 0;

  for (const order of orders) {
    const amount = order.totals?.amount ?? 0;
    if (order.paymentChannel === "stripe") {
      stripeCents += amount;
      stripeOrderCount += 1;
    } else if (order.paymentChannel === "invoice") {
      invoiceCents += amount;
      invoiceOrderCount += 1;
    }
  }

  const totalCents = stripeCents + invoiceCents;
  const stripeSharePercent =
    totalCents > 0 ? Math.round((stripeCents / totalCents) * 100) : 0;

  return {
    stripeCents,
    invoiceCents,
    totalCents,
    stripeSharePercent,
    stripeOrderCount,
    invoiceOrderCount,
  };
}

export function formatPaymentMixMeta(
  mix: PaymentMixSummary,
  currency: string,
): string {
  if (mix.totalCents <= 0) {
    return "No billable orders MTD";
  }

  return `${formatCurrency(mix.stripeCents / 100, currency)} stripe · ${formatCurrency(
    mix.invoiceCents / 100,
    currency,
  )} invoice`;
}
