"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AccountHealthRunActions from "@/app/dashboard/accounts/components/account-health/AccountHealthRunActions";
import {
  accountHealthNavGroupDividerClass,
  accountHealthNavGroupItemClass,
  accountHealthNavGroupShellClass,
} from "@/app/dashboard/accounts/components/account-health/run-detail/accountHealthActionGroupStyles";
import { healthRunStatusLabel } from "@/lib/account-health/displayRules";
import {
  healthRunPageStatusBadgeClass,
} from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import type { AccountHealthRunStatus } from "@/types/accountHealth";
import { cn } from "@/lib/utils";

interface AccountHealthRunPageToolbarProps {
  runId: number;
  accountId: number;
  runStatus: AccountHealthRunStatus;
  finalizedAt: string | null;
  accountHref: string;
  strapiRunHref: string;
}

/**
 * Run detail header actions — horizontal button groups (`action.button.group-horizontal`).
 */
export function AccountHealthRunPageToolbar({
  runId,
  accountId,
  runStatus,
  finalizedAt,
  accountHref,
  strapiRunHref,
}: AccountHealthRunPageToolbarProps) {
  return (
    <div className="flex w-full max-w-full flex-col items-stretch gap-3 sm:items-end lg:w-auto">
      <Badge
        variant="outline"
        className={cn(
          "w-fit self-end capitalize",
          healthRunPageStatusBadgeClass(runStatus)
        )}
      >
        {healthRunStatusLabel(runStatus)}
      </Badge>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-end sm:gap-4">
        <div className={accountHealthNavGroupShellClass}>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              accountHealthNavGroupItemClass,
              accountHealthNavGroupDividerClass
            )}
            asChild
          >
            <Link href={accountHref}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={accountHealthNavGroupItemClass}
            asChild
          >
            <a
              href={strapiRunHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Strapi
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          </Button>
        </div>

        <AccountHealthRunActions
          runId={runId}
          accountId={accountId}
          runStatus={runStatus}
          finalizedAt={finalizedAt}
          layout="group"
        />
      </div>
    </div>
  );
}
