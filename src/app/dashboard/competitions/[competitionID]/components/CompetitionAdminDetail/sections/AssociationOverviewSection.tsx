"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

interface AssociationInsightsSectionProps {
  association: CompetitionAdminDetailResponse["association"] | null;
}

export function AssociationInsightsSection({
  association,
}: AssociationInsightsSectionProps) {
  if (!association) {
    return null;
  }

  return (
    <SectionContainer
      title="Association Contacts"
      description="Linked Fixtura accounts for the owning association."
      variant="compact"
    >
      {association.accounts.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 px-4 py-5">
          <p className="text-sm font-medium text-slate-900">
            No linked association accounts
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This association does not have any Fixtura accounts connected yet.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              {association.accounts.length} linked{" "}
              {association.accounts.length === 1 ? "account" : "accounts"}
            </div>
          </div>
          <ul className="divide-y divide-slate-200">
            {association.accounts.map((account) => {
              const personName = [account.firstName, account.lastName]
                .filter(Boolean)
                .join(" ");
              const displayName =
                (account.name ?? personName) || `Account #${account.id}`;
              const secondaryLabel =
                account.name && personName
                  ? personName
                  : `Account #${account.id}`;
              const showSecondaryLabel = secondaryLabel !== displayName;

              return (
                <li
                  key={account.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
                      <UserRound className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {displayName}
                      </p>
                      {showSecondaryLabel && (
                        <p className="truncate text-xs text-muted-foreground">
                          {secondaryLabel}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button asChild variant="primary" size="sm">
                    <Link
                      href={`/dashboard/accounts/association/${account.id}`}
                    >
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </SectionContainer>
  );
}
