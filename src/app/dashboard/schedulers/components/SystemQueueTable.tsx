"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Clock, DatabaseIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Scheduler } from "@/types/scheduler";

interface SystemQueueTableProps {
  items: Scheduler[];
  strapiLocation: { scheduler: string };
}

export function SystemQueueTable({
  items,
  strapiLocation,
}: SystemQueueTableProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Clock className="h-4 w-4 text-amber-500" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          System Queue
        </h3>
      </div>
      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="text-left font-semibold text-slate-900">
                Scheduler
              </TableHead>
              <TableHead className="w-[240px] text-right font-semibold text-slate-900">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((scheduler) => (
              <TableRow key={scheduler.id} className="hover:bg-slate-50/60">
                <TableCell className="py-3 text-left">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {scheduler.accountName || scheduler.Name}
                      </span>
                      {scheduler.accountType && (
                        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
                          {scheduler.accountType}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {scheduler.organizationName || "No organization"}
                      </span>
                      <span>ID: {scheduler.id}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {scheduler.accountId && scheduler.accountType && (
                      <Button variant="primary" size="sm" asChild>
                        <Link
                          href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${scheduler.accountId}`}
                        >
                          Account
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="primary" size="sm" asChild>
                      <Link href={`/dashboard/schedulers/${scheduler.id}`}>
                        View
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button variant="accent" size="sm" asChild>
                      <Link
                        href={`${strapiLocation.scheduler}${scheduler.id}`}
                        target="_blank"
                      >
                        CMS
                        <DatabaseIcon className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Queue is empty
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
