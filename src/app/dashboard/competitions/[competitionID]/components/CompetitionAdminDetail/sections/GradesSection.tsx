"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(0)}%`;
}

interface GradesSectionProps {
  grades: CompetitionAdminDetailResponse["grades"];
}

export function GradesSection({ grades }: GradesSectionProps) {
  return (
    <SectionContainer
      title="Grades"
      description="Detailed grade breakdown including coverage and team information."
    >
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Clubs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell className="font-medium">{grade.name}</TableCell>
                <TableCell>{grade.gender ?? "—"}</TableCell>
                <TableCell>{grade.ageGroup ?? "—"}</TableCell>
                <TableCell>{formatNumber(grade.teamCount)}</TableCell>
                <TableCell>
                  {formatPercent(grade.accountCoveragePercent)} (
                  {formatNumber(grade.teamsWithFixturaAccount)} /{" "}
                  {formatNumber(
                    grade.teamsWithoutFixturaAccount +
                      grade.teamsWithFixturaAccount
                  )}
                  )
                </TableCell>
                <TableCell>{formatNumber(grade.clubsRepresented)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/dashboard/grades/${grade.id}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionContainer>
  );
}
