"use client";

import type { LogEntry } from "@/types/scraperLogs";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { HeartPulse, Info } from "lucide-react";
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

      {showHeartbeats && (
        <SectionContainer
          title="Heartbeat timeline"
          description="Scraper elapsed time and wall-clock spacing between heartbeat events."
          icon={<HeartPulse className="h-5 w-5 text-muted-foreground" />}
          variant="compact"
        >
          <JobHeartbeatChart entries={entries} />
        </SectionContainer>
      )}

      {showCompletion && completedEntry ? (
        <JobCompletedVisualBlock entry={completedEntry} />
      ) : showCompletion ? (
        <div className="rounded-lg border border-dashed border-slate-200 py-12 text-center">
          <p className="text-sm font-medium text-slate-900">
            No completion event found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            This job may still be running or stopped before completion.
          </p>
        </div>
      ) : null}
    </div>
  );
}
