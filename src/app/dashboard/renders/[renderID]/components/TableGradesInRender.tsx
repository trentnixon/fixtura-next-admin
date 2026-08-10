"use client";

import { useGradeInRender } from "@/hooks/grades/useGradeInRender";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Badge } from "@/components/ui/badge";

export default function TableGrades() {
  const { renderID } = useParams();

  // Fetch render details, including grade IDs
  const {
    grades: gradeIDs,
    isLoading: isRenderLoading,
    isError: isRenderError,
    error: renderError,
    refetch: refetchRender,
  } = useRendersQuery(renderID as string);

  // Use the grade IDs to fetch detailed grade data
  const {
    data: gradeData,
    isLoading: isGradeLoading,
    isError: isGradeError,
    error: gradeError,
    refetch: refetchGrades,
  } = useGradeInRender(gradeIDs);

  // UI: Loading State - Render query loading
  if (isRenderLoading) {
    return <LoadingState message="Loading render details…" />;
  }

  // UI: Error State - Render query error
  if (isRenderError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load render details"
        error={renderError}
        onRetry={() => refetchRender()}
      />
    );
  }

  // UI: Loading State - Grades query loading
  if (isGradeLoading) {
    return <LoadingState message="Loading grades…" />;
  }

  // UI: Error State - Grades query error
  if (isGradeError) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load grades"
        error={gradeError as Error}
        onRetry={() => refetchGrades()}
      />
    );
  }

  // UI: Empty State - No grade data
  if (!gradeData || gradeData.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No grades available"
        description="No grades found for this render."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead>Grade Name</TableHead>
            <TableHead>Days Played</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gradeData.map((grade) => {
            const { id, attributes } = grade;
            const { gradeName, daysPlayed, gender, ageGroup } =
              attributes.grade.data.attributes || {};
            const gradeId = attributes.grade.data.id;

            return (
              <TableRow key={id}>
                <TableCell>
                  <div className="text-sm font-medium text-slate-900">
                    {gradeName || "N/A"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Grade ID {gradeId}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-slate-600">
                  {daysPlayed || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50">
                    {gender || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50">
                    {ageGroup || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/dashboard/grades/${gradeId}`}>
                    <Button variant="primary" size="sm">
                      View
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
