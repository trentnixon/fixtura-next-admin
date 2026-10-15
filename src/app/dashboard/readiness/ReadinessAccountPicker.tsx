"use client";

import { useMemo, useState } from "react";
import { Building2, CheckCircle2, Search, Users } from "lucide-react";
import { SubscriptionBadge } from "@/components/modules/tables/SubscriptionBadge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { cn } from "@/lib/utils";
import type { AccountLookupItem } from "@/types/adminAccountLookup";

export type ReadinessOrgType = "Club" | "Association";

type OrgType = ReadinessOrgType;

function organisationNames(account: AccountLookupItem, orgType: OrgType) {
  const organisations =
    orgType === "Association" ? account.associations : account.clubs;
  return organisations
    .map((organisation) => organisation.name?.trim() ?? "")
    .filter((name) => name.length > 0);
}

function matchesQuery(account: AccountLookupItem, orgType: OrgType, query: string) {
  if (query === "") return true;
  const haystack = [
    account.FirstName,
    account.email,
    String(account.id),
    account.Sport,
    ...organisationNames(account, orgType),
  ]
    .filter((value): value is string => value != null && value !== "")
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function ReadinessAccountPicker({
  view,
  orgType,
  onOrgTypeChange,
  selectedAccountId,
  onSelect,
}: {
  view: "type" | "accounts";
  orgType: OrgType | null;
  onOrgTypeChange: (orgType: OrgType) => void;
  selectedAccountId: string;
  onSelect: (accountId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const accountsQuery = useAccountsQuery();

  const accounts = useMemo(() => {
    if (!orgType || !accountsQuery.data) return [];
    const group =
      orgType === "Club"
        ? accountsQuery.data.clubs
        : accountsQuery.data.associations;
    const needle = query.trim().toLowerCase();
    return [...group.active, ...group.inactive]
      .filter((account) => matchesQuery(account, orgType, needle))
      .sort((left, right) =>
        (left.FirstName ?? "").localeCompare(right.FirstName ?? "", "en"),
      );
  }, [accountsQuery.data, orgType, query]);

  function chooseType(next: OrgType) {
    if (next === orgType) return;
    setQuery("");
    onOrgTypeChange(next);
    if (selectedAccountId) onSelect("");
  }

  if (view === "type") {
    const options = [
      {
        type: "Club" as const,
        description: "Fixtures for this club's teams.",
        icon: Users,
      },
      {
        type: "Association" as const,
        description: "Fixtures across the association.",
        icon: Building2,
      },
    ];

    return (
      <MetricGrid columns={2}>
        {options.map((option) => {
          const selected = orgType === option.type;
          const Icon = option.icon;
          return (
            <Card
              key={option.type}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => chooseType(option.type)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                chooseType(option.type);
              }}
              className={cn(
                "cursor-pointer transition hover:border-brandPrimary-300 hover:shadow-md",
                selected && "border-brandPrimary-300 bg-brandPrimary-50 shadow-md",
              )}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "rounded-md p-2",
                        selected
                          ? "bg-brandPrimary-100 text-brandPrimary-800"
                          : "bg-slate-100 text-slate-600",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base">{option.type}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </div>
                  </div>
                  {selected ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-brandPrimary-700" />
                  ) : null}
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </MetricGrid>
    );
  }

  if (!orgType) return null;

  return (
    <div className="space-y-3">
          <div className="max-w-sm space-y-1.5">
            <Label htmlFor="readiness-account-find">Find an account</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="readiness-account-find"
                className="pl-8"
                value={query}
                placeholder="Name, organisation, or id"
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          {accountsQuery.isLoading ? (
            <LoadingState message="Loading accounts..." variant="minimal" />
          ) : null}

          {accountsQuery.isError ? (
            <ErrorState
              error={
                accountsQuery.error instanceof Error
                  ? accountsQuery.error
                  : new Error("Failed to load accounts")
              }
              onRetry={() => void accountsQuery.refetch()}
              variant="default"
            />
          ) : null}

          {accountsQuery.data && accounts.length === 0 ? (
            <EmptyState
              variant="card"
              title={
                query.trim()
                  ? `No ${orgType.toLowerCase()} accounts match`
                  : `No ${orgType.toLowerCase()} accounts`
              }
              description={
                query.trim()
                  ? "Try another name, organisation, or account id."
                  : "None are available for this organisation type."
              }
              icon={<Search className="h-12 w-12 text-muted-foreground" />}
            />
          ) : null}

          {accounts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Account</TableHead>
                  <TableHead>Organisation</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Subscription</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const selected = String(account.id) === selectedAccountId;
                  const names = organisationNames(account, orgType);
                  return (
                    <TableRow
                      key={account.id}
                      data-state={selected ? "selected" : undefined}
                      className={cn("cursor-pointer", selected && "bg-slate-100")}
                      onClick={() => onSelect(String(account.id))}
                    >
                      <TableCell>
                        <p className="text-sm font-medium">
                          {account.FirstName || "Unnamed account"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Account ID {account.id}
                        </p>
                      </TableCell>
                      <TableCell>
                        {names.length > 0 ? names.join(", ") : "Not provided"}
                      </TableCell>
                      <TableCell>
                        {account.Sport ? (
                          <Badge variant="outline">{account.Sport}</Badge>
                        ) : (
                          "Not provided"
                        )}
                      </TableCell>
                      <TableCell>
                        <SubscriptionBadge
                          hasActiveOrder={account.hasActiveOrder}
                          daysLeftOnSubscription={account.daysLeftOnSubscription}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : null}
    </div>
  );
}
