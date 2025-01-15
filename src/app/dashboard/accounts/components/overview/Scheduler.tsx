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
import { Check as CheckIcon, X as XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label, SectionTitle } from "@/components/type/titles";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { P } from "@/components/type/type";
export default function SchedulerDetails({
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
    <section>
      <div>
        <SectionTitle>Scheduler Details</SectionTitle>
        <Label>
          Last Updated:{" "}
          {new Date(scheduler?.attributes?.updatedAt || "").toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }
          )}
        </Label>
        <div className="grid grid-cols-3 gap-4">
          <Card className="w-full">
            <CardContent>
              <CardTitle>
                <P>Day of the Week</P>
              </CardTitle>
              <CardDescription>
                <P>
                  {scheduler?.attributes.days_of_the_week?.data?.attributes
                    .Name || "N/A"}
                </P>
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <CardTitle>
                <P>Is Rendering:</P>
              </CardTitle>
              <CardDescription>
                <P>{scheduler?.attributes.isRendering ? "Yes" : "No"}</P>
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <CardTitle>
                <P>Queued</P>
              </CardTitle>
              <CardDescription>
                <P>{scheduler?.attributes.Queued ? "Yes" : "No"}</P>
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="bg-slate-200 rounded-lg px-4 py-2">
            <div className="flex justify-between items-center  py-2">
              <SectionTitle className="py-2 px-1">Renders</SectionTitle>
              {/* Input filter */}
              <div className="flex items-center w-1/2">here</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              {scheduler?.attributes.renders.data.length ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Date</TableHead>
                      <TableHead className="text-center">Time</TableHead>
                      <TableHead className="text-center">Complete</TableHead>
                      <TableHead className="text-center">Processing</TableHead>
                      <TableHead className="text-center">View</TableHead>
                      <TableHead className="text-left">Strapi</TableHead>
                      <TableHead className="text-left">Content Hub</TableHead>
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
                            href={`/dashboard/accounts/${accountType}/${accountId}/render/${render.id}`}>
                            <Button variant="outline">View</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-left">
                          <Link
                            href={`https://fixtura-backend.herokuapp.com/admin/content-manager/collection-types/api::render.render/${render.id}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">Strapi</Button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Link
                            href={`https://contentv2.fixtura.com.au/${accountId}/${sport.toLowerCase()}/${
                              render.id
                            }`}
                            target="_blank"
                            rel="noopener noreferrer">
                            <Button variant="outline">Content Hub</Button>
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
      </div>
    </section>
  );
}
