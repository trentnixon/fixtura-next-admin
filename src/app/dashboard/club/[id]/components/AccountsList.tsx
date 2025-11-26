"use client";

import { useMemo } from "react";
import { ClubAccountSummary } from "@/types/clubAdminDetail";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import {
  Mail,
  User,
  CreditCard,
  CheckCircle2,
  XCircle,
  ShoppingCart,
} from "lucide-react";

interface AccountsListProps {
  accounts: ClubAccountSummary[];
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
      <div className="p-8 text-center border rounded-md bg-slate-50">
        <p className="text-muted-foreground">
          No accounts are currently linked to this club.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Tier</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Setup</TableHead>
          <TableHead className="text-right">Order</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedAccounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {[account.firstName, account.lastName]
                    .filter(Boolean)
                    .join(" ") || "Unnamed Account"}
                </span>
                {account.email && (
                  <a
                    href={`mailto:${account.email}`}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-0.5"
                  >
                    <Mail className="h-3 w-3" />
                    {account.email}
                  </a>
                )}
              </div>
            </TableCell>
            <TableCell>
              {account.accountType && (
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1 font-normal"
                >
                  <User className="h-3 w-3" />
                  {account.accountType.name}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {account.subscriptionTier && (
                <Badge
                  variant="outline"
                  className="flex w-fit items-center gap-1 font-normal"
                >
                  <CreditCard className="h-3 w-3" />
                  {account.subscriptionTier.name}
                </Badge>
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
              <div className="flex items-center gap-1.5">
                {account.isSetup ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Complete
                    </span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-muted-foreground">
                      Pending
                    </span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              {account.hasActiveOrder && (
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1 bg-green-50 border-green-500 text-green-700"
                >
                  <ShoppingCart className="h-3 w-3" />
                  <span className="text-xs">Active</span>
                </Badge>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}


