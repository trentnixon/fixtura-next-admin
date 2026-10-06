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
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50">
          <tr className="border-b border-slate-200 text-left text-xs font-medium text-muted-foreground">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Date</th>
            <th className="px-3 py-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const outcome = OUTCOME[row.outcome];

            return (
              <tr
                key={row.key}
                className="border-b border-slate-200 last:border-b-0"
              >
                <td className="px-3 py-2.5">
                  <Link
                    href={`/dashboard/schedulers/${row.schedulerId}`}
                    className="block truncate font-medium text-slate-800 hover:text-primary hover:underline"
                  >
                    {row.accountName}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-slate-700">
                  {formatSydneyDayLabel(row.dateKey)}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className={outcome.className}>
                    {outcome.label}
                  </Badge>
                  {row.failureReason ? (
                    <div className="mt-1 text-xs text-red-700">
                      {row.failureReason}
                    </div>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
