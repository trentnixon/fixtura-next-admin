"use client";

import { useParams } from "next/navigation";
import AccountHealthPanel from "../../account-health/AccountHealthPanel";
import DataRefreshAtAGlance from "../../account-health/DataRefreshAtAGlance";
import DataRefreshLatestRunSection from "../../account-health/DataRefreshLatestRunSection";
import DataRefreshRecentRunsTable from "../../account-health/DataRefreshRecentRunsTable";

interface DataTabProps {
  accountId?: number;
}

/**
 * Account Data refresh tab — season data refresh runs (Account Health).
 * Replaces legacy data-collection insights UI.
 */
export default function DataTab({ accountId: accountIdProp }: DataTabProps) {
  const params = useParams();
  const accountIdNumber =
    accountIdProp ?? Number(params.accountID as string | undefined);

  if (!Number.isFinite(accountIdNumber) || accountIdNumber <= 0) {
    return (
      <p className="text-sm text-muted-foreground">Invalid account id.</p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted-foreground">
        Season data refresh runs replace legacy data collection records. Metrics
        below use recent refresh runs on this account.
      </p>
      <AccountHealthPanel accountId={accountIdNumber} />
      <DataRefreshAtAGlance accountId={accountIdNumber} />
      <DataRefreshLatestRunSection accountId={accountIdNumber} />
      <DataRefreshRecentRunsTable accountId={accountIdNumber} />
    </div>
  );
}
