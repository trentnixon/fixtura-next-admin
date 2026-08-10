"use client";

import { cn } from "@/lib/utils";
import {
  assetRunSectionTitleClass,
  assetRunSummaryCardClass,
} from "./assetRunPageStyles";

interface AccountAssetRunSummaryStripProps {
  schedulerId: number;
  scheduledDate: string;
  runKey: string;
  mode: string | null;
  trigger: string | null;
  force: boolean | null;
}

function formatMode(mode: string | null): string {
  if (!mode) return "—";
  return mode === "asset_only" ? "Asset only" : mode === "full" ? "Full scrape + assets" : mode;
}

function formatTrigger(trigger: string | null): string {
  if (!trigger) return "—";
  return trigger.replace(/_/g, " ");
}

function modeValueClass(mode: string | null): string {
  if (mode === "full") return "text-brandAccent-700";
  if (mode === "asset_only") return "text-brandSecondary-700";
  return "text-brandPrimary-900";
}

export function AccountAssetRunSummaryStrip({
  schedulerId,
  scheduledDate,
  runKey,
  mode,
  trigger,
  force,
}: AccountAssetRunSummaryStripProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-1 shrink-0 rounded-full bg-brandSecondary-500"
          aria-hidden
        />
        <div>
          <h2 className={assetRunSectionTitleClass}>Run details</h2>
          <p className="text-xs text-muted-foreground">
            Scheduler, schedule, and trigger context for this orchestration
          </p>
        </div>
      </div>
      <dl className={assetRunSummaryCardClass}>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brandSecondary-600">
            Mode
          </dt>
          <dd className={cn("mt-1 font-medium capitalize", modeValueClass(mode))}>
            {formatMode(mode)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brandSecondary-600">
            Trigger
          </dt>
          <dd className="mt-1 font-medium capitalize text-brandPrimary-900">
            {formatTrigger(trigger)}
            {force === true ? (
              <span className="ml-1 font-normal text-brandWarning-700">
                (forced)
              </span>
            ) : null}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brandSecondary-600">
            Scheduler
          </dt>
          <dd className="mt-1 font-medium tabular-nums text-brandInfo-800">
            #{schedulerId}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-brandSecondary-600">
            Scheduled date
          </dt>
          <dd className="mt-1 text-brandPrimary-900">{scheduledDate || "—"}</dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <dt className="text-xs font-medium uppercase tracking-wide text-brandSecondary-600">
            Run key
          </dt>
          <dd className="mt-1 break-all font-mono text-xs text-brandPrimary-700">
            {runKey}
          </dd>
        </div>
      </dl>
    </div>
  );
}
