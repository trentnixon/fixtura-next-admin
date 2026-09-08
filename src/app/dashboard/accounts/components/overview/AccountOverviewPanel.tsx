"use client";

import { ReactNode } from "react";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Film,
} from "lucide-react";
import { useAccountAnalytics } from "@/hooks/analytics/useAccountAnalytics";
import { cn, formatDate } from "@/lib/utils";

type AccountOverviewPanelProps = {
  accountData: fixturaContentHubAccountDetails;
};

type MetricTone = "success" | "error" | "warning" | "info" | "accent" | "neutral";

type OverviewMetricItem = {
  label: string;
  value: string;
  detail?: string;
  icon: ReactNode;
  tone?: MetricTone;
  valueClassName?: string;
};

const metricIconToneClass: Record<MetricTone, string> = {
  success: "bg-brandSuccess-100 text-brandSuccess-700",
  error: "bg-brandError-100 text-brandError-700",
  warning: "bg-brandWarning-100 text-brandWarning-800",
  info: "bg-brandInfo-100 text-brandInfo-700",
  accent: "bg-brandAccent-100 text-brandAccent-700",
  neutral: "bg-slate-100 text-slate-600",
};

export default function AccountOverviewPanel({
  accountData,
}: AccountOverviewPanelProps) {
  const renderCount = accountData.rollup?.totalRenders ?? 0;
  const completedRenders = accountData.rollup?.totalCompleteRenders ?? 0;
  const schedulerStatus = accountData.scheduler?.Queued
    ? "Queued"
    : accountData.scheduler?.isRendering
      ? "Rendering"
      : "Idle";
  const schedulerIsBusy =
    schedulerStatus === "Queued" || schedulerStatus === "Rendering";

  const { data: analytics, isLoading: isSubscriptionLoading } =
    useAccountAnalytics(String(accountData.id));
  const subscription = analytics?.currentSubscription ?? null;
  const hasActiveSubscription = subscription?.isActive ?? false;
  const subscriptionEndDate = formatSubscriptionEndDate(subscription?.endDate);
  const daysLeft = getSubscriptionDaysLeft(subscription?.endDate);
  const daysLeftLabel =
    daysLeft != null ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}` : "—";

  const accountMetrics: OverviewMetricItem[] = [
    {
      label: "Account status",
      icon: <CheckCircle2 className="h-4 w-4" />,
      tone: accountData.isActive ? "success" : "error",
      value: accountData.isActive ? "Active" : "Inactive",
      valueClassName: !accountData.isActive ? "text-brandError-700" : undefined,
    },
    {
      label: "Renders",
      icon: <Film className="h-4 w-4" />,
      tone: "neutral",
      value: `${completedRenders}/${renderCount}`,
      detail: "complete / total",
    },
    {
      label: "Scheduler",
      icon: <Clock className="h-4 w-4" />,
      tone: schedulerIsBusy ? "info" : "neutral",
      value: schedulerStatus,
      valueClassName: cn(
        schedulerIsBusy && "text-brandInfo-700",
        schedulerStatus === "Idle" && "text-slate-700",
      ),
    },
  ];

  const subscriptionMetric = buildSubscriptionMetric({
    isLoading: isSubscriptionLoading,
    hasActiveSubscription,
    subscriptionEndDate,
    daysLeft,
    daysLeftLabel,
  });

  return (
    <div className="flex flex-col gap-3">
      <MetricGroup title="Account" metrics={accountMetrics} />
      <MetricGroup title="Subscription" metrics={[subscriptionMetric]} />
    </div>
  );
}

function buildSubscriptionMetric({
  isLoading,
  hasActiveSubscription,
  subscriptionEndDate,
  daysLeft,
  daysLeftLabel,
}: {
  isLoading: boolean;
  hasActiveSubscription: boolean;
  subscriptionEndDate: string;
  daysLeft: number | null;
  daysLeftLabel: string;
}): OverviewMetricItem {
  if (isLoading) {
    return {
      label: "Subscription",
      icon: <CalendarDays className="h-4 w-4" />,
      tone: "neutral",
      value: "…",
    };
  }

  if (!hasActiveSubscription) {
    return {
      label: "Subscription",
      icon: <CalendarDays className="h-4 w-4" />,
      tone: "error",
      value: "No active subscription",
      valueClassName: "text-brandError-700",
    };
  }

  const tone: MetricTone =
    daysLeft == null ? "info" : daysLeft <= 30 ? "warning" : "accent";

  if (daysLeft != null) {
    return {
      label: "Subscription",
      icon: <CalendarDays className="h-4 w-4" />,
      tone,
      value: `${daysLeftLabel} remaining`,
      detail:
        subscriptionEndDate !== "—" ? `Ends ${subscriptionEndDate}` : undefined,
      valueClassName:
        daysLeft <= 30 ? "text-brandWarning-700" : undefined,
    };
  }

  return {
    label: "Subscription",
    icon: <CalendarDays className="h-4 w-4" />,
    tone: "info",
    value: subscriptionEndDate,
  };
}

function MetricGroup({
  title,
  metrics,
}: {
  title: string;
  metrics: OverviewMetricItem[];
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-md border border-slate-200 bg-white">
        {metrics.map((metric) => (
          <OverviewMetric key={metric.label} {...metric} />
        ))}
      </div>
    </div>
  );
}

function OverviewMetric({
  icon,
  label,
  value,
  detail,
  tone = "neutral",
  valueClassName,
}: OverviewMetricItem) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          metricIconToneClass[tone],
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 text-lg font-semibold leading-none text-slate-950 tabular-nums",
            valueClassName,
          )}
        >
          {value}
        </p>
        {detail && (
          <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );
}

function formatSubscriptionEndDate(
  date: string | null | undefined,
): string {
  if (!date) return "—";

  const dateObj = new Date(date);
  if (Number.isNaN(dateObj.getTime())) return "—";

  const epochTime = new Date("1970-01-01T00:00:00Z").getTime();
  const minReasonableDate = new Date("2000-01-01T00:00:00Z").getTime();
  const dateTime = dateObj.getTime();

  if (dateTime <= epochTime || dateTime < minReasonableDate) {
    return "—";
  }

  return formatDate(date);
}

function getSubscriptionDaysLeft(
  endDate: string | null | undefined,
): number | null {
  if (!endDate) return null;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;

  const epochTime = new Date("1970-01-01T00:00:00Z").getTime();
  const minReasonableDate = new Date("2000-01-01T00:00:00Z").getTime();
  const dateTime = end.getTime();

  if (dateTime <= epochTime || dateTime < minReasonableDate) {
    return null;
  }

  return Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}
