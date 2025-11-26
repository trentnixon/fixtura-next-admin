"use client";

import Image from "next/image";
import { SingleFixtureDetailResponse } from "@/types/fixtureDetail";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

interface FixtureDetailHeaderProps {
  data: SingleFixtureDetailResponse;
}

export default function FixtureDetailHeader({
  data,
}: FixtureDetailHeaderProps) {
  const { fixture, grade } = data;

  // Format dates
  const formattedDate = fixture.dates.date
    ? format(new Date(fixture.dates.date), "EEEE, MMMM d, yyyy")
    : null;
  const formattedTime = fixture.dates.time || null;
  const formattedDateRange = fixture.dates.dateRange || null;

  return (
    <SectionContainer
      title="Game Metadata"
      description="Basic fixture information"
    >
      <div className="space-y-6">
        {/* Title and Logos Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {fixture.round || "Fixture"} - {fixture.type}
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  fixture.isFinished
                    ? "default"
                    : fixture.status === "live"
                      ? "destructive"
                      : "secondary"
                }
              >
                {fixture.status}
              </Badge>
              {fixture.isFinished && (
                <Badge variant="outline">Finished</Badge>
              )}
            </div>
            {grade && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{grade.gradeName}</span>
                {grade.association && (
                  <>
                    <span>•</span>
                    <span>{grade.association.name}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Grade and Association Logos */}
          <div className="flex items-center gap-4">
            {grade?.logoUrl && (
              <div className="relative w-16 h-16 rounded-lg border bg-white p-2 shadow-sm overflow-hidden">
                <Image
                  src={grade.logoUrl}
                  alt={grade.gradeName}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            {grade?.association?.logoUrl && (
              <div className="relative w-16 h-16 rounded-lg border bg-white p-2 shadow-sm overflow-hidden">
                <Image
                  src={grade.association.logoUrl}
                  alt={grade.association.name}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>

        {/* Fixture Details Table */}
        <div className="rounded-lg border">
          <Table>
            <TableBody>
              {formattedDate && (
                <TableRow>
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    Date
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {formattedDate}
                  </TableCell>
                </TableRow>
              )}

              {formattedTime && (
                <TableRow>
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    Time
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {formattedTime}
                  </TableCell>
                </TableRow>
              )}

              {fixture.venue.ground && (
                <TableRow>
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    Venue
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {fixture.venue.ground}
                  </TableCell>
                </TableRow>
              )}

              {formattedDateRange && (
                <TableRow>
                  <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                    Date Range
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {formattedDateRange}
                  </TableCell>
                </TableRow>
              )}

              <TableRow>
                <TableCell className="font-medium text-gray-700 dark:text-gray-300 w-1/3">
                  Game ID
                </TableCell>
                <TableCell className="text-gray-900 dark:text-gray-100 font-mono text-sm">
                  {fixture.gameID}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </SectionContainer>
  );
}


