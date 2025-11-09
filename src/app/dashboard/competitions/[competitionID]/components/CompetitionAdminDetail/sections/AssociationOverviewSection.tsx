"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ShieldCheck, Users, MoreVertical } from "lucide-react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

interface AssociationInsightsSectionProps {
  association: CompetitionAdminDetailResponse["association"] | null;
  insights: CompetitionAdminDetailResponse["analytics"]["insights"];
}

export function AssociationInsightsSection({
  association,
  insights,
}: AssociationInsightsSectionProps) {
  if (!association) {
    return null;
  }

  return (
    <SectionContainer
      title="Insights"
      description="Owning association context and actionable recommendations."
      variant="compact"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <StatCard
          title="Clubs Missing Accounts"
          value={insights.clubsMissingAccounts.length}
          description="Clubs participating without Fixtura accounts."
          icon={<Users className="h-5 w-5" />}
          variant="primary"
        />

        <div className="rounded-xl border border-slate-200 p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Association Contacts
          </p>
          {association.accounts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No linked accounts.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {association.accounts.map((account) => {
                const displayName =
                  account.name ??
                  ([account.firstName, account.lastName]
                    .filter(Boolean)
                    .join(" ") ||
                    `Account #${account.id}`);

                return (
                  <li
                    key={account.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-muted p-2">
                        <ShieldCheck className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {displayName}
                        </div>
                        {account.name !== displayName && (
                          <div className="text-sm text-muted-foreground">
                            {account.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/accounts/association/${account.id}`}
                          >
                            View Account
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
