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
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import type { Scheduler } from "@/types/scheduler";

type TableOfRendersProps = {
  scheduler: Scheduler;
};

const TableOfRenders = ({ scheduler }: TableOfRendersProps) => {
  const { strapiLocation } = useGlobalContext();
  const { attributes } = scheduler;

  const sortedRendersData = useMemo(
    () =>
      [...(attributes.renders?.data ?? [])].sort(
        (a, b) =>
          new Date(b.attributes.publishedAt).getTime() -
          new Date(a.attributes.publishedAt).getTime(),
      ),
    [attributes.renders?.data],
  );

  return (
    <OverviewRecordPanel
      title="Render history"
      description="Recent rendering attempts for this scheduler"
      badge={
        sortedRendersData.length > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {sortedRendersData.length} attempt
            {sortedRendersData.length === 1 ? "" : "s"}
          </span>
        ) : null
      }
    >
      {sortedRendersData.length === 0 ? (
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
                <TableHead className="text-left font-semibold">Date</TableHead>
                <TableHead className="text-center font-semibold">
                  Complete
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Processing
                </TableHead>
                <TableHead className="text-center font-semibold">
                  Emailed
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
              {sortedRendersData.map((render) => (
                <TableRow
                  key={render.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="text-left font-medium">
                    {formatDate(
                      render.attributes.publishedAt ||
                        render.attributes.updatedAt,
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge
                      status={render.attributes.Complete}
                      trueLabel="Success"
                      falseLabel="Failed"
                    />
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
                  <TableCell className="text-center font-mono text-[10px] text-slate-500">
                    {render.attributes.downloads?.data?.length || 0}
                  </TableCell>
                  <TableCell className="text-center font-mono text-[10px] text-slate-500">
                    {render.attributes.ai_articles?.data?.length || 0}
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
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </OverviewRecordPanel>
  );
};

export default TableOfRenders;
