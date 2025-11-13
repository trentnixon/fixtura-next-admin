"use client";

import Image from "next/image";
import type { UpcomingFixture } from "@/types/downloadAsset";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DatabaseIcon } from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UpcomingFixtureListProps {
  fixtures: UpcomingFixture[];
}

/**
 * UpcomingFixtureList Component
 *
 * Displays a list of upcoming cricket fixtures in a table:
 * - Date, Time, Teams (with logos), Ground, Round, Grade
 * - Match type, Age group, Gender
 * - CMS link button
 */
export default function UpcomingFixtureList({
  fixtures,
}: UpcomingFixtureListProps) {
  const { strapiLocation } = useGlobalContext();

  if (!fixtures || fixtures.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-32">Date & Time</TableHead>
            <TableHead>Teams</TableHead>
            <TableHead>Ground</TableHead>
            <TableHead>Round</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead className="text-center">Type</TableHead>
            <TableHead className="text-center">Age Group</TableHead>
            <TableHead className="text-center">Gender</TableHead>
            <TableHead className="w-20">CMS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixtures.map((fixture, index) => {
            const gameId = fixture.gameID;
            const cmsUrl = `${strapiLocation.fixture.cricket}?page=1&pageSize=10&sort=round:ASC&_q=${encodeURIComponent(gameId)}`;

            return (
              <TableRow key={index}>
                {/* Date & Time */}
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {fixture.date}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {fixture.time}
                    </div>
                  </div>
                </TableCell>

                {/* Teams */}
                <TableCell>
                  <div className="space-y-2">
                    {/* Home Team */}
                    <div className="flex items-center gap-2">
                      {fixture.teamHomeLogo?.url && (
                        <div className="flex-shrink-0">
                          <div className="relative w-6 h-6 rounded border bg-white p-0.5">
                            <Image
                              src={fixture.teamHomeLogo.url}
                              alt={`${fixture.teamHome} logo`}
                              width={20}
                              height={20}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {fixture.teamHome}
                      </span>
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-2">
                      {fixture.teamAwayLogo?.url && (
                        <div className="flex-shrink-0">
                          <div className="relative w-6 h-6 rounded border bg-white p-0.5">
                            <Image
                              src={fixture.teamAwayLogo.url}
                              alt={`${fixture.teamAway} logo`}
                              width={20}
                              height={20}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          </div>
                        </div>
                      )}
                      <span className="text-sm font-medium">
                        {fixture.teamAway}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Ground */}
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{fixture.ground}</span>
                  </div>
                </TableCell>

                {/* Round */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {fixture.round}
                  </Badge>
                </TableCell>

                {/* Grade */}
                <TableCell>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    {fixture.gradeName}
                  </Badge>
                </TableCell>

                {/* Match Type */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-700 border-slate-200"
                  >
                    {fixture.type}
                  </Badge>
                </TableCell>

                {/* Age Group */}
                <TableCell className="text-center">
                  <span className="text-xs text-muted-foreground">
                    {fixture.ageGroup}
                  </span>
                </TableCell>

                {/* Gender */}
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 border-indigo-200"
                  >
                    {fixture.gender}
                  </Badge>
                </TableCell>

                {/* CMS Link */}
                <TableCell>
                  <Button variant="primary" asChild size="sm">
                    <Link href={cmsUrl} target="_blank" rel="noopener noreferrer">
                      <DatabaseIcon className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

