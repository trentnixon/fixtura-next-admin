"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, DollarSign, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import { useGlobalAnalytics } from "@/hooks/analytics/useGlobalAnalytics";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import { useAdminInvoicesData } from "@/hooks/orders/useAdminInvoices";
import { findCurrencyFromOrders } from "@/app/dashboard/orders/utils/orderHelpers";
import { OrdersOverviewTimeline } from "@/app/dashboard/orders/components/OrdersOverviewTimeline";
import { OrdersOverviewPaymentChannelChart } from "@/app/dashboard/orders/components/OrdersOverviewPaymentChannelChart";
import { formatCurrency } from "@/utils/chart-formatters";
import { OverviewDataWorkspace } from "./live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "./live-snapshot/OverviewRecordPanel";
import type { WorkspaceMetricTile } from "./live-snapshot/OverviewDataWorkspace";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import {
  formatPaymentMixMeta,
  summarizePaymentMixByRevenue,
} from "./live-snapshot/liveSnapshotPaymentMix";
import { DashboardLinkButton } from "./live-snapshot/DashboardLinkButton";
import { FinancialRevenueChart } from "./financials/FinancialRevenueChart";
import { FinancialRecentOrdersList } from "./financials/FinancialRecentOrdersList";
import { FinancialInvoiceQueueList } from "./financials/FinancialInvoiceQueueList";
import {
  getFinancialPeriodDateRange,
  getFinancialPeriodMonthKeys,
  getRecentMonthlyRevenue,
  sumRecentMonthlyRevenue,
  type FinancialPeriodMonths,
} from "./financials/financialDateRanges";
const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";
const DEFAULT_CURRENCY = "AUD";

