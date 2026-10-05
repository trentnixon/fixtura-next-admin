"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  formatSydneyDayLabel,
  type DueRenderAttentionRow,
} from "@/lib/scheduler/dueRenderAccuracy";

const OUTCOME: Record<
  DueRenderAttentionRow["outcome"],
  { label: string; className: string }
> = {
  missed: {
    label: "Missed",
    className: "border-amber-200 bg-amber-50 text-amber-900",
  },
  failed: {
    label: "Failed",
    className: "border-red-200 bg-red-50 text-red-800",
  },
  inProgress: {
    label: "In progress",
    className: "border-blue-200 bg-blue-50 text-blue-800",
  },
};

export function DueRenderAttentionList({
  rows,
}: {
  rows: DueRenderAttentionRow[];
}) {
  return (
    <div className="max-h-96 overflow-y-auto rounded-md border border-slate-200">
      {rows.map((row) => {
        const when = `${formatSydneyDayLabel(row.dateKey)} ${row.scheduledTime}`;
        const outcome = OUTCOME[row.outcome];

        return (
          <div
            key={row.key}
            className="flex items-start justify-between gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0"
          >
            <div className="min-w-0">
              <Link
                href={`/dashboard/schedulers/${row.schedulerId}`}
                className="block truncate font-medium text-slate-800 hover:text-primary hover:underline"
              >
                {row.accountName}
              </Link>
              <div className="mt-0.5 text-xs text-muted-foreground">{when}</div>
              {row.failureReason ? (
                <div className="mt-1 text-xs text-red-700">{row.failureReason}</div>
              ) : null}
            </div>
            <Badge variant="outline" className={outcome.className}>
              {outcome.label}
            </Badge>
          </div>
        );
      })}
    </div>
  );
}
