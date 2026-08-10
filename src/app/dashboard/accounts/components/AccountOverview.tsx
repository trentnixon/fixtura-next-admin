"use client";

import { Building2, Clock, Trophy, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";

type OverviewCard = {
  title: string;
  value: string;
  detail: string;
  badge?: string;
  icon: typeof Building2;
  iconTone: string;
  barTone: string;
  progress: string;
  href: string;
  actionLabel: string;
};

type CompactMetric = {
  label: string;
  value: string;
  detail: string;
  icon: typeof Trophy;
};

/**
 * Account summary metrics — card.stat.modern-overview + card.base.compact-kpi
 */
export default function AccountOverview() {
  const { data, isLoading, isError, error, refetch } =
    useAccountSummaryQuery();

  if (isLoading) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading account summary…"
        className="py-6"
      />
    );
  }

  if (isError && error) {
    return (
      <ErrorState
        error={error instanceof Error ? error : new Error(String(error))}
        title="Could not load account summary"
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const summary = data?.data?.Totals;
  if (!summary) {
    return (
      <EmptyState
        title="No account summary"
        description="Summary data is unavailable."
      />
    );
  }

  const associations = summary.accountTypesCount?.Association ?? 0;
  const clubs = summary.accountTypesCount?.Club ?? 0;
  const totalAccounts = summary.count || associations + clubs;
  const cricket = summary.sportsCount?.Cricket ?? 0;
  const afl = summary.sportsCount?.AFL ?? 0;
  const netball = summary.sportsCount?.Netball ?? 0;
  const activeTrials = summary.trialInstanceStatus?.active ?? 0;
  const expiredTrials = summary.trialInstanceStatus?.expired ?? 0;
  const setupComplete = summary.isSetupCount?.true ?? 0;
  const setupRate =
    totalAccounts > 0 ? Math.round((setupComplete / totalAccounts) * 100) : 0;
  const associationShare =
    totalAccounts > 0 ? Math.round((associations / totalAccounts) * 100) : 0;
  const clubShare =
    totalAccounts > 0 ? Math.round((clubs / totalAccounts) * 100) : 0;

  const associationsBySport =
    summary.sportsPerAccountTypeCount?.Association ?? {};
  const clubsBySport = summary.sportsPerAccountTypeCount?.Club ?? {};

  const overviewCards: OverviewCard[] = [
    {
      title: "Associations",
      value: associations.toLocaleString(),
      detail: `${associationsBySport.Cricket ?? 0} Cricket · ${associationsBySport.AFL ?? 0} AFL · ${associationsBySport.Netball ?? 0} Netball`,
      badge: `${associationShare}% of fleet`,
      icon: Building2,
      iconTone: "bg-violet-50 text-violet-700",
      barTone: "bg-violet-500",
      progress: `${associationShare}%`,
      href: "/dashboard/accounts/association",
      actionLabel: "View associations",
    },
    {
      title: "Clubs",
      value: clubs.toLocaleString(),
      detail: `${clubsBySport.Cricket ?? 0} Cricket · ${clubsBySport.AFL ?? 0} AFL · ${clubsBySport.Netball ?? 0} Netball`,
      badge: `${clubShare}% of fleet`,
      icon: Users,
      iconTone: "bg-blue-50 text-blue-700",
      barTone: "bg-blue-500",
      progress: `${clubShare}%`,
      href: "/dashboard/accounts/club",
      actionLabel: "View clubs",
    },
  ];

  const compactMetrics: CompactMetric[] = [
    {
      label: "Sports mix",
      value: `${cricket + afl + netball}`,
      detail: `${cricket} Cricket · ${afl} AFL · ${netball} Netball`,
      icon: Trophy,
    },
    {
      label: "Active trials",
      value: activeTrials.toLocaleString(),
      detail: `${expiredTrials} expired trials`,
      icon: Clock,
    },
    {
      label: "Setup complete",
      value: `${setupRate}%`,
      detail: `${setupComplete.toLocaleString()} configured accounts`,
      icon: Building2,
    },
    {
      label: "Total accounts",
      value: totalAccounts.toLocaleString(),
      detail: `${associations} associations · ${clubs} clubs`,
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              className="overflow-hidden border-slate-200 shadow-sm"
              key={card.title}
            >
              <CardContent className="p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className={`rounded-md p-2 ${card.iconTone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {card.badge ? (
                    <Badge
                      className="border-transparent bg-slate-100 px-2 py-0.5 text-slate-700"
                      variant="outline"
                    >
                      {card.badge}
                    </Badge>
                  ) : null}
                </div>
                <div className="text-2xl font-bold leading-none text-slate-950">
                  {card.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-slate-700">
                  {card.title}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {card.detail}
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${card.barTone}`}
                    style={{ width: card.progress }}
                  />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={card.href}>{card.actionLabel}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        {compactMetrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </div>
                <div className="mt-0.5 text-lg font-semibold text-slate-950">
                  {metric.value}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {metric.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
