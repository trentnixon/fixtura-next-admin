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
import { useGetTomorrowsRenders } from "@/hooks/scheduler/useGetTomorrowsRenders";
import { EyeIcon, XIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import Link from "next/link";

export default function GetTomorrowsSchedulers() {
  const { data } = useGetTomorrowsRenders();
  return (
    <div>
      <SectionTitle>Tomorrows Schedulers</SectionTitle>
      <div className="mt-4">
        <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border">
          <Table className="mt-2">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Account Name</TableHead>

                <TableHead className="text-center">Rendered</TableHead>
                <TableHead className="text-center">Que Complete</TableHead>

                <TableHead className="text-center">Account Sport</TableHead>
                <TableHead className="text-center">Account Type</TableHead>
                <TableHead className="text-center">Account</TableHead>
                <TableHead className="text-center">Scheduler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map(scheduler => (
                <TableRow key={scheduler.schedulerId}>
                  <TableCell className="text-left">
                    {scheduler.accountName}
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
                    {scheduler.accountSport}
                  </TableCell>
                  <TableCell className="text-center">
                    {scheduler.accountType}
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
                    <Link
                      href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
                      <Button variant="outline">
                        <EyeIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
