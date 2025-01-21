"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import {
  Check as CheckIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  EyeIcon,
  X as XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SectionTitle } from "@/components/type/titles";
import { useGlobalContext } from "@/components/providers/GlobalContext";

export default function ListRendersInTable({
  schedulerId,
  accountId,
  sport,
  accountType,
}: {
  schedulerId: string;
  accountId: string;
  sport: string;
  accountType: string;
}) {
  const {
    data: scheduler,
    isLoading,
    isError,
    error,
  } = useSchedulerQuery(schedulerId);
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  const renders = scheduler?.attributes.renders.data;
  //renders order by publishedAt
  const sortedRenders = renders?.sort(
    (a, b) =>
      new Date(b.attributes.publishedAt).getTime() -
      new Date(a.attributes.publishedAt).getTime()
  );
  if (isLoading) return <p>Loading scheduler...</p>;
  if (isError) {
    return (
      <div>
        <p>Error loading scheduler: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        <div className="flex justify-between items-center  py-2">
          <SectionTitle className="py-2 px-1">Renders</SectionTitle>
          {/* Input filter */}
          <div className="flex items-center justify-end w-1/2">
            Search Dates
          </div>
        </div>
        <div className="bg-slate-50 rounded-md p-4 border">
          {scheduler?.attributes.renders.data.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Time</TableHead>
                  <TableHead className="text-center">Complete</TableHead>
                  <TableHead className="text-center">Processing</TableHead>

                  <TableHead className="text-center">Hub</TableHead>
                  <TableHead className="text-center">Strapi</TableHead>
                  <TableHead className="text-center">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRenders?.map(render => (
                  <TableRow key={render.id}>
                    <TableCell className="text-center">
                      {new Date(
                        render.attributes.publishedAt
                      ).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                        year: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      {new Date(
                        render.attributes.publishedAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-slate-50">
                        {render.attributes.Complete ? (
                          <CheckIcon size="16" className="text-green-500" />
                        ) : (
                          <XIcon size="16" className="text-red-500" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-slate-50">
                        {render.attributes.Processing ? (
                          <CheckIcon size="16" className="text-green-500" />
                        ) : (
                          <XIcon size="16" className="text-red-500" />
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link
                        href={`${contentHub}/${accountId}/${sport.toLowerCase()}/${
                          render.id
                        }`}
                        target="_blank"
                        rel="noopener noreferrer">
                        <Button variant="outline">
                          <ExternalLinkIcon size="16" />
                        </Button>
                      </Link>
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
                      <Link
                        href={`/dashboard/accounts/${accountType}/${accountId}/render/${render.id}`}>
                        <Button variant="outline">
                          <EyeIcon size="16" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )) || (
                  <TableRow>
                    <TableCell colSpan={6}>No renders available.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <p>No renders available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
