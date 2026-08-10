"use client";

import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { AccountTable } from "@/components/modules/tables/AccountTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import AssociationEmails from "./associationEmails";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AlertTriangle, CheckCircle2, CreditCard, Trophy } from "lucide-react";
import { AccountLookupItem } from "@/types/adminAccountLookup";

export default function DisplayAssociationsTable() {
  const { data, isLoading, isError, error, refetch } = useAccountsQuery();

  if (isLoading) {
    return <LoadingState variant="default" />;
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load associations")
        }
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const { active: activeAssociations, inactive: inactiveAssociations } =
    data!.associations;
  const allAssociations = [...activeAssociations, ...inactiveAssociations];

  return (
    <Tabs defaultValue="snapshot" className="space-y-4">
      <TabsList
        variant="secondary"
        className="h-auto flex-wrap justify-start gap-1 rounded-md"
      >
        <TabsTrigger value="snapshot">Association Snapshot</TabsTrigger>
        <TabsTrigger value="active">
          Active ({activeAssociations.length})
        </TabsTrigger>
        <TabsTrigger value="inactive">
          Inactive ({inactiveAssociations.length})
        </TabsTrigger>
        <TabsTrigger value="emails">Contacts</TabsTrigger>
      </TabsList>

      <TabsContent value="snapshot">
        <SectionContainer
          title="Association Snapshot"
          description="Compact account coverage, subscription, and setup status."
        >
          <div className="space-y-6">
            <AssociationSnapshot accounts={allAssociations} />
            <AccountStats accounts={allAssociations} />
          </div>
        </SectionContainer>
      </TabsContent>

      <TabsContent value="active">
        <SectionContainer
          title="Active Association Accounts"
          description="Association accounts with current subscriptions."
        >
          <AccountTable
            accounts={activeAssociations}
            emptyMessage="No associations with active subscriptions available."
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="inactive">
        <SectionContainer
          title="Inactive Association Accounts"
          description="Association accounts without an active subscription."
        >
          <AccountTable
            accounts={inactiveAssociations}
            emptyMessage="No associations with inactive subscriptions available."
          />
        </SectionContainer>
      </TabsContent>

      <TabsContent value="emails">
        <AssociationEmails initialFilter="active" hideAllFilter />
      </TabsContent>
    </Tabs>
  );
}

function AssociationSnapshot({ accounts }: { accounts: AccountLookupItem[] }) {
  const total = accounts.length;
  const active = accounts.filter((account) => account.hasActiveOrder).length;
  const inactive = total - active;
  const setupComplete = accounts.filter((account) => account.isSetup).length;
  const expiringSoon = accounts.filter(
    (account) =>
      account.hasActiveOrder &&
      account.daysLeftOnSubscription !== null &&
      account.daysLeftOnSubscription <= 30,
  ).length;
  const sports = new Set(
    accounts
      .map((account) => account.Sport)
      .filter((sport): sport is string => Boolean(sport)),
  ).size;
  const setupRate = total > 0 ? Math.round((setupComplete / total) * 100) : 0;
  const activeRate = total > 0 ? Math.round((active / total) * 100) : 0;

  const metrics = [
    {
      label: "Total Accounts",
      value: total.toLocaleString(),
      detail: `${activeRate}% active subscription coverage`,
      icon: CreditCard,
    },
    {
      label: "Inactive",
      value: inactive.toLocaleString(),
      detail: `${active.toLocaleString()} active accounts`,
      icon: AlertTriangle,
    },
    {
      label: "Setup Complete",
      value: `${setupRate}%`,
      detail: `${setupComplete.toLocaleString()} configured`,
      icon: CheckCircle2,
    },
    {
      label: "Sports",
      value: sports.toLocaleString(),
      detail: `${expiringSoon.toLocaleString()} expiring within 30 days`,
      icon: Trophy,
    },
  ];

  return (
    <div className="grid overflow-hidden rounded-md border bg-white sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div
            key={metric.label}
            className="flex items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 sm:even:border-l xl:border-b-0 xl:border-l xl:first:border-l-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                {metric.label}
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {metric.value}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {metric.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
