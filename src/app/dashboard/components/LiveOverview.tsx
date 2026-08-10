"use client";

import { useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  PlayCircle,
  Users,
} from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import { useGlobalAnalytics } from "@/hooks/analytics/useGlobalAnalytics";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import { useScraperLogs } from "@/hooks/data-collection/useScraperLogs";
import { findCurrencyFromOrders } from "@/app/dashboard/orders/utils/orderHelpers";
import { TodaysRenders } from "@/types/scheduler";
import { formatCurrency } from "@/utils/chart-formatters";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "./live-snapshot/LiveSnapshotMetricStrip";
import { RecentScrapeJobsTable } from "./live-snapshot/RecentScrapeJobsTable";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import {
  formatPaymentMixMeta,
  summarizePaymentMixByRevenue,
} from "./live-snapshot/liveSnapshotPaymentMix";
import {
  getCurrentMonthDateRange,
  getCurrentMonthKey,
  getCurrentMonthLabel,
  getCurrentQuarterKey,
  getYearToDateLabel,
  getYearToDateRevenue,
  lookupRevenueCents,
} from "./live-snapshot/liveSnapshotRevenue";

const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";
const DEFAULT_CURRENCY = "AUD";

function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.isRendering).length || 0;
}

function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.queued).length || 0;
}

function getCompletedTodayCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.render?.complete).length || 0;
}

function getScheduledTodayCount(data: TodaysRenders[]) {
  return data?.length || 0;
}

/**
 * Dashboard live snapshot — renders, fleet, revenue, and recent scrape jobs.
 */
