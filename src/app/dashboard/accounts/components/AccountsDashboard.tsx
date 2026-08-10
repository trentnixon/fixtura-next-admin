"use client";

import { ArrowRight, Building2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AccountOverview from "./AccountOverview";
import AccountSummaryCharts from "./AccountSummaryCharts";

/**
 * Accounts hub — container.pattern.data-workspace
 */
export default function AccountsDashboard() {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-blue-50 p-1.5 text-blue-700">
              <Users className="h-4 w-4" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              Account directory
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Fleet-wide account mix, trials, and engagement signals
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/accounts/association">
              <Building2 className="mr-2 h-4 w-4" />
              Associations
            </Link>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/accounts/club">
              <Users className="mr-2 h-4 w-4" />
              Clubs
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-6 p-4">
        <AccountOverview />
        <AccountSummaryCharts />
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <span className="text-muted-foreground">
          Browse association and club directories for operational actions
        </span>
        <Button size="sm" variant="primary" asChild>
          <Link href="/dashboard/accounts/association">
            Open associations
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
