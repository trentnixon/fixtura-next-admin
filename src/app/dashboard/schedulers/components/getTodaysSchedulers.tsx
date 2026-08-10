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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { TodaysRenders } from "@/types";
import { AlertCircle, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { cn } from "@/lib/utils";

export default function GetTodaysSchedulers() {
  const { data, isError, isLoading } = useGetTodaysRenders();

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-10 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Syncing today&apos;s schedule
      </div>
    );

  if (isError)
    return (
      <div className="flex items-start gap-3 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">Today&apos;s schedule unavailable</div>
          <div className="text-xs">
            The scheduler service did not return today&apos;s render data.
          </div>
        </div>
      </div>
    );

  // sort data by accountSport in alphabetical order
  const sortedData = [...(data || [])].sort((a, b) => {
    if (a.accountSport < b.accountSport) return -1;
    if (a.accountSport > b.accountSport) return 1;
    return 0;
  });

  const clubSchedulers = sortedData.filter((s) => s.accountType === "Club");
  const associationSchedulers = sortedData.filter(
    (s) => s.accountType === "Association",
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="club" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList variant="secondary">
            <TabsTrigger value="club">
              Club ({clubSchedulers.length})
            </TabsTrigger>
            <TabsTrigger value="association">
              Association ({associationSchedulers.length})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="club" className="mt-0">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <Table>
              <SchedulerTableHeader />
              <SchedulerTableBody data={clubSchedulers} />
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="association" className="mt-0">
          <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
            <Table>
              <SchedulerTableHeader />
              <SchedulerTableBody data={associationSchedulers} />
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const SchedulerTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-slate-50 hover:bg-slate-50">
        <TableHead className="text-left font-semibold">Account Name</TableHead>
        <TableHead className="text-left font-semibold">Sport</TableHead>
        <TableHead className="text-left font-semibold">Status</TableHead>
        <TableHead className="px-2 text-right text-xs font-semibold">
          Wait
        </TableHead>
        <TableHead className="px-2 text-right text-xs font-semibold">
          Duration
        </TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const SchedulerTableBody = ({ data }: { data: TodaysRenders[] }) => {
  const calculateDuration = (startedAt?: string, updatedAt?: string) => {
    if (!startedAt) return null;
    const start = new Date(startedAt);
    const end = updatedAt ? new Date(updatedAt) : new Date();
    const diffMs = end.getTime() - start.getTime();
    return Math.floor(diffMs / (1000 * 60));
  };

  return (
    <TableBody>
      {data?.map((scheduler) => {
        const duration = scheduler.render
          ? calculateDuration(
              scheduler.render.startedAt,
              scheduler.render.updatedAt,
            )
          : null;
        const isStalled =
          scheduler.render?.processing && duration && duration > 30;

        return (
          <TableRow
            key={scheduler.schedulerId}
            className={cn(
              "hover:bg-slate-50/60",
              isStalled && "bg-error-50/30",
            )}
          >
            <TableCell className="text-left">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {scheduler.accountName}
                </span>
                <span className="text-xs text-muted-foreground">
                  Scheduler ID: {scheduler.schedulerId}
                </span>
              </div>
            </TableCell>
            <TableCell className="px-1 text-left">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                {scheduler.accountSport}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex flex-col items-start gap-1">
                <StatusBadge
                  status={!scheduler.isRendering}
                  trueLabel="Complete"
                  falseLabel="Rendering"
                  variant={
                    !scheduler.isRendering
                      ? "default"
                      : isStalled
                        ? "error"
                        : "info"
                  }
                />
                {scheduler.render?.failureReason &&
                  !scheduler.render.complete && (
                    <span className="text-[9px] text-error-600 font-bold uppercase">
                      {scheduler.render.failureReason}
                    </span>
                  )}
              </div>
            </TableCell>
            <TableCell className="px-2 text-right font-mono text-xs text-slate-500">
              {scheduler.render?.queueWaitTimeSeconds != null
                ? `${scheduler.render.queueWaitTimeSeconds}s`
                : "--"}
            </TableCell>
            <TableCell className="px-2 text-right font-mono text-xs text-slate-500">
              {duration !== null ? `${duration}m` : "--"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="primary" size="sm" asChild>
                  <Link
                    href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${scheduler.accountId}`}
                  >
                    Account
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
      {data?.length === 0 && (
        <TableRow>
          <TableCell
            colSpan={6}
            className="text-center py-8 text-slate-500 italic"
          >
            No schedulers for today
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
