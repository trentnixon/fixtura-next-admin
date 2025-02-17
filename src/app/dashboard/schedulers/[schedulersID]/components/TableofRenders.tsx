"use client";

import { useParams } from "next/navigation";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";
import { TableBody, TableCell } from "@/components/ui/table";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckIcon, DatabaseIcon, EyeIcon } from "lucide-react";
import { XIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { SectionTitle } from "@/components/type/titles";

const TableOfRenders = () => {
  // Extract the scheduler ID from the URL
  const { schedulersID } = useParams();
  const { data, isLoading, isError } = useSchedulerByID(Number(schedulersID));
  const { strapiLocation } = useGlobalContext();

  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error loading scheduler data</div>;

  // Destructure scheduler attributes from the data
  const { attributes: scheduler } = data;
  const { renders } = scheduler;
  const { data: rendersData } = renders;

  // sort rendersData by publishedAt
  const sortedRendersData = rendersData?.sort(
    (a, b) =>
      new Date(b.attributes.publishedAt).getTime() -
      new Date(a.attributes.publishedAt).getTime()
  );

  return (
    <section>
      <SectionTitle>Renders</SectionTitle>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Date</TableHead>
              <TableHead className="text-center">Complete</TableHead>
              <TableHead className="text-center">Processing</TableHead>
              <TableHead className="text-center">Emailed</TableHead>
              <TableHead className="text-center">Rerender</TableHead>
              <TableHead className="text-center">Team Rosters</TableHead>

              <TableHead className="text-center">Strapi</TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRendersData && sortedRendersData.length > 0 ? (
              sortedRendersData.map(render => (
                <TableRow key={render.id}>
                  <TableCell className="text-left">
                    {formatDate(render.attributes.publishedAt)}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {render.attributes.Complete ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {render.attributes.Processing ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {render.attributes.EmailSent ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {render.attributes.forceRerender ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {render.attributes.hasTeamRosters ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Link
                      href={`${strapiLocation.render}${render.id}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <Button variant="outline">
                        <DatabaseIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/dashboard/renders/${render.id}`}>
                      <Button variant="outline">
                        <EyeIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="text-center">
                  No renders available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default TableOfRenders;
