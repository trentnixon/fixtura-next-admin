"use client";

import { ReactNode } from "react";
import AccountBasics from "./AccountBasics";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  Film,
  PlayCircle,
  Timer,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import AccountSyncButton from "./tabs/components/AccountSyncButton";
import TriggerAccountAssetRunMenu from "../account-asset-run/TriggerAccountAssetRunMenu";
import { useAccountAssetRunLatest } from "@/hooks/account-asset-run/useAccountAssetRunLatest";
import { useAccountAnalytics } from "@/hooks/analytics/useAccountAnalytics";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import type { AccountAssetRunAccountOrgType } from "@/lib/account-asset-run/accountRoutes";
import { cn, formatDate } from "@/lib/utils";

type AccountOverviewPanelProps = {
  accountData: fixturaContentHubAccountDetails;
  accountType: AccountAssetRunAccountOrgType;
  syncAccountType: "CLUB" | "ASSOCIATION";
};

export default function AccountOverviewPanel({
  accountData,
  accountType,
  syncAccountType,
}: AccountOverviewPanelProps) {
  const holderName = [accountData.FirstName, accountData.LastName]
    .filter(Boolean)
    .join(" ");
  const renderCount = accountData.rollup?.totalRenders ?? 0;
  const completedRenders = accountData.rollup?.totalCompleteRenders ?? 0;
  const schedulerStatus = accountData.scheduler?.Queued
    ? "Queued"
    : accountData.scheduler?.isRendering
      ? "Rendering"
      : "Idle";
  const schedulerIsBusy =
    schedulerStatus === "Queued" || schedulerStatus === "Rendering";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Account overview
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Actions, metrics, and contact details
          </p>
        </div>
        <AccountSnapshotActions
          accountData={accountData}
          accountType={accountType}
          syncAccountType={syncAccountType}
        />
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-stretch">
        <div className="min-w-0 divide-y divide-slate-200">
          <AccountStatusSection accountData={accountData} embedded inColumn />

          <div className="grid sm:grid-cols-2">
            <OverviewMetric
              icon={<Film className="h-4 w-4" />}
              label="Renders"
              value={`${completedRenders}/${renderCount}`}
              helper="complete / total"
            />
            <OverviewMetric
              icon={<Clock className="h-4 w-4" />}
              label="Scheduler"
              value={schedulerStatus}
              valueClassName={cn(
                schedulerIsBusy && "text-brandInfo-700",
                schedulerStatus === "Idle" && "text-slate-700",
              )}
            />
          </div>
        </div>

        <div className="flex min-h-full flex-col border-t border-slate-200 lg:border-l lg:border-t-0">
          <AccountBasics
            account={accountData}
            holderName={holderName}
            embedded
            fullHeight
          />
        </div>
      </div>
    </div>
  );
}

