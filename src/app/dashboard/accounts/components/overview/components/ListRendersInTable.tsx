"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Render } from "@/types/fixturaContentHubAccountDetails";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ListRendersInTable({
  renders,
  accountId,
  sport,
}: {
  schedulerId: number;
  accountId: number;
  sport: string;
  accountType: string;
  renders: Render[];
}) {
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  //renders order by publishedAt
  const sortedRenders = renders?.sort((a, b) => b.id - a.id);
  return (
    <div>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        <div>
          <ScrollArea className="h-[500px] min-w-full ">
            {sortedRenders.length ? (
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
                        {render.created}
                      </TableCell>
                      <TableCell className="text-center">
                        {render.time}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-slate-50">
                          {render.Complete ? (
                            <CheckIcon size="16" className="text-green-500" />
                          ) : (
                            <XIcon size="16" className="text-red-500" />
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-slate-50">
                          {render.Processing ? (
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
                        <Link href={`/dashboard/renders/${render.id}`}>
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
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
