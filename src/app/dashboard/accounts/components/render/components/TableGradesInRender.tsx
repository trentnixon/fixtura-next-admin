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

export default function TableGrades() {
  const { renderID } = useParams();

  // Fetch render details, including grade IDs
  const {
    grades: gradeIDs,
    isLoading: isRenderLoading,
    isError: isRenderError,
    error: renderError,
  } = useRendersQuery(renderID as string);

  // Use the grade IDs to fetch detailed grade data
  const {
    data: gradeData,
    isLoading: isGradeLoading,
    isError: isGradeError,
    error: gradeError,
  } = useGradeInRender(gradeIDs);

  // Handle loading and error states for render
  if (isRenderLoading) return <p>Loading render details...</p>;
  if (isRenderError) return <p>Error loading render: {renderError?.message}</p>;

  // Handle loading and error states for grades
  if (isGradeLoading) return <p>Loading grades...</p>;
  if (isGradeError)
    return <p>Error loading grades: {(gradeError as Error)?.message}</p>;

  // Check for grade data
  if (!gradeData || gradeData.length === 0) {
    return <p>No grades available.</p>;
  }

  return (
    <div className="p-6">
      <h4 className="mb-4 text-lg font-semibold">Grades</h4>
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
          {gradeData.map(grade => {
            const { id, attributes } = grade;
            const { gradeName, daysPlayed, gender, ageGroup } =
              attributes.grade.data.attributes || {};

            return (
              <TableRow key={id}>
                <TableCell>{gradeName || "N/A"}</TableCell>
                <TableCell>{daysPlayed || "N/A"}</TableCell>
                <TableCell>{gender || "N/A"}</TableCell>
                <TableCell>{ageGroup || "N/A"}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/accounts/grade/${grade.id}`}>
                    <Button variant="outline">
                      <EyeIcon size="16" />
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