function AccountStatusSection({
  accountData,
  embedded = false,
  inColumn = false,
}: {
  accountData: fixturaContentHubAccountDetails;
  embedded?: boolean;
  inColumn?: boolean;
}) {
  const { data: analytics, isLoading: isSubscriptionLoading } =
    useAccountAnalytics(String(accountData.id));
  const subscription = analytics?.currentSubscription ?? null;
  const hasActiveSubscription = subscription?.isActive ?? false;
  const subscriptionEndDate = formatSubscriptionEndDate(subscription?.endDate);
  const daysLeft = getSubscriptionDaysLeft(subscription?.endDate);
  const daysLeftLabel =
    daysLeft != null
      ? `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`
      : "—";

  const daysLeftValueClassName =
    daysLeft != null && daysLeft <= 30 ? "text-brandWarning-700" : undefined;

  return (
    <div>
      <div
        className={cn(
          "overflow-hidden bg-slate-200",
          embedded && "border-t border-slate-200",
          !embedded && "rounded-lg border border-slate-200",
        )}
      >
        <div
          className={cn(
            "grid gap-px",
            inColumn ? "grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          <AccountStatusCell
            label="Active"
            icon={<CheckCircle2 className="h-4 w-4" />}
            iconTone={accountData.isActive ? "success" : "error"}
            value={accountData.isActive ? "Active" : "Inactive"}
            valueClassName={
              !accountData.isActive ? "text-brandError-700" : undefined
            }
            compact={inColumn}
          />
          <AccountStatusCell
            label="Has active subscription"
            icon={<CreditCard className="h-4 w-4" />}
            iconTone={
              isSubscriptionLoading
                ? "neutral"
                : hasActiveSubscription
                  ? "success"
                  : "error"
            }
            value={
              isSubscriptionLoading
                ? "…"
                : hasActiveSubscription
                  ? "Yes"
                  : "No"
            }
            valueClassName={
              !isSubscriptionLoading && !hasActiveSubscription
                ? "text-brandError-700"
                : undefined
            }
            compact={inColumn}
          />
          <AccountStatusCell
            label="Subscription finished"
            icon={<CalendarDays className="h-4 w-4" />}
            iconTone="info"
            value={isSubscriptionLoading ? "…" : subscriptionEndDate}
            compact={inColumn}
          />
          <AccountStatusCell
            label="Days left in sub"
            icon={<Timer className="h-4 w-4" />}
            iconTone={
              daysLeft == null
                ? "neutral"
                : daysLeft <= 30
                  ? "warning"
                  : "accent"
            }
            value={isSubscriptionLoading ? "…" : daysLeftLabel}
            valueClassName={daysLeftValueClassName}
            compact={inColumn}
          />
        </div>
      </div>
    </div>
  );
}

type StatusIconTone = "success" | "error" | "warning" | "info" | "accent" | "neutral";

const statusIconToneClass: Record<StatusIconTone, string> = {
  success:
    "bg-brandSuccess-100 text-brandSuccess-700 ring-1 ring-brandSuccess-200/70",
  error: "bg-brandError-100 text-brandError-700 ring-1 ring-brandError-200/70",
  warning:
    "bg-brandWarning-100 text-brandWarning-800 ring-1 ring-brandWarning-200/70",
  info: "bg-brandInfo-100 text-brandInfo-700 ring-1 ring-brandInfo-200/70",
  accent:
    "bg-brandAccent-100 text-brandAccent-700 ring-1 ring-brandAccent-200/70",
  neutral: "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80",
};

function AccountStatusCell({
  label,
  icon,
  iconTone = "neutral",
  value,
  valueClassName,
  compact = false,
}: {
  label: string;
  icon: ReactNode;
  iconTone?: StatusIconTone;
  value: string;
  valueClassName?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-start gap-2 bg-white",
        compact ? "px-3 py-3" : "gap-3 px-4 py-4",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md",
          statusIconToneClass[iconTone],
          compact ? "h-8 w-8" : "h-9 w-9",
        )}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground leading-tight">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 font-semibold leading-none tabular-nums text-slate-900",
            compact ? "text-base" : "text-xl",
            valueClassName,
          )}
        >
          {value}
        </p>
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

function OverviewMetric({
  icon,
  label,
  value,
  helper,
  valueClassName,
}: {
  icon: ReactNode;
  label: string;
  value: string | number;
  helper?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:[&:nth-child(2n)]:border-r-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            "mt-1 text-xl font-semibold leading-none text-slate-900",
            valueClassName,
          )}
        >
          {value}
        </p>
        {helper && (
          <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
        )}
      </div>
    </div>
  );
}

function AccountSnapshotActions({
  accountData,
  accountType,
  syncAccountType,
}: {
  accountData: fixturaContentHubAccountDetails;
  accountType: AccountAssetRunAccountOrgType;
  syncAccountType: "CLUB" | "ASSOCIATION";
}) {
  const { strapiLocation } = useGlobalContext();
  const playHqUrl = accountData.accountOrganisationDetails?.href;
  const strapiUrl = strapiLocation?.account
    ? `${strapiLocation.account}${accountData.id}`
    : null;

  const { data: assetLatest } = useAccountAssetRunLatest(accountData.id);
  const latestAssetRun = assetLatest?.data ?? null;
  const liveAssetRun =
    latestAssetRun !== null && isAssetRunActive(latestAssetRun.status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <TriggerAccountAssetRunMenu
        accountId={accountData.id}
        accountType={accountType}
        liveRun={Boolean(liveAssetRun)}
        activeRunId={latestAssetRun?.id}
      />
      <AccountSyncButton
        accountId={accountData.id}
        accountType={syncAccountType}
        variant="primary"
        size="sm"
      />
      {(playHqUrl || strapiUrl) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm">
              <ExternalLink className="h-4 w-4" />
              Open
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Destinations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {playHqUrl && (
              <DropdownMenuItem asChild>
                <a href={playHqUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="h-4 w-4" />
                  PlayHQ
                </a>
              </DropdownMenuItem>
            )}
            {strapiUrl && (
              <DropdownMenuItem asChild>
                <a href={strapiUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  CMS account
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
