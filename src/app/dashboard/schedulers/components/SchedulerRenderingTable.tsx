// SchedulerRollupData.ts
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
import { DatabaseIcon, EyeIcon } from "lucide-react";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";

export function SchedulerRenderingTable() {
  const { data } = useSchedulerRollup();
  const { strapiLocation } = useGlobalContext();
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <SectionTitle>Rendering</SectionTitle>
          <div className="mt-4">
            <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead className="text-center"></TableHead>
                      <TableHead className="text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.ListOfSchedulersRenderingWithIDS.map(scheduler => (
                      <TableRow key={scheduler.id}>
                        <TableCell className="text-left">
                          {scheduler.Name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`${strapiLocation.scheduler}${scheduler.id}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">
                              <DatabaseIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/schedulers/${scheduler.id}`}>
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
        </div>
        <div>
          <SectionTitle>Queued</SectionTitle>
          <div className="mt-4">
            <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left">Name</TableHead>
                      <TableHead className="text-center"></TableHead>
                      <TableHead className="text-center"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.ListOfSchedulersQueuedWithIDS.map(scheduler => (
                      <TableRow key={scheduler.id}>
                        <TableCell className="text-left">
                          {scheduler.Name}
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`${strapiLocation.scheduler}${scheduler.id}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">
                              <DatabaseIcon size="16" />
                            </Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link href={`/dashboard/schedulers/${scheduler.id}`}>
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
        </div>
      </div>
    </>
  );
}
