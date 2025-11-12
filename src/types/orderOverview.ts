export type CheckoutStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "incomplete"
  | "incomplete_expired"
  | "trialing"
  | "unpaid"
  | "complete"
  | null;

export interface OrderOverviewAccount {
  id: number | null;
  name: string | null;
}

export interface OrderOverviewTotals {
  amount: number;
  currency: string | null;
}

export interface OrderOverviewRow {
  id: number;
  name: string | null;
  account: OrderOverviewAccount;
  totals: OrderOverviewTotals;
  paymentStatus: string | null;
  status: string;
  isActive: boolean;
  isExpiringSoon: boolean;
  createdAt: string;
  updatedAt: string;
  startDate: string | null;
  endDate: string | null;
}

export interface OrderOverviewPaidVsUnpaidTotals {
  count: number;
  total: number;
}

export interface OrderOverviewPaidVsUnpaid {
  paid: OrderOverviewPaidVsUnpaidTotals;
  unpaid: OrderOverviewPaidVsUnpaidTotals;
}

export interface OrderOverviewStats {
  totalOrders: number;
  activeOrders: number;
  cancelledOrders: number;
  pausedOrders: number;
  pendingPayment: number;
  totalRevenue: number;
  averageOrderValue: number;
  byStatus: Record<string, number>;
  byTier: Record<string, number>;
  byAccountType: Record<string, number>;
  paidVsUnpaid: OrderOverviewPaidVsUnpaid;
  lastUpdated: string;
}

export type OrderOverviewSeriesName =
  | "ordersCreated"
  | "ordersPaid"
  | "ordersEnded"
  | "revenueCollected";

export interface OrderOverviewTimelinePoint {
  date: string;
  value: number;
}

export interface OrderOverviewTimelineSeries {
  name: OrderOverviewSeriesName;
  label: string;
  data: OrderOverviewTimelinePoint[];
}

export interface OrderOverviewTimelineTotals {
  ordersCreated: number;
  ordersPaid: number;
  ordersEnded: number;
  revenueCollected: number;
}

export interface OrderOverviewTimelineRange {
  start: string | null;
  end: string | null;
}

export interface OrderOverviewTimeline {
  granularity: "daily";
  range: OrderOverviewTimelineRange;
  series: OrderOverviewTimelineSeries[];
  totals: OrderOverviewTimelineTotals;
}

export interface OrderOverviewResponse {
  orders: OrderOverviewRow[];
  stats: OrderOverviewStats;
  timeline: OrderOverviewTimeline;
}

export interface FetchOrderOverviewParams {
  startDate?: string;
  endDate?: string;
  status?: CheckoutStatus | string;
}
