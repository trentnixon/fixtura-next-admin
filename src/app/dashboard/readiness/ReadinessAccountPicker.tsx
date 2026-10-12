"use client";

import { useMemo, useState } from "react";
import { SubscriptionBadge } from "@/components/modules/tables/SubscriptionBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    return (
      <div className="flex gap-2">
        {(["Club", "Association"] as const).map((type) => (
          <Button
            key={type}
            type="button"
            variant={orgType === type ? "default" : "outline"}
            onClick={() => chooseType(type)}
          >
            {type}
          </Button>
        ))}
      </div>
    );
  }

  if (!orgType) return null;

  return (
    <div className="space-y-3">
          <div className="max-w-sm space-y-1">
            <Label htmlFor="readiness-account-find">Find an account</Label>
            <Input
              id="readiness-account-find"
              value={query}
              placeholder="Name, organisation, or id"
              onChange={(event) => setQuery(event.target.value)}
            />
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
            <p className="text-sm">
              {query.trim()
                ? `No ${orgType.toLowerCase()} accounts match.`
                : `No ${orgType.toLowerCase()} accounts.`}
            </p>
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
