"use client";

import type { LogEntry } from "@/types/scraperLogs";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { CheckCircle2, Info } from "lucide-react";
import { findLatestCompletedEntry } from "../utils/jobLogPayloadUtils";
import { JobCompletedVisualBlock } from "./JobCompletedVisualBlock";
import { JobHeartbeatChart } from "./JobHeartbeatChart";

/** CMS caps returned log rows per job (see cms-response-admin-scraper-log-job-detail-api.md). */
const SCRAPER_LOG_EVENTS_CAP = 10_000;

interface JobRunOverviewProps {
  entries: LogEntry[];
  view?: "all" | "heartbeats" | "completion";
}

/**
 * Completion-focused job view (latest job.completed + metadata).
 */
export function JobRunOverview({ entries, view = "all" }: JobRunOverviewProps) {
  const completedEntry = findLatestCompletedEntry(entries);
  const showHeartbeats = view === "all" || view === "heartbeats";
  const showCompletion = view === "all" || view === "completion";

  return (
    <div className="space-y-6">
      {entries.length >= SCRAPER_LOG_EVENTS_CAP && (
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
      )}

      {showHeartbeats ? (
        <OverviewRecordPanel
          title="Heartbeat timeline"
          description="Scraper elapsed time and wall-clock spacing between heartbeat events"
        >
          <JobHeartbeatChart entries={entries} />
        </OverviewRecordPanel>
      ) : null}

      {showCompletion && completedEntry ? (
        <JobCompletedVisualBlock entry={completedEntry} />
      ) : showCompletion ? (
        <OverviewRecordPanel
          title="Completion"
          description="Latest job.completed payload and summary metrics"
        >
          <EmptyState
            variant="minimal"
            title="No completion event found"
            description="This job may still be running or stopped before completion."
            icon={<CheckCircle2 className="h-8 w-8 text-muted-foreground" />}
          />
        </OverviewRecordPanel>
      ) : null}
    </div>
  );
}
