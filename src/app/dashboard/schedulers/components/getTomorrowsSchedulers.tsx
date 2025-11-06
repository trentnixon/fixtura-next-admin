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
import { EyeIcon, XIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";

export default function GetTomorrowsSchedulers() {
  const { data } = useGetTomorrowsRenders();
  // sort data by accountSport in alphabetical order
  const sortedData = data?.sort((a, b) => {
    if (a.accountSport < b.accountSport) return -1;
    if (a.accountSport > b.accountSport) return 1;
    return 0;
  });
  // form two objs filter on accountType (Club and Association)
  const clubSchedulers =
    sortedData?.filter((scheduler) => scheduler.accountType === "Club") ?? [];
  const associationSchedulers =
    sortedData?.filter(
      (scheduler) => scheduler.accountType === "Association"
    ) ?? [];
  return (
    <ElementContainer
      title={`Tomorrow's Schedulers (${data?.length || 0})`}
      subtitle="View schedulers scheduled for tomorrow by account type"
    >
      <Tabs defaultValue="club">
        <TabsList variant="secondary" className="mb-4">
          <TabsTrigger value="club">Club ({clubSchedulers.length})</TabsTrigger>
          <TabsTrigger value="association">
            Association ({associationSchedulers.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="club">
          <Table>
            <SchedulerTableHeader />
            <SchedulerTableBody data={clubSchedulers} />
          </Table>
        </TabsContent>
        <TabsContent value="association">
          <Table>
            <SchedulerTableHeader />
            <SchedulerTableBody data={associationSchedulers} />
          </Table>
        </TabsContent>
      </Tabs>
    </ElementContainer>
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
      {data?.map((scheduler) => (
        <TableRow key={scheduler.schedulerId}>
          <TableCell className="text-left font-medium">
            {scheduler.accountName}
          </TableCell>
          <TableCell className="text-center">
            {scheduler.accountSport}
          </TableCell>
          <TableCell className="text-center">
            {!scheduler.isRendering ? (
              <div className="flex justify-center items-center">
                <CheckIcon className="text-success-500 w-4 h-4" />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <XIcon className="text-error-500 w-4 h-4" />
              </div>
            )}
          </TableCell>
          <TableCell className="text-center">
            {!scheduler.queued ? (
              <div className="flex justify-center items-center">
                <CheckIcon className="text-success-500 w-4 h-4" />
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <XIcon className="text-error-500 w-4 h-4" />
              </div>
            )}
          </TableCell>
          <TableCell className="text-center">
            <Link
              href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${
                scheduler.accountId
              }`}
            >
              <Button variant="primary" size="icon">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </Link>
          </TableCell>
          <TableCell className="text-center">
            <Link href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
              <Button variant="secondary" size="icon">
                <EyeIcon className="h-4 w-4" />
              </Button>
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
