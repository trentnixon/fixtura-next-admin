// getTodaysSchedulers.tsx
"use client";
import { SectionTitle } from "@/components/type/titles";
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
import { EyeIcon, XIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default function GetTodaysSchedulers() {
  const { data } = useGetTodaysRenders();

  // sort data by accountSport in alphabetical order
  const sortedData = data?.sort((a, b) => {
    if (a.accountSport < b.accountSport) return -1;
    if (a.accountSport > b.accountSport) return 1;
    return 0;
  });

  // form two objs filkter on accountType (Club and Association)
  const clubSchedulers =
    sortedData?.filter(scheduler => scheduler.accountType === "Club") ?? [];
  const associationSchedulers =
    sortedData?.filter(scheduler => scheduler.accountType === "Association") ??
    [];

  return (
    <div>
      <Tabs defaultValue="club">
        <div className="flex flex-row justify-between items-center">
          <SectionTitle>Todays Schedulers ({data?.length || 0})</SectionTitle>
          <TabsList>
            <TabsTrigger value="club">
              Club ({clubSchedulers.length})
            </TabsTrigger>
            <TabsTrigger value="association">
              Association ({associationSchedulers.length})
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="mt-4">
          <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border">
            <TabsContent value="club">
              <Table className="mt-2">
                <SchedulerTableHeader />
                <SchedulerTableBody data={clubSchedulers} />
              </Table>
            </TabsContent>
            <TabsContent value="association">
              <Table className="mt-2">
                <SchedulerTableHeader />
                <SchedulerTableBody data={associationSchedulers} />
              </Table>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

const SchedulerTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-left">Account Name</TableHead>
        <TableHead className="text-center">Account Sport</TableHead>
        <TableHead className="text-center">Rendered</TableHead>
        <TableHead className="text-center">Que Complete</TableHead>
        <TableHead className="text-center">Account</TableHead>
        <TableHead className="text-center">Scheduler</TableHead>
      </TableRow>
    </TableHeader>
  );
};

const SchedulerTableBody = ({ data }: { data: TodaysRenders[] }) => {
  return (
    <TableBody>
      {data?.map(scheduler => (
        <TableRow key={scheduler.schedulerId}>
          <TableCell className="text-left">{scheduler.accountName}</TableCell>
          <TableCell className="text-center">
            {scheduler.accountSport}
          </TableCell>
          <TableCell className="text-center">
            {!scheduler.isRendering ? (
              <div className="flex justify-center items-center">
                <CheckIcon className="text-green-500 w-4 h-4" />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <XIcon className="text-red-500 w-4 h-4" />
              </div>
            )}
          </TableCell>
          <TableCell className="text-center">
            {!scheduler.queued ? (
              <div className="flex justify-center items-center">
                <CheckIcon className="text-green-500 w-4 h-4" />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <XIcon className="text-red-500 w-4 h-4" />
              </div>
            )}
          </TableCell>

          <TableCell className="text-center">
            <Link
              href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${
                scheduler.accountId
              }`}>
              <Button variant="outline">
                <EyeIcon size="16" />
              </Button>
            </Link>
          </TableCell>
          <TableCell className="text-center">
            <Link href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
              <Button variant="outline">
                <EyeIcon size="16" />
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
