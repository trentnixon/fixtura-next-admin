"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { DownloadAttentionBadge } from "@/app/dashboard/renders/components/DownloadAttentionBadge";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import { useRecentDownloadsDashboard } from "@/hooks/downloads/useRecentDownloadsDashboard";
import {
  classifyDownloadFromEntity,
  formatDownloadUpdatedAgo,
  groupDownloadsBySydneyDate,
  resolveTimelineAccountLabel,
  resolveTimelineAssetCategory,
} from "@/lib/downloads/downloadStatusTimeline";

const COLUMN_COUNT = 4;

function asError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

export function RecentDownloadsWidget({ className }: { className?: string }) {
  const { data, isLoading, isError, error, refetch } = useRecentDownloadsDashboard();

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const dateGroups = useMemo(() => groupDownloadsBySydneyDate(rows), [rows]);
  const nowMs = useLiveRunClock(rows.length > 0);
  const windowTotal = data?.meta.pagination.total ?? 0;

  return (
    <OverviewRecordPanel
      className={className}
      title="Recent downloads"
      description="Ten newest download outputs by last activity (48h window)"
      badge={
        windowTotal > rows.length ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {windowTotal} in window
          </span>
        ) : null
      }
      action={
        <DashboardLinkButton
          href="/dashboard/renders/downloads"
          trailingIcon="external"
        >
          All downloads
        </DashboardLinkButton>
      }
    >
      {isLoading ? (
        <LoadingState variant="minimal" message="Loading recent downloads…" />
      ) : isError ? (
        <ErrorState
          variant="default"
          title="Could not load recent downloads"
          error={asError(error)}
          onRetry={() => refetch()}
        />
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No downloads updated in the last 48 hours.
        </p>
      ) : (
        <div className="max-h-96 overflow-y-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50">
              <tr className="border-b border-slate-200 text-left text-xs font-medium text-muted-foreground">
                <th className="px-3 py-2 font-medium">Days ago</th>
                <th className="px-3 py-2 font-medium">Download</th>
                <th className="px-3 py-2 font-medium">Client</th>
                <th className="px-3 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {dateGroups.map((group) => (
                <Fragment key={group.dateKey}>
                  <tr className="bg-slate-100/80">
                    <td
                      colSpan={COLUMN_COUNT}
                      className="px-3 py-2 text-sm font-semibold text-slate-800"
                    >
                      {group.dateLabel}
                    </td>
                  </tr>
                  {group.rows.map((download) => {
                    const bucket = classifyDownloadFromEntity(download);
                    const account = resolveTimelineAccountLabel(download);
                    const category = resolveTimelineAssetCategory(download);
                    const name = download.attributes.Name?.trim() || "—";
                    const ago = formatDownloadUpdatedAgo(
                      download.attributes.updatedAt,
                      nowMs,
                    );

                    return (
                      <tr
                        key={download.id}
                        className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50/80"
                      >
                        <td className="whitespace-nowrap px-3 py-2.5 align-top tabular-nums">
                          {ago ? (
                            <span className="text-sm font-semibold text-brandPrimary-900">
                              {ago}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <Link
                            href={`/dashboard/downloads/${download.id}`}
                            className="block font-medium text-slate-800 hover:text-primary hover:underline"
                          >
                            {name}
                          </Link>
                          {category ? (
                            <span className="text-xs text-muted-foreground">
                              {category}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2.5 align-top text-slate-700">
                          <span className="block max-w-[12rem] truncate">
                            {account.label}
                          </span>
                          {account.sport ? (
                            <span className="text-xs text-muted-foreground">
                              {account.sport}
                            </span>
                          ) : null}
                        </td>
                        <td className="px-3 py-2.5 align-top">
                          <DownloadAttentionBadge
                            bucket={bucket}
                            labelMode="status"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </OverviewRecordPanel>
  );
}
