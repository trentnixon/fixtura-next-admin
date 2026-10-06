"use client";

import { useMemo } from "react";
import {
  TableBody,
  TableCell,
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DatabaseIcon, EyeIcon, History } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  formatQueueWait,
  formatRenderDuration,
  formatSydneyDateTime,
  isStalledRender,
  latestSchedulerRenders,
  queueWaitSeconds,
  relationCount,
  renderDurationMs,
  renderFailureMessage,
  renderStartedAt,
  schedulerRenderOutcome,
} from "@/lib/scheduler/schedulerRenderHistory";
import { cn } from "@/lib/utils";
import type { Render } from "@/types/render";
import type { Scheduler } from "@/types/scheduler";

type TableOfRendersProps = {
  scheduler: Scheduler;
};

function historyLabel(shown: number, total: number): string {
  if (shown < total) return `Latest ${shown} of ${total}`;
  return `${shown} attempt${shown === 1 ? "" : "s"}`;
}

function OutcomeBadge({ render }: { render: Render }) {
  const outcome = schedulerRenderOutcome({
    complete: render.attributes.Complete,
    processing: render.attributes.Processing,
  });
  const failure =
    outcome === "failed" ? renderFailureMessage(render) : null;

  return (
    <div className="flex flex-col items-center gap-1">
      {outcome === "running" ? (
        <StatusBadge status trueLabel="In progress" variant="warning" />
      ) : null}
      {outcome === "success" ? (
        <StatusBadge status trueLabel="Success" />
      ) : null}
      {outcome === "failed" ? (
        <StatusBadge status={false} falseLabel="Failed" />
      ) : null}
      {failure ? (
        <span className="max-w-40 text-[10px] font-medium uppercase text-red-700">
          {failure}
        </span>
      ) : null}
    </div>
  );
}

const TableOfRenders = ({ scheduler }: TableOfRendersProps) => {
  const { strapiLocation } = useGlobalContext();
  const { attributes } = scheduler;
  const nowMs = Date.now();

  const history = useMemo(
    () => latestSchedulerRenders(attributes.renders?.data ?? []),
    [attributes.renders?.data],
  );

  return (
    <OverviewRecordPanel
      title="Render history"
      description="Newest attempts first. Times are Sydney."
      badge={
        history.total > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {historyLabel(history.rows.length, history.total)}
          </span>
        ) : null
      }
    >
      {history.rows.length === 0 ? (
        <EmptyState
          variant="minimal"
          title="No renders yet"
          description="This scheduler has no recorded render attempts."
          icon={<History className="h-8 w-8 text-muted-foreground" />}
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="text-left font-semibold">Render</TableHead>
                <TableHead className="text-center font-semibold">
                  Complete
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Processing
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Emailed
                </TableHead>
                <TableHead className="text-right font-semibold">Wait</TableHead>
                <TableHead className="text-right font-semibold">
                  Duration
                </TableHead>
                <TableHead className="text-center font-semibold text-xs">
                  Assets
                </TableHead>
                <TableHead className="text-center font-semibold text-xs">
                  AI
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Rerender
                </TableHead>
                <TableHead className="text-right font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.rows.map((render) => {
                const startedAt = renderStartedAt(render);
                const durationMs = renderDurationMs({
                  startedAt,
                  updatedAt: render.attributes.updatedAt,
                  processing: render.attributes.Processing,
                  nowMs,
                });
                const stalled = isStalledRender({
                  processing: render.attributes.Processing,
                  durationMs,
                });
                const waitSeconds = queueWaitSeconds({
                  scheduleTime: attributes.Time,
                  startedAt,
                });

                return (
                  <TableRow
                    key={render.id}
                    className={cn(
                      "transition-colors hover:bg-slate-50/50",
                      stalled && "bg-red-50/60",
                    )}
                  >
                    <TableCell className="text-left">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatSydneyDateTime(startedAt || render.attributes.updatedAt)}
                        </span>
                        <Link
                          href={`/dashboard/renders/${render.id}`}
                          className="font-mono text-xs text-muted-foreground hover:text-slate-900"
                        >
                          #{render.id}
                        </Link>
                        {stalled ? (
                          <span className="text-[10px] font-medium uppercase text-red-700">
                            Over 30m
                          </span>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <OutcomeBadge render={render} />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={render.attributes.Processing}
                        trueLabel="Running"
                        falseLabel="Idling"
                        variant={
                          render.attributes.Processing ? "warning" : "neutral"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={render.attributes.EmailSent}
                        trueLabel="Sent"
                        falseLabel="Pending"
                        variant={
                          render.attributes.EmailSent ? "default" : "neutral"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-500">
                      {formatQueueWait(waitSeconds)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-slate-500">
                      {formatRenderDuration(durationMs)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-[10px] text-slate-500">
                      {relationCount(render.attributes.downloads)}
                    </TableCell>
                    <TableCell className="text-center font-mono text-[10px] text-slate-500">
                      {relationCount(render.attributes.ai_articles)}
                    </TableCell>
                    <TableCell className="text-center">
                      <StatusBadge
                        status={render.attributes.forceRerender}
                        trueLabel="Requested"
                        falseLabel="No"
                        variant={
                          render.attributes.forceRerender ? "info" : "neutral"
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                          asChild
                        >
                          <Link
                            href={`/dashboard/renders/${render.id}`}
                            title="View render details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-brandSecondary-200 bg-brandSecondary-50 text-brandSecondary-800 shadow-none hover:bg-brandSecondary-100 hover:text-brandSecondary-900"
                          asChild
                        >
                          <Link
                            href={`${strapiLocation.render}${render.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open in CMS"
                          >
                            <DatabaseIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </OverviewRecordPanel>
  );
};

export default TableOfRenders;
