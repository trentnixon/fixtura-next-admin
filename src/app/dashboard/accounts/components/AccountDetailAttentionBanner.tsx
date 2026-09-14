"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFleetOpsAccountIndex } from "@/hooks/fleet/useFleetOpsAccountIndex";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";

interface AccountDetailAttentionBannerProps {
  accountId: number;
}

export function AccountDetailAttentionBanner({
  accountId,
}: AccountDetailAttentionBannerProps) {
  const fleetOps = useFleetOpsAccountIndex();
  const flags = fleetOps.get(accountId);

  if (!flags?.renderStuck && !flags?.syncAttention) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-300 bg-amber-50/80 px-4 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-2">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-800" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-amber-950">
              This account needs fleet attention
            </p>
            {flags.renderStuck ? (
              <div className="flex flex-wrap items-center gap-2 text-amber-900">
                <Badge variant="outline" className="border-amber-400 bg-white">
                  {flags.renderStuck.label}
                </Badge>
                <span className="text-xs">
                  Scheduler/render pipeline — open Render or Scheduler tabs.
                </span>
                {flags.renderStuck.renderId ? (
                  <Button variant="accent" size="sm" asChild>
                    <Link href={`/dashboard/renders/${flags.renderStuck.renderId}`}>
                      Open render
                    </Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
            {flags.syncAttention ? (
              <div className="flex flex-wrap items-center gap-2 text-amber-900">
                <Badge variant="outline" className="border-orange-400 bg-white">
                  {flags.syncAttention.attentionLabel}
                </Badge>
                <span className="text-xs">Season data refresh</span>
                <Button variant="primary" size="sm" asChild>
                  <Link
                    href={getAccountHealthRunDetailHref(
                      flags.syncAttention.id,
                      accountId
                    )}
                  >
                    Open sync run
                  </Link>
                </Button>
              </div>
            ) : null}
          </div>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0" asChild>
          <Link href="/dashboard/accounts?tab=operations">Fleet lists</Link>
        </Button>
      </div>
    </div>
  );
}
