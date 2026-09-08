"use client";

import Link from "next/link";
import { Building2, Sparkles, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import type { AccountFleetOverviewModel } from "@/lib/overview/accountFleetSummary";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";

const CARD_META = {
  associations: {
    icon: Building2,
    iconTone: "bg-violet-50 text-violet-700",
    valueTone: "text-violet-700",
  },
  clubs: {
    icon: Users,
    iconTone: "bg-blue-50 text-blue-700",
    valueTone: "text-blue-700",
  },
} as const;

interface AccountFleetOverviewCardsProps {
  model: AccountFleetOverviewModel | null;
  isLoading: boolean;
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

function NewSignupsCard({
  signups,
  totalAccounts,
}: {
  signups: AccountFleetOverviewModel["signups"];
  totalAccounts: number;
}) {
  const hasSignups = signups.total > 0;

  return (
    <Card
      className={cn(
        "border-slate-200 shadow-sm",
        hasSignups && "border-emerald-200 bg-emerald-50/40"
      )}
    >
      <CardHeader className="p-4 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "rounded-md p-2",
                hasSignups
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              )}
            >
              <UserPlus className="h-4 w-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">New signups</CardTitle>
                <Badge
                  variant="outline"
                  className={cn(
                    hasSignups
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-700"
                  )}
                >
                  Last {signups.windowDays} days
                </Badge>
              </div>
              <div
                className={cn(
                  "mt-1 text-3xl font-bold leading-none",
                  hasSignups ? "text-emerald-800" : "text-slate-700"
                )}
              >
                {signups.total.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:min-w-[220px]">
            <div className="rounded-md bg-white/80 px-3 py-2 ring-1 ring-slate-200">
              <div className="text-xs text-muted-foreground">Associations</div>
              <div className="text-lg font-semibold text-violet-700">
                {signups.associationCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded-md bg-white/80 px-3 py-2 ring-1 ring-slate-200">
              <div className="text-xs text-muted-foreground">Clubs</div>
              <div className="text-lg font-semibold text-blue-700">
                {signups.clubCount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4 pt-0">
        {hasSignups ? (
          signups.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 rounded-md bg-white/80 px-3 py-2 ring-1 ring-slate-200 transition hover:bg-white hover:ring-emerald-200"
            >
              <div className={cn("rounded-md p-1.5", item.tone)}>
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-slate-900">
                  {item.label}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {item.meta}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-md border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              No new accounts in the last {signups.windowDays} days
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalAccounts.toLocaleString()} accounts in the fleet overall
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 px-4 pb-4 pt-0">
        <span className="text-xs text-muted-foreground">
          Based on account signup dates from account summary
        </span>
        <Button
          size="sm"
          variant="ghost"
          className={siteNavigationCtaClass}
          asChild
        >
          <Link href="/dashboard/accounts">Open accounts</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * Association and club fleet cards plus a prominent new-signups activity card.
 */
export function AccountFleetOverviewCards({
  model,
  isLoading,
  error,
  onRetry,
  className,
}: AccountFleetOverviewCardsProps) {
  if (isLoading) {
    return (
      <LoadingState variant="skeleton" className={className}>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="default"
        title="Could not load account summary"
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (!model?.cards.length) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {model.cards.map((card) => {
          const meta = CARD_META[card.id];
          const Icon = meta.icon;

          return (
            <Card key={card.id} className="border-slate-200 shadow-sm">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("rounded-md p-2", meta.iconTone)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                      <div
                        className={cn(
                          "mt-1 text-2xl font-bold leading-none",
                          meta.valueTone
                        )}
                      >
                        {card.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <Badge
                    className="border-transparent bg-slate-100 px-2 py-0.5 text-slate-700"
                    variant="outline"
                  >
                    {card.fleetShareLabel}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 px-4 pb-4 pt-0">
                {card.sportRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"
                  >
                    <span className="text-sm text-slate-600">{row.label}</span>
                    <span
                      className={cn("text-sm font-semibold", row.valueTone)}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="justify-end px-4 pb-4 pt-0">
                <Button
                  size="sm"
                  variant="ghost"
                  className={siteNavigationCtaClass}
                  asChild
                >
                  <Link href={card.href}>{card.actionLabel}</Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <NewSignupsCard signups={model.signups} totalAccounts={model.totalAccounts} />
    </div>
  );
}
