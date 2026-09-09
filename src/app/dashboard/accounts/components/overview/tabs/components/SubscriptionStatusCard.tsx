"use client";

import { type ReactNode } from "react";
import { AccountAnalytics } from "@/types/analytics";
import { LoadingState, EmptyState } from "@/components/ui-library";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { CalendarDays, Clock, Ticket } from "lucide-react";

/**
 * SubscriptionStatusCard Component
 *
 * Displays comprehensive season pass information including current status,
 * active season details, renewal information, and season pass history.
 *
 * @param analytics - Account analytics data
 */

const MIN_REASONABLE_DATE = new Date("2000-01-01T00:00:00Z").getTime();
const EPOCH_TIME = new Date("1970-01-01T00:00:00Z").getTime();

function parseValidDate(date: string | null | undefined): Date | null {
  if (!date) return null;

  const dateObj = new Date(date);
  const dateTime = dateObj.getTime();

  if (isNaN(dateTime) || dateTime <= EPOCH_TIME || dateTime < MIN_REASONABLE_DATE) {
    return null;
  }

  return dateObj;
}

const safeFormatDate = (date: string | null | undefined): string => {
  if (!date) return "—";
  const dateObj = parseValidDate(date);
  return dateObj ? formatDate(date) : "—";
};

function SeasonPassStatusSkeleton() {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Skeleton className="h-16 rounded-md" />
        <Skeleton className="h-16 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-2 w-full rounded-full" />
      <Skeleton className="mt-4 h-10 rounded-md" />
    </div>
  );
}

export default function SubscriptionStatusCard({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics) {
    return (
      <LoadingState variant="skeleton" message="Loading subscription status...">
        <SeasonPassStatusSkeleton />
      </LoadingState>
    );
  }

  const currentSubscription = analytics?.currentSubscription;

  if (!currentSubscription) {
    return <EmptyState title="No active season pass" variant="minimal" />;
  }

  const isActive = currentSubscription.isActive || false;
  const startDate = parseValidDate(currentSubscription.startDate);
  const endDate = parseValidDate(currentSubscription.endDate);

  const daysUntilRenewal = endDate ? getDaysUntil(endDate) : null;

  const totalSeasonDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const seasonProgress =
    totalSeasonDays && daysUntilRenewal !== null
      ? Math.min(
          100,
          Math.max(0, ((totalSeasonDays - daysUntilRenewal) / totalSeasonDays) * 100),
        )
      : null;

  const isRenewalSoon =
    isActive && daysUntilRenewal !== null && daysUntilRenewal > 0 && daysUntilRenewal <= 30;
  const isExpired =
    daysUntilRenewal !== null && daysUntilRenewal <= 0;

  const cardTone = isActive
    ? isRenewalSoon
      ? "border-amber-200 bg-amber-50/50"
      : isExpired
        ? "border-amber-200 bg-amber-50/40"
        : "border-emerald-200 bg-emerald-50/40"
    : "border-slate-200 bg-slate-50/60";

  const iconTone = isActive
    ? isRenewalSoon || isExpired
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700"
    : "bg-slate-100 text-slate-600";

  const statusBadgeTone = isActive
    ? isRenewalSoon || isExpired
      ? "border-amber-300 bg-amber-100 text-amber-900"
      : "border-emerald-300 bg-emerald-100 text-emerald-900"
    : "border-slate-200 bg-white text-slate-700";

  const countdownTone = isActive
    ? isRenewalSoon || isExpired
      ? "border-amber-200/80 bg-white/90 text-amber-900"
      : "border-emerald-200/80 bg-white/90 text-emerald-900"
    : "border-slate-200 bg-white/90 text-slate-700";

  const countdownMessage =
    daysUntilRenewal === null
      ? null
      : daysUntilRenewal > 0
        ? `${daysUntilRenewal} days remaining in season`
        : isActive
          ? "Season pass expired"
          : "Renewal overdue";

  return (
    <div className={cn("rounded-lg border p-4 shadow-sm", cardTone)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={cn("rounded-md p-2.5", iconTone)}>
            <Ticket className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Season Pass Status
            </p>
            <p className="mt-0.5 text-lg font-semibold leading-none text-slate-900">
              {currentSubscription.tier}
            </p>
          </div>
        </div>

        <Badge variant="outline" className={cn("rounded-full text-xs", statusBadgeTone)}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <DateTile
          label="Start Date"
          value={safeFormatDate(currentSubscription.startDate)}
          icon={<CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        <DateTile
          label="End Date"
          value={safeFormatDate(currentSubscription.endDate)}
          icon={<CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />}
        />
      </div>

      {seasonProgress !== null && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Season progress</span>
            <span>{Math.round(seasonProgress)}%</span>
          </div>
          <Progress
            value={seasonProgress}
            className="h-2 bg-white/80"
            indicatorClassName={cn(
              isActive && !isExpired && !isRenewalSoon && "bg-emerald-500",
              (isRenewalSoon || isExpired) && "bg-amber-500",
              !isActive && "bg-slate-400",
            )}
          />
        </div>
      )}

      {countdownMessage && (
        <div
          className={cn(
            "mt-4 flex items-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium",
            countdownTone,
          )}
        >
          <Clock className="h-4 w-4 shrink-0 opacity-80" />
          <span>{countdownMessage}</span>
        </div>
      )}
    </div>
  );
}

function getDaysUntil(endDate: Date): number {
  return Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function DateTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-md bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
      <div className="flex items-center gap-1.5">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
