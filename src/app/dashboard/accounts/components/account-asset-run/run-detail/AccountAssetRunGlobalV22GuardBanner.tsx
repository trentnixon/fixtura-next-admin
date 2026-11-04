"use client";

import Link from "next/link";
import {
  formatGlobalV22GuardReason,
} from "@/lib/account-asset-run/globalV22Guard";
import {
  getAccountAssetRunDetailHref,
  type AccountAssetRunAccountOrgType,
} from "@/lib/account-asset-run/accountRoutes";
import { assetRunWarningNoticeClass } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/assetRunPageStyles";
import type { GlobalV22GuardBlocked } from "@/types/accountAssetRun";
import { cn } from "@/lib/utils";

interface AccountAssetRunGlobalV22GuardBannerProps {
  guard: GlobalV22GuardBlocked;
  accountId: number;
  accountType?: AccountAssetRunAccountOrgType | null;
  className?: string;
}

export function AccountAssetRunGlobalV22GuardBanner({
  guard,
  accountId,
  accountType,
  className,
}: AccountAssetRunGlobalV22GuardBannerProps) {
  const blockingHref = getAccountAssetRunDetailHref(
    guard.blockingRunId,
    accountId,
    accountType ?? undefined
  );
  const reasonLabel = formatGlobalV22GuardReason(guard.reason);

  return (
    <div className={cn("mb-6", assetRunWarningNoticeClass, className)}>
      <p>
        <span className="font-medium text-brandWarning-900">
          Result scrape did not start on this run.
        </span>{" "}
        {reasonLabel}. Monitor the run that holds the global v2.2 slot:{" "}
        <Link
          href={blockingHref}
          className="font-medium text-brandWarning-950 underline underline-offset-2 hover:text-brandWarning-900"
        >
          Run #{guard.blockingRunId}
        </Link>
        {guard.blockingRunStatus ? (
          <>
            {" "}
            <span className="text-brandWarning-800">
              ({guard.blockingRunStatus.replace(/_/g, " ")})
            </span>
          </>
        ) : null}
        .
      </p>
      <p className="mt-2 text-brandWarning-900">
        Remove-fixtures on this run may complete with{" "}
        <strong className="font-medium">0 jobs queued</strong> when targets were
        already enqueued on the blocking run — that is expected, not a failed
        scrape.
      </p>
    </div>
  );
}
