"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Mail,
  ShoppingCart,
  User,
  XCircle,
} from "lucide-react";

import { AccountDetail } from "@/types/associationDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

interface AccountsListProps {
  accounts: AccountDetail[];
}

export default function AccountsList({ accounts }: AccountsListProps) {
  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      if (a.lastName !== b.lastName) {
        if (a.lastName === null) return 1;
        if (b.lastName === null) return -1;
        return a.lastName.localeCompare(b.lastName);
      }
      if (a.firstName !== b.firstName) {
        if (a.firstName === null) return 1;
        if (b.firstName === null) return -1;
        return a.firstName.localeCompare(b.firstName);
      }
      return a.id - b.id;
    });
  }, [accounts]);

  if (sortedAccounts.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 px-4 py-5">
        <p className="text-sm font-medium text-slate-900">
          No linked association accounts
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          This association does not have any Fixtura accounts connected yet.
        </p>
      </div>
    );
  }

  return (
    <Table className="min-w-[780px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[280px]">Account</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Setup</TableHead>
          <TableHead>Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAccounts.map((account) => {
          const displayName =
            [account.firstName, account.lastName].filter(Boolean).join(" ") ||
            "Unnamed Account";

          return (
            <TableRow key={account.id}>
              <TableCell>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {displayName}
                  </p>
                  {account.email ? (
                    <a
                      href={`mailto:${account.email}`}
                      className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                    >
                      <Mail className="h-3 w-3" />
                      {account.email}
                    </a>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Account #{account.id}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {account.accountType ? (
                  <Badge variant="outline" className="gap-1 bg-slate-50">
                    <User className="h-3 w-3" />
                    {account.accountType.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {account.subscriptionTier ? (
                  <Badge variant="outline" className="gap-1 bg-slate-50">
                    <CreditCard className="h-3 w-3" />
                    {account.subscriptionTier.name}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge
                  status={account.isActive}
                  trueLabel="Active"
                  falseLabel="Inactive"
                  variant={account.isActive ? "default" : "neutral"}
                />
              </TableCell>
              <TableCell>
                <SetupStatus complete={account.isSetup} />
              </TableCell>
              <TableCell>
                {account.hasActiveOrder ? (
                  <Badge
                    variant="outline"
                    className="gap-1 border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
                    <ShoppingCart className="h-3 w-3" />
                    Active
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/dashboard/accounts/association/${account.id}`}>
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function SetupStatus({ complete }: { complete: boolean }) {
  const Icon = complete ? CheckCircle2 : XCircle;

  return (
    <span
      className={
        complete
          ? "inline-flex items-center gap-1.5 text-sm text-emerald-700"
          : "inline-flex items-center gap-1.5 text-sm text-amber-700"
      }
    >
      <Icon className="h-4 w-4" />
      {complete ? "Complete" : "Pending"}
    </span>
  );
}
