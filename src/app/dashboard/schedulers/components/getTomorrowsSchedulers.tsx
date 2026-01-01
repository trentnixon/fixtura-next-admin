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
import { EyeIcon, DatabaseIcon } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";

export default function GetTomorrowsSchedulers() {
  const { data, isLoading } = useGetTomorrowsRenders();

  if (isLoading) return <div className="p-12 text-center text-slate-400 italic">Syncing tomorrow&apos;s forecast...</div>;

  // sort data by accountSport in alphabetical order
  const sortedData = [...(data || [])].sort((a, b) => {
    if (a.accountSport < b.accountSport) return -1;
    if (a.accountSport > b.accountSport) return 1;
    return 0;
  });

  const clubSchedulers = sortedData.filter((s) => s.accountType === "Club");
  const associationSchedulers = sortedData.filter((s) => s.accountType === "Association");

  return (
    <div className="space-y-6">
      <Tabs defaultValue="club" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList variant="secondary">
            <TabsTrigger value="club">Club ({clubSchedulers.length})</TabsTrigger>
            <TabsTrigger value="association">
              Association ({associationSchedulers.length})
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="club" className="mt-0">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
              <SchedulerTableHeader />
              <SchedulerTableBody data={clubSchedulers} />
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="association" className="mt-0">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
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
      <TableRow className="bg-slate-50/50">
        <TableHead className="text-left font-semibold">Account Name</TableHead>
        <TableHead className="text-center font-semibold">Sport</TableHead>
        <TableHead className="text-center font-semibold">Rendered</TableHead>
        <TableHead className="text-center font-semibold">Queue</TableHead>
        <TableHead className="text-center font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const SchedulerTableBody = ({ data }: { data: TodaysRenders[] }) => {
  return (
    <TableBody>
      {data?.map((scheduler) => (
        <TableRow key={scheduler.schedulerId} className="hover:bg-slate-50/50 transition-colors">
          <TableCell className="text-left font-medium">
            {scheduler.accountName}
          </TableCell>
          <TableCell className="text-center">
            {scheduler.accountSport}
          </TableCell>
          <TableCell className="text-center">
            <StatusBadge
              status={!scheduler.isRendering}
              trueLabel="Complete"
              falseLabel="Rendering"
              variant={!scheduler.isRendering ? "default" : "info"}
            />
          </TableCell>
          <TableCell className="text-center">
            <StatusBadge
              status={!scheduler.queued}
              trueLabel="Processed"
              falseLabel="Queued"
              variant={!scheduler.queued ? "default" : "warning"}
            />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Link
                href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${scheduler.accountId
                  }`}
              >
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600" title="View Account">
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600" title="View Scheduler">
                  <DatabaseIcon className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TableCell>
        </TableRow>
      ))}
      {data?.length === 0 && (
        <TableRow>
          <TableCell colSpan={5} className="text-center py-8 text-slate-500 italic">
            No schedulers for tomorrow
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};
