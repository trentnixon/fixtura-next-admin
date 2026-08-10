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
import { useGetTomorrowsRenders } from "@/hooks/scheduler/useGetTomorrowsRenders";
import { TodaysRenders } from "@/types";
import { AlertCircle, ArrowRight, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

export default function GetTomorrowsSchedulers() {
  const { data, isError, isLoading } = useGetTomorrowsRenders();

  if (isLoading)
    return (
      <div className="flex items-center justify-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-10 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Syncing tomorrow&apos;s forecast
      </div>
    );

  if (isError)
    return (
      <div className="flex items-start gap-3 rounded-md border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">
            Tomorrow&apos;s forecast unavailable
          </div>
          <div className="text-xs">
            The scheduler service did not return upcoming render data.
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
        <TableHead className="text-left font-semibold">Rendered</TableHead>
        <TableHead className="text-left font-semibold">Queue</TableHead>
        <TableHead className="text-right font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const SchedulerTableBody = ({ data }: { data: TodaysRenders[] }) => {
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
            <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-slate-600">
              {scheduler.accountSport}
            </span>
          </TableCell>
          <TableCell>
            <StatusBadge
              status={!scheduler.isRendering}
              trueLabel="Complete"
              falseLabel="Rendering"
              variant={!scheduler.isRendering ? "default" : "info"}
            />
          </TableCell>
          <TableCell>
            <StatusBadge
              status={!scheduler.queued}
              trueLabel="Processed"
              falseLabel="Queued"
              variant={!scheduler.queued ? "default" : "warning"}
            />
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
            colSpan={5}
            className="text-center py-8 text-slate-500 italic"
          >
            No schedulers for tomorrow
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
