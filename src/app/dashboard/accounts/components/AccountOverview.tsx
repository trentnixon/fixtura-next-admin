"use client";

import { Building2, Clock, Trophy, Users } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import { AccountFleetOverviewCards } from "@/app/dashboard/components/live-snapshot/AccountFleetOverviewCards";
import { buildAccountFleetOverview } from "@/lib/overview/accountFleetSummary";

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

  const accountFleetOverview = buildAccountFleetOverview(summary);

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
      <AccountFleetOverviewCards
        model={accountFleetOverview}
        isLoading={false}
        error={null}
      />

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
