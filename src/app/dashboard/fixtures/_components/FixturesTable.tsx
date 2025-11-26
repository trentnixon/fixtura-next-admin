"use client";

import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Fixture } from "../types";

interface FixturesTableProps {
  fixtures: Fixture[];
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "scheduled":
      return <Badge variant="outline">Scheduled</Badge>;
    case "in_progress":
      return <Badge className="bg-green-600">In Progress</Badge>;
    case "completed":
      return <Badge variant="secondary">Completed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function FixturesTable({ fixtures }: FixturesTableProps) {
  if (fixtures.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No fixtures found matching your filters.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixtures ({fixtures.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Games</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixtures.map((fixture) => (
                <TableRow key={fixture.id}>
                  <TableCell className="font-medium">
                    {fixture.competitionName}
                  </TableCell>
                  <TableCell>{fixture.gradeName}</TableCell>
                  <TableCell>{fixture.roundName}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {format(fixture.scheduledDate, "MMM dd, yyyy")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(fixture.scheduledDate, "h:mm a")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{fixture.venue}</TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {fixture.completedGames}/{fixture.totalGames}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(fixture.status)}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/fixtures/${fixture.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
