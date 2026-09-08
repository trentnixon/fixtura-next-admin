"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import AccountHealthRunActions from "@/app/dashboard/accounts/components/account-health/AccountHealthRunActions";
import {
  accountHealthActionGroupDividerClass,
  accountHealthActionGroupItemClass,
  accountHealthActionGroupShellClass,
  accountHealthToolbarLabelClass,
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
 * Run detail header actions — navigation group + recovery group (labs button groups).
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
        <div className="flex flex-col gap-1 sm:items-end">
          <span className={accountHealthToolbarLabelClass}>Navigation</span>
          <div className={accountHealthActionGroupShellClass}>
            <DashboardLinkButton
              href={accountHref}
              intent="supporting"
              icon={ArrowLeft}
              className={cn(
                accountHealthActionGroupItemClass,
                accountHealthActionGroupDividerClass
              )}
            >
              Back
            </DashboardLinkButton>
            <Button
              variant="secondary"
              size="sm"
              className={accountHealthActionGroupItemClass}
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
