"use client";

import {
  ChevronDown,
  ExternalLink,
  FileText,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import TriggerAccountAssetRunMenu from "@/app/dashboard/accounts/components/account-asset-run/TriggerAccountAssetRunMenu";
import AccountSyncButton from "@/app/dashboard/accounts/components/overview/tabs/components/AccountSyncButton";
import { useAccountAssetRunLatest } from "@/hooks/account-asset-run/useAccountAssetRunLatest";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import type { AccountAssetRunAccountOrgType } from "@/lib/account-asset-run/accountRoutes";
import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import { cn } from "@/lib/utils";

type AccountSnapshotActionsProps = {
  accountData: fixturaContentHubAccountDetails;
  accountType: AccountAssetRunAccountOrgType;
  syncAccountType: "CLUB" | "ASSOCIATION";
  className?: string;
};

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass
  );
}

/**
 * Account drilldown header actions — `action.button.site-navigation-group`.
 */
export default function AccountSnapshotActions({
  accountData,
  accountType,
  syncAccountType,
  className,
}: AccountSnapshotActionsProps) {
  const { strapiLocation } = useGlobalContext();
  const playHqUrl = accountData.accountOrganisationDetails?.href;
  const strapiUrl = strapiLocation?.account
    ? `${strapiLocation.account}${accountData.id}`
    : null;
  const showOpen = Boolean(playHqUrl || strapiUrl);

  const { data: assetLatest } = useAccountAssetRunLatest(accountData.id);
  const latestAssetRun = assetLatest?.data ?? null;
  const liveAssetRun =
    latestAssetRun !== null && isAssetRunActive(latestAssetRun.status);

  return (
    <div className={cn(siteNavigationGroupShellClass, className)}>
      <TriggerAccountAssetRunMenu
        accountId={accountData.id}
        accountType={accountType}
        liveRun={Boolean(liveAssetRun)}
        activeRunId={latestAssetRun?.id}
        grouped
        triggerClassName={groupedItemClass(true)}
      />
      <AccountSyncButton
        accountId={accountData.id}
        accountType={syncAccountType}
        variant="ghost"
        size="sm"
        className={groupedItemClass(showOpen)}
      />
      {showOpen && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={groupedItemClass(false)}
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Open
              <ChevronDown className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Destinations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {playHqUrl && (
              <DropdownMenuItem asChild>
                <a href={playHqUrl} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="h-4 w-4" />
                  PlayHQ
                </a>
              </DropdownMenuItem>
            )}
            {strapiUrl && (
              <DropdownMenuItem asChild>
                <a href={strapiUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" />
                  CMS account
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
