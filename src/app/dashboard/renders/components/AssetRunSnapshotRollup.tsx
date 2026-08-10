"use client";

import { Activity, AlertCircle, PlayCircle } from "lucide-react";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import type { AccountAssetRunListRow } from "@/types/accountAssetRun";

interface AssetRunSnapshotRollupProps {
  rows: AccountAssetRunListRow[];
}

export function AssetRunSnapshotRollup({ rows }: AssetRunSnapshotRollupProps) {
  const activeCount = rows.filter((r) => isAssetRunActive(r.status)).length;
  const failedCount = rows.filter((r) => r.status === "failed").length;
  const completedCount = rows.filter((r) => r.status === "completed").length;

  const metrics = [
    {
      label: "Active in list",
      value: activeCount.toString(),
      detail: "Queued or in-flight (last 25 runs)",
      icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
    },
    {
      label: "Completed in list",
      value: completedCount.toString(),
      detail: "Among last 25 runs",
      icon: <Activity className="h-4 w-4 text-emerald-500" />,
    },
    {
      label: "Failed in list",
      value: failedCount.toString(),
      detail: "Among last 25 runs",
      icon: (
        <AlertCircle
          className={`h-4 w-4 ${
            failedCount > 0 ? "text-amber-500" : "text-slate-300"
          }`}
        />
      ),
    },
  ];

  return (
    <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
        >
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1 truncate text-lg font-semibold text-slate-900">
              {metric.value}
            </p>
            <p className="text-xs text-muted-foreground">{metric.detail}</p>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
            {metric.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
