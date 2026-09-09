"use client";

import type { LogEntry } from "@/types/scraperLogs";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { Info } from "lucide-react";
import { JobHeartbeatChart } from "./JobHeartbeatChart";

/** CMS caps returned log rows per job (see cms-response-admin-scraper-log-job-detail-api.md). */
export const SCRAPER_LOG_EVENTS_CAP = 10_000;

export function ScraperLogTruncationNotice({
  entryCount,
}: {
  entryCount: number;
}) {
  if (entryCount < SCRAPER_LOG_EVENTS_CAP) return null;

  return (
    <div
      className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950"
      role="status"
    >
      <Info
        className="h-4 w-4 shrink-0 mt-0.5 text-amber-800"
        aria-hidden
      />
      <span>
        This response includes at most{" "}
        {SCRAPER_LOG_EVENTS_CAP.toLocaleString()} events (CMS limit).
        Completion data is based only on returned rows; very chatty jobs may
        be truncated.
      </span>
    </div>
  );
}

interface JobRunOverviewProps {
  entries: LogEntry[];
  showTruncationNotice?: boolean;
}

/** Heartbeat timeline for the job event stream. */
export function JobRunOverview({
  entries,
  showTruncationNotice = true,
}: JobRunOverviewProps) {
  return (
    <div className="space-y-6">
      {showTruncationNotice ? (
        <ScraperLogTruncationNotice entryCount={entries.length} />
      ) : null}

      <OverviewRecordPanel
        title="Heartbeat timeline"
        description="Scraper elapsed time and wall-clock spacing between heartbeat events"
      >
        <JobHeartbeatChart entries={entries} />
      </OverviewRecordPanel>
    </div>
  );
}