const PERIOD_OPTIONS = [
  { value: "1", label: "1 month" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
] as const;

/**
 * Fleet, revenue, orders, invoices, and billing metrics for the dashboard.
 */
export default function DashboardFinancials() {
  const [periodMonths, setPeriodMonths] = useState<FinancialPeriodMonths>(3);

  const periodRange = useMemo(
    () => getFinancialPeriodDateRange(periodMonths),
    [periodMonths]
  );

  const periodMonthKeys = useMemo(
    () => getFinancialPeriodMonthKeys(periodMonths),
    [periodMonths]
  );

  const {
    data: accountSummary,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
  } = useAccountSummaryQuery({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: globalAnalytics,
    isLoading: analyticsLoading,
    isError: analyticsError,
    isFetching: analyticsFetching,
  } = useGlobalAnalytics({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: orderOverview,
    isLoading: ordersOverviewLoading,
    isError: ordersOverviewError,
    isFetching: ordersOverviewFetching,
  } = useAdminOrderOverview(
    {
      startDate: periodRange.startDate,
      endDate: periodRange.endDate,
    },
    { refetchInterval: LIVE_OVERVIEW_REFETCH_MS }
  );

  const {
    items: newInvoiceItems,
    total: newInvoiceTotal,
    isLoading: newInvoicesLoading,
    isFetching: newInvoicesFetching,
  } = useAdminInvoicesData(
    {
      preset: "new",
      page: 1,
      pageSize: 5,
      sort: "submittedAt",
      sortDir: "desc",
    },
    { refetchInterval: LIVE_OVERVIEW_REFETCH_MS }
  );

  const {
    items: outstandingInvoiceItems,
    total: outstandingInvoiceTotal,
    isLoading: outstandingInvoicesLoading,
    isFetching: outstandingInvoicesFetching,
  } = useAdminInvoicesData(
    {
      preset: "outstanding",
      page: 1,
      pageSize: 5,
      sort: "updatedAt",
      sortDir: "desc",
    },
    { refetchInterval: LIVE_OVERVIEW_REFETCH_MS }
  );

  const isRefreshing =
    (accountsFetching && !accountsLoading) ||
    (analyticsFetching && !analyticsLoading) ||
    (ordersOverviewFetching && !ordersOverviewLoading) ||
    (newInvoicesFetching && !newInvoicesLoading) ||
    (outstandingInvoicesFetching && !outstandingInvoicesLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const currency = useMemo(
    () => findCurrencyFromOrders(orderOverview?.orders ?? []) ?? DEFAULT_CURRENCY,
    [orderOverview?.orders]
  );

  const monthlyRevenueSeries = useMemo(
    () =>
      getRecentMonthlyRevenue(
        globalAnalytics?.revenueTrends?.monthlyRevenue,
        periodMonths
      ),
    [globalAnalytics?.revenueTrends?.monthlyRevenue, periodMonths]
  );

  const workspaceMetrics = useMemo((): WorkspaceMetricTile[] => {
    const summary = accountSummary?.data?.Totals;
    const associations = summary?.accountTypesCount?.Association ?? 0;
    const clubs = summary?.accountTypesCount?.Club ?? 0;
    const totalAccounts =
      summary?.count ?? (associations + clubs > 0 ? associations + clubs : 0);

    const analytics = globalAnalytics;
    const periodRevenueCents = sumRecentMonthlyRevenue(
      analytics?.revenueTrends?.monthlyRevenue,
      periodMonths
    );

    const orderStats = orderOverview?.stats;
    const paidCount = orderStats?.paidVsUnpaid.paid.count ?? 0;
    const unpaidCount = orderStats?.paidVsUnpaid.unpaid.count ?? 0;
    const unpaidTotalCents = orderStats?.paidVsUnpaid.unpaid.total ?? 0;
    const pendingPayment = orderStats?.pendingPayment ?? 0;

    const paymentMix = summarizePaymentMixByRevenue(orderOverview?.orders ?? []);
    const paymentMixValue =
      ordersOverviewError || paymentMix.totalCents <= 0
        ? ordersOverviewError
          ? UNAVAILABLE
          : "0%"
        : `${paymentMix.stripeSharePercent}%`;

    return [
      {
        id: "period-revenue",
        label: "Revenue",
        value: analyticsError
          ? UNAVAILABLE
          : formatCurrency(periodRevenueCents / 100, currency),
        meta: analyticsError ? UNAVAILABLE_META : periodRange.label,
        isLoading: analyticsLoading,
      },
      {
        id: "orders-paid",
        label: "Paid orders",
        value: ordersOverviewError ? UNAVAILABLE : String(paidCount),
        meta: ordersOverviewError
          ? UNAVAILABLE_META
          : orderStats
            ? formatCurrency(
                (orderStats.paidVsUnpaid.paid.total ?? 0) / 100,
                currency
              )
            : periodRange.label,
        isLoading: ordersOverviewLoading,
      },
      {
        id: "pending-payment",
        label: "Pending payment",
        value: ordersOverviewError ? UNAVAILABLE : String(pendingPayment),
        meta: ordersOverviewError
          ? UNAVAILABLE_META
          : `${unpaidCount} unpaid · ${formatCurrency(unpaidTotalCents / 100, currency)}`,
        isLoading: ordersOverviewLoading,
      },
      {
        id: "outstanding-invoices",
        label: "Outstanding invoices",
        value: outstandingInvoicesLoading
          ? UNAVAILABLE
          : String(outstandingInvoiceTotal),
        meta: outstandingInvoicesLoading
          ? UNAVAILABLE_META
          : `${newInvoiceTotal} new requests`,
        isLoading: outstandingInvoicesLoading || newInvoicesLoading,
      },
      {
        id: "active-subs",
        label: "Active subs",
        value: analyticsError
          ? UNAVAILABLE
          : (analytics?.activeAccounts ?? 0).toLocaleString(),
        meta: analyticsError
          ? UNAVAILABLE_META
          : `${totalAccounts.toLocaleString()} total accounts`,
        isLoading: analyticsLoading || accountsLoading,
      },
      {
        id: "stripe-share",
        label: "Stripe share",
        value: paymentMixValue,
        meta: ordersOverviewError
          ? UNAVAILABLE_META
          : formatPaymentMixMeta(paymentMix, currency),
        isLoading: ordersOverviewLoading,
      },
    ];
  }, [
    accountSummary?.data?.Totals,
    accountsLoading,
    analyticsError,
    analyticsLoading,
    currency,
    globalAnalytics,
    newInvoiceTotal,
    newInvoicesLoading,
    orderOverview?.orders,
    orderOverview?.stats,
    ordersOverviewError,
    ordersOverviewLoading,
    outstandingInvoiceTotal,
    outstandingInvoicesLoading,
    periodMonths,
    periodRange.label,
  ]);

  const initialLoad =
    accountsLoading &&
    analyticsLoading &&
    ordersOverviewLoading &&
    newInvoicesLoading &&
    outstandingInvoicesLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading financials…"
        className="py-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <LabeledSegmentedControl
        label="Period"
        value={String(periodMonths)}
        onValueChange={(value) =>
          setPeriodMonths(Number(value) as FinancialPeriodMonths)
        }
        options={[...PERIOD_OPTIONS]}
      />

      <OverviewDataWorkspace
        title="Financial snapshot"
        description={`Revenue, orders, and invoice queues — ${periodRange.label.toLowerCase()}`}
        icon={DollarSign}
        badge={<Badge variant="secondary">{periodRange.label}</Badge>}
        metrics={workspaceMetrics}
        columns={3}
        action={
          <DashboardLinkButton href="/dashboard/analytics" trailingIcon="external">
            Analytics
          </DashboardLinkButton>
        }
        footer={
          <>
            <span className="text-muted-foreground">
              Orders filtered {periodRange.startDate} → {periodRange.endDate}
            </span>
            <DashboardLinkButton
              href="/dashboard/orders"
              intent="highlight"
              trailingIcon="arrow"
            >
              Open orders workspace
            </DashboardLinkButton>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <FinancialRevenueChart
          data={monthlyRevenueSeries}
          periodMonths={periodMonths}
          periodLabel={periodRange.label}
          currency={currency}
        />

        {orderOverview && !ordersOverviewError ? (
          <OrdersOverviewPaymentChannelChart stats={orderOverview.stats} />
        ) : null}
      </div>

      {orderOverview && !ordersOverviewError ? (
        <OrdersOverviewTimeline
          timeline={orderOverview.timeline}
          currency={currency}
          monthKeys={periodMonthKeys}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <OverviewRecordPanel
          title="Recent orders"
          description="Latest Stripe and invoice orders in the selected period"
          action={
            <DashboardLinkButton href="/dashboard/orders">View all</DashboardLinkButton>
          }
          footer={
            orderOverview?.orders.length ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {Math.min(orderOverview.orders.length, 5)} shown
                </span>
                <DashboardLinkButton
                  href="/dashboard/orders"
                  intent="highlight"
                  trailingIcon="arrow"
                >
                  Open orders
                </DashboardLinkButton>
              </>
            ) : undefined
          }
        >
          {ordersOverviewLoading ? (
            <LoadingState variant="minimal" message="Loading orders…" />
          ) : (
            <FinancialRecentOrdersList
              orders={orderOverview?.orders ?? []}
              currency={currency}
            />
          )}
        </OverviewRecordPanel>

        <OverviewRecordPanel
          title="New invoice requests"
          description="Recently submitted billing requests awaiting action"
          badge={
            newInvoiceTotal > 0 ? (
              <Badge variant="outline">{newInvoiceTotal} total</Badge>
            ) : null
          }
          action={
            <DashboardLinkButton href="/dashboard/orders/invoices">
              Invoice queue
            </DashboardLinkButton>
          }
        >
          {newInvoicesLoading ? (
            <LoadingState variant="minimal" message="Loading invoice requests…" />
          ) : (
            <FinancialInvoiceQueueList items={newInvoiceItems} />
          )}
        </OverviewRecordPanel>
      </div>

      <OverviewRecordPanel
        title="Outstanding invoices"
        description="Issued or in-progress invoice requests not yet paid"
        className="max-w-3xl"
        badge={
          outstandingInvoiceTotal > 0 ? (
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-900">
              <AlertTriangle className="mr-1 h-3 w-3" />
              {outstandingInvoiceTotal} open
            </Badge>
          ) : null
        }
        action={
          <DashboardLinkButton
            href="/dashboard/orders/invoices"
            icon={FileText}
          >
            Manage invoices
          </DashboardLinkButton>
        }
        footer={
          outstandingInvoiceItems.length > 0 ? (
            <>
              <span className="text-sm text-muted-foreground">
                Showing {outstandingInvoiceItems.length} of {outstandingInvoiceTotal}
              </span>
              <DashboardLinkButton
                href="/dashboard/orders/invoices"
                intent="highlight"
                trailingIcon="arrow"
              >
                View queue
              </DashboardLinkButton>
            </>
          ) : undefined
        }
      >
        {outstandingInvoicesLoading ? (
          <LoadingState variant="minimal" message="Loading outstanding invoices…" />
        ) : (
          <FinancialInvoiceQueueList items={outstandingInvoiceItems} />
        )}
      </OverviewRecordPanel>
    </div>
  );
}
