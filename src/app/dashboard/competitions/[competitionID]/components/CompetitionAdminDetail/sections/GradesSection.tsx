"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
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
        <Table className="min-w-[760px]">
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="min-w-[280px]">Grade</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Age Group</TableHead>
              <TableHead className="text-right">Teams</TableHead>
              <TableHead className="text-right">Clubs</TableHead>
              <TableHead className="min-w-[180px]">Coverage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {grades.map((grade) => {
              const totalTeams =
                grade.teamsWithoutFixturaAccount +
                grade.teamsWithFixturaAccount;
              const coveragePercent = grade.accountCoveragePercent ?? 0;

              return (
                <TableRow key={grade.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {grade.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Grade #{grade.id}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <GradePill>{grade.gender ?? "-"}</GradePill>
                  </TableCell>
                  <TableCell>
                    <GradePill>{grade.ageGroup ?? "-"}</GradePill>
                  </TableCell>
                  <TableCell className="text-right font-medium text-slate-900">
                    {formatNumber(grade.teamCount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(grade.clubsRepresented)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-900">
                          {formatPercent(grade.accountCoveragePercent)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatNumber(grade.teamsWithFixturaAccount)} /{" "}
                          {formatNumber(totalTeams)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-brandPrimary-500"
                          style={{
                            width: `${Math.min(
                              Math.max(coveragePercent, 0),
                              100,
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="primary">
                      <Link href={`/dashboard/grades/${grade.id}`}>
                        View
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>
    </SectionContainer>
  );
}

function GradePill({ children }: { children: string }) {
  return (
    <span
      className={cn(
        "inline-flex min-w-16 items-center justify-center rounded-md",
        "border border-slate-200 bg-slate-50 px-2 py-1",
        "text-xs font-medium text-slate-600",
      )}
    >
      {children}
    </span>
  );
}
