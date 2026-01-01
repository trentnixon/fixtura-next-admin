"use client";

import { useParams } from "next/navigation";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";
import { TableBody, TableCell, Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatabaseIcon, EyeIcon, History } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

const TableOfRenders = () => {
  const { schedulersID } = useParams();
  const { data, isLoading, isError } = useSchedulerByID(Number(schedulersID));
  const { strapiLocation } = useGlobalContext();

  if (isLoading) return <LoadingState message="Loading render history..." />;
  if (isError || !data) return <ErrorState title="Error" description="Could not load render history" />;

  const { attributes: scheduler } = data;
  const { renders } = scheduler;
  const { data: rendersData } = renders;

  const sortedRendersData = rendersData?.sort(
    (a, b) =>
      new Date(b.attributes.publishedAt).getTime() -
      new Date(a.attributes.publishedAt).getTime()
  );

  return (
    <SectionContainer
      title="Render History"
      description="Recent rendering attempts for this scheduler"
      icon={<History className="h-5 w-5 text-slate-500" />}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="text-left font-semibold">Date</TableHead>
            <TableHead className="text-center font-semibold">Complete</TableHead>
            <TableHead className="text-center font-semibold">Processing</TableHead>
            <TableHead className="text-center font-semibold">Emailed</TableHead>
            <TableHead className="text-center font-semibold">Rerender</TableHead>
            <TableHead className="text-center font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRendersData && sortedRendersData.length > 0 ? (
            sortedRendersData.map(render => (
              <TableRow key={render.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-left font-medium">
                  {formatDate(render.attributes.publishedAt)}
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge
                    status={render.attributes.Complete}
                    trueLabel="Success"
                    falseLabel="Failed"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge
                    status={render.attributes.Processing}
                    trueLabel="Running"
                    falseLabel="Idling"
                    variant={render.attributes.Processing ? "warning" : "neutral"}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge
                    status={render.attributes.EmailSent}
                    trueLabel="Sent"
                    falseLabel="Pending"
                    variant={render.attributes.EmailSent ? "default" : "neutral"}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge
                    status={render.attributes.forceRerender}
                    trueLabel="Requested"
                    falseLabel="No"
                    variant={render.attributes.forceRerender ? "info" : "neutral"}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Link
                      href={`${strapiLocation.render}${render.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View in Strapi"
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600">
                        <DatabaseIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/renders/${render.id}`} title="View Details">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-slate-500 italic">
                No renders available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </SectionContainer>
  );
};

export default TableOfRenders;
