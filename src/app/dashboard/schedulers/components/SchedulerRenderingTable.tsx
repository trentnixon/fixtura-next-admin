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
import { DatabaseIcon, EyeIcon } from "lucide-react";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export function SchedulerRenderingTable() {
  const { data } = useSchedulerRollup();
  const { strapiLocation } = useGlobalContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SectionContainer
        title="Rendering"
        description="Schedulers currently being rendered"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-center">View in Strapi</TableHead>
              <TableHead className="text-center">View Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.ListOfSchedulersRenderingWithIDS.map((scheduler) => (
              <TableRow key={scheduler.id}>
                <TableCell className="text-left font-medium">
                  {scheduler.Name}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    href={`${strapiLocation.scheduler}${scheduler.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="icon">
                      <DatabaseIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/dashboard/schedulers/${scheduler.id}`}>
                    <Button variant="secondary" size="icon">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionContainer>
      <SectionContainer
        title="Queued"
        description="Schedulers waiting in queue"
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-center">View in Strapi</TableHead>
              <TableHead className="text-center">View Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.ListOfSchedulersQueuedWithIDS.map((scheduler) => (
              <TableRow key={scheduler.id}>
                <TableCell className="text-left font-medium">
                  {scheduler.Name}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    href={`${strapiLocation.scheduler}${scheduler.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="icon">
                      <DatabaseIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/dashboard/schedulers/${scheduler.id}`}>
                    <Button variant="secondary" size="icon">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionContainer>
    </div>
  );
}
