"use client";

import { useMemo } from "react";
import { AccountDetail } from "@/types/associationDetail";
import AccountCard from "./AccountCard";
import { Card, CardContent } from "@/components/ui/card";

/**
 * AccountsList Component
 *
 * Main accounts list component displaying:
 * - Accounts sorted by lastName, firstName, then creation date
 * - Account cards with account details
 * - Empty state handling
 */
interface AccountsListProps {
  accounts: AccountDetail[];
}

export default function AccountsList({ accounts }: AccountsListProps) {
  // Sort accounts: lastName, firstName, then by ID (as proxy for creation date)
  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      // Sort by lastName (nulls last)
      if (a.lastName !== b.lastName) {
        if (a.lastName === null) return 1;
        if (b.lastName === null) return -1;
        return a.lastName.localeCompare(b.lastName);
      }
      // Then by firstName (nulls last)
      if (a.firstName !== b.firstName) {
        if (a.firstName === null) return 1;
        if (b.firstName === null) return -1;
        return a.firstName.localeCompare(b.firstName);
      }
      // Then by ID (as proxy for creation date - lower ID = earlier creation)
      return a.id - b.id;
    });
  }, [accounts]);

  if (sortedAccounts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No accounts found for this association.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedAccounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