export default function LiveOverview() {
  const orderOverviewParams = useMemo(() => getCurrentMonthDateRange(), []);

  const {
    data: todaysRenders,
    isLoading: rendersLoading,
    isError: rendersError,
    isFetching: rendersFetching,
  } = useGetTodaysRenders({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: accountSummary,
    isLoading: accountsLoading,
    isError: accountsError,
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
  } = useAdminOrderOverview(orderOverviewParams, {
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });

  const {
    data: scrapeJobs,
    isLoading: scrapeLoading,
    error: scrapeError,
    refetch: refetchScrape,
    isFetching: scrapeFetching,
  } = useScraperLogs({
    page: 1,
    pageSize: 5,
    refetchInterval: LIVE_OVERVIEW_REFETCH_MS,
  });

  const isRefreshing =
    (rendersFetching && !rendersLoading) ||
    (accountsFetching && !accountsLoading) ||
    (analyticsFetching && !analyticsLoading) ||
    (ordersOverviewFetching && !ordersOverviewLoading) ||
    (scrapeFetching && !scrapeLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const metricItems = useMemo((): LiveSnapshotMetricItem[] => {
    const summary = accountSummary?.data?.Totals;
    const associations = summary?.accountTypesCount?.Association ?? 0;
    const clubs = summary?.accountTypesCount?.Club ?? 0;
    const totalAccounts =
      summary?.count ?? (associations + clubs > 0 ? associations + clubs : 0);

    const analytics = globalAnalytics;
    const inactiveAccounts = analytics?.inactiveAccounts ?? 0;
    const monthKey = getCurrentMonthKey();
    const quarterKey = getCurrentQuarterKey();
    const mtdCents = lookupRevenueCents(
      analytics?.revenueTrends?.monthlyRevenue,
      monthKey,
    );
    const qtdCents = lookupRevenueCents(
      analytics?.revenueTrends?.quarterlyRevenue,
      quarterKey,
    );
    const ytdCents = getYearToDateRevenue(
      analytics?.revenueTrends?.monthlyRevenue,
    );

    const formatRevenue = (cents: number | null) =>
      cents == null
        ? UNAVAILABLE
        : formatCurrency(cents / 100);

    const scheduledToday = getScheduledTodayCount(todaysRenders ?? []);
    const completedToday = getCompletedTodayCount(todaysRenders ?? []);

    const paymentMix = summarizePaymentMixByRevenue(orderOverview?.orders ?? []);
    const paymentCurrency =
      findCurrencyFromOrders(orderOverview?.orders ?? []) ?? DEFAULT_CURRENCY;
    const paymentMixValue =
      ordersOverviewError || paymentMix.totalCents <= 0
        ? ordersOverviewError
          ? UNAVAILABLE
          : "0%"
        : `${paymentMix.stripeSharePercent}%`;
    const paymentMixMeta = ordersOverviewError
      ? UNAVAILABLE_META
      : formatPaymentMixMeta(paymentMix, paymentCurrency);

    return [
      {
        id: "rev-mtd",
        label: "Rev MTD",
        value: analyticsError ? UNAVAILABLE : formatRevenue(mtdCents),
        meta: analyticsError ? UNAVAILABLE_META : getCurrentMonthLabel(),
        icon: DollarSign,
        isLoading: analyticsLoading,
      },
      {
        id: "rev-qtd",
        label: "Rev QTD",
        value: analyticsError ? UNAVAILABLE : formatRevenue(qtdCents),
        meta: analyticsError ? UNAVAILABLE_META : quarterKey,
        icon: DollarSign,
        isLoading: analyticsLoading,
      },
      {
        id: "rev-ytd",
        label: "Rev YTD",
        value: analyticsError ? UNAVAILABLE : formatRevenue(ytdCents),
        meta: analyticsError ? UNAVAILABLE_META : getYearToDateLabel(),
        icon: DollarSign,
        isLoading: analyticsLoading,
      },
      {
        id: "rendering",
        label: "Rendering",
        value: rendersError
          ? UNAVAILABLE
          : String(getRenderingCount(todaysRenders ?? [])),
        meta: rendersError ? UNAVAILABLE_META : "Accounts active today",
        icon: PlayCircle,
        iconClassName: "bg-blue-50 text-blue-700",
        isLoading: rendersLoading,
      },
      {
        id: "queued",
        label: "Queued",
        value: rendersError
          ? UNAVAILABLE
          : String(getQueuedCount(todaysRenders ?? [])),
        meta: rendersError ? UNAVAILABLE_META : "Accounts waiting today",
        icon: Clock,
        iconClassName: "bg-amber-50 text-amber-700",
        isLoading: rendersLoading,
      },
      {
        id: "completed",
        label: "Completed",
        value: rendersError ? UNAVAILABLE : String(completedToday),
        meta: rendersError
          ? UNAVAILABLE_META
          : `${scheduledToday} scheduled today`,
        icon: CheckCircle2,
        iconClassName: "bg-emerald-50 text-emerald-700",
        isLoading: rendersLoading,
      },
      {
        id: "total-accounts",
        label: "Total accounts",
        value: accountsError
          ? UNAVAILABLE
          : totalAccounts.toLocaleString(),
        meta: accountsError
          ? UNAVAILABLE_META
          : `${associations.toLocaleString()} assoc · ${clubs.toLocaleString()} clubs`,
        icon: Users,
        isLoading: accountsLoading,
      },
      {
        id: "active-subs",
        label: "Active subs",
        value: analyticsError
          ? UNAVAILABLE
          : (analytics?.activeAccounts ?? 0).toLocaleString(),
        meta: analyticsError
          ? UNAVAILABLE_META
          : `${inactiveAccounts.toLocaleString()} inactive`,
        icon: Users,
        isLoading: analyticsLoading,
      },
      {
        id: "payment-mix",
        label: "Stripe share",
        value: paymentMixValue,
        meta: paymentMixMeta,
        icon: CreditCard,
        isLoading: ordersOverviewLoading,
      },
    ];
  }, [
    accountSummary,
    accountsError,
    accountsLoading,
    analyticsError,
    analyticsLoading,
    globalAnalytics,
    orderOverview?.orders,
    ordersOverviewError,
    ordersOverviewLoading,
    rendersError,
    rendersLoading,
    todaysRenders,
  ]);

  const initialLoad =
    rendersLoading &&
    accountsLoading &&
    analyticsLoading &&
    ordersOverviewLoading &&
    scrapeLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading live snapshot…"
        className="py-6"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
        <div className="min-w-0">
          <LiveSnapshotMetricStrip items={metricItems} />
        </div>
        <div className="min-w-0">
          <RecentScrapeJobsTable
            jobs={scrapeJobs}
            isLoading={scrapeLoading}
            error={scrapeError}
            onRetry={() => refetchScrape()}
          />
        </div>
    </div>
  );
}
