import type {
  FetchOrderOverviewParams,
  OrderOverviewStats,
} from "@/types/orderOverview";
import { formatDateShort } from "@/utils/chart-formatters";

export function describeOrderFilters(
  filters: FetchOrderOverviewParams,
): string {
  const parts: string[] = [];

  if (filters.startDate && filters.endDate) {
    parts.push(
      `${formatDateShort(filters.startDate)} → ${formatDateShort(filters.endDate)}`,
    );
  } else if (filters.startDate) {
    parts.push(`From ${formatDateShort(filters.startDate)}`);
  } else if (filters.endDate) {
    parts.push(`Through ${formatDateShort(filters.endDate)}`);
  } else {
    parts.push("Default API window");
  }

  if (filters.status) {
    parts.push(`Checkout: ${filters.status.replace(/_/g, " ")}`);
  }

  return parts.join(" · ");
}

export function paidOrderShare(stats: OrderOverviewStats): number | null {
  if (stats.totalOrders <= 0) return null;
  return (stats.paidVsUnpaid.paid.count / stats.totalOrders) * 100;
}

export function timelinePaidConversion(
  created: number,
  paid: number,
): number | null {
  if (created <= 0) return null;
  return (paid / created) * 100;
}
