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
import { EyeIcon } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

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
          <TableRow>
            <TableHead>Grade Name</TableHead>
            <TableHead>Days Played</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead>View</TableHead>
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
                <TableCell>{gradeName || "N/A"}</TableCell>
                <TableCell>{daysPlayed || "N/A"}</TableCell>
                <TableCell>{gender || "N/A"}</TableCell>
                <TableCell>{ageGroup || "N/A"}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/grades/${gradeId}`}>
                    <Button variant="accent">
                      <EyeIcon className="h-4 w-4" />
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
