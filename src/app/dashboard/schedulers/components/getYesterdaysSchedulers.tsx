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
import { useGetYesterdaysRenders } from "@/hooks/scheduler/useGetYesterdaysRenders";
import { YesterdaysRenders } from "@/types/scheduler";
import {
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function GetYesterdaysSchedulers() {
  const { data, isError, isLoading } = useGetYesterdaysRenders();

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-10 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Finding yesterday&apos;s results
      </div>
    );

  if (isError)
    return (
      <div className="flex items-start gap-3 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">
            Yesterday&apos;s results unavailable
          </div>
          <div className="text-xs">
            The scheduler service did not return recent render outcomes.
          </div>
        </div>
      </div>
    );

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
        <TableHead className="text-left font-semibold">Email</TableHead>
        <TableHead className="text-right font-semibold">Completed</TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const SchedulerTableBody = ({ data }: { data: YesterdaysRenders[] }) => {
  return (
    <TableBody>
      {data?.map((scheduler) => (
        <TableRow key={scheduler.schedulerId} className="hover:bg-slate-50/60">
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
          <TableCell className="text-left">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {scheduler.accountSport}
            </span>
          </TableCell>
          <TableCell>
            <div className="flex flex-col items-start gap-1">
              <StatusBadge
                status={scheduler.render.complete}
                trueLabel="Success"
                falseLabel="Incomplete"
                variant={scheduler.render.complete ? "default" : "error"}
              />
              {scheduler.render.failureReason && !scheduler.render.complete && (
                <span className="text-[10px] text-error-600 font-bold uppercase tracking-tight">
                  {scheduler.render.failureReason}
                </span>
              )}
            </div>
          </TableCell>
          <TableCell className="px-2 text-right font-mono text-xs text-slate-500">
            {scheduler.render.queueWaitTimeSeconds !== null
              ? `${scheduler.render.queueWaitTimeSeconds}s`
              : "--"}
          </TableCell>
          <TableCell>
            <div className="flex justify-start">
              {scheduler.render.emailSent ? (
                <Mail
                  className="h-4 w-4 text-green-500"
                  aria-label="Email Sent"
                />
              ) : (
                <Mail
                  className="h-4 w-4 text-slate-300"
                  aria-label="Email Not Sent"
                />
              )}
            </div>
          </TableCell>
          <TableCell className="text-right font-mono text-xs text-slate-500">
            {scheduler.render.completedAt
              ? formatDate(scheduler.render.completedAt)
              : "--:--"}
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
      ))}
      {data?.length === 0 && (
        <TableRow>
          <TableCell
            colSpan={7}
            className="text-center py-8 text-slate-500 italic"
          >
            No history found for yesterday
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
