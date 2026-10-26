"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/type/titles";
import type { GradesInRender } from "@/types/gradesInRender";

const ALL = "all";
const EMPTY_GRADES: GradesInRender[] = [];

type GradeField = "ageGroup" | "gender" | "daysPlayed";

function gradeField(grade: GradesInRender, field: GradeField): string {
  const value = grade.attributes.grade.data.attributes[field]?.trim();
  return value || "Unknown";
}

function optionCounts(
  grades: GradesInRender[],
  field: GradeField,
): [string, number][] {
  const counts = new Map<string, number>();
  for (const grade of grades) {
    const value = gradeField(grade, field);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export default function TableGrades() {
  const { renderID } = useParams();
  const [ageGroup, setAgeGroup] = useState(ALL);
  const [gender, setGender] = useState(ALL);
  const [daysPlayed, setDaysPlayed] = useState(ALL);

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

  const grades = gradeData ?? EMPTY_GRADES;

  const ageOptions = useMemo(
    () => optionCounts(grades, "ageGroup"),
    [grades],
  );
  const afterAge = useMemo(
    () =>
      grades.filter(
        (grade) => ageGroup === ALL || gradeField(grade, "ageGroup") === ageGroup,
      ),
    [ageGroup, grades],
  );
  const genderOptions = useMemo(
    () => optionCounts(afterAge, "gender"),
    [afterAge],
  );
  const afterGender = useMemo(
    () =>
      afterAge.filter(
        (grade) => gender === ALL || gradeField(grade, "gender") === gender,
      ),
    [afterAge, gender],
  );
  const daysOptions = useMemo(
    () => optionCounts(afterGender, "daysPlayed"),
    [afterGender],
  );
  const visibleGrades = useMemo(
    () =>
      afterGender.filter(
        (grade) =>
          daysPlayed === ALL || gradeField(grade, "daysPlayed") === daysPlayed,
      ),
    [afterGender, daysPlayed],
  );

  useEffect(() => {
    if (
      ageGroup !== ALL &&
      !ageOptions.some(([value]) => value === ageGroup)
    ) {
      setAgeGroup(ALL);
    }
  }, [ageGroup, ageOptions]);

  useEffect(() => {
    if (gender !== ALL && !genderOptions.some(([value]) => value === gender)) {
      setGender(ALL);
    }
  }, [gender, genderOptions]);

  useEffect(() => {
    if (
      daysPlayed !== ALL &&
      !daysOptions.some(([value]) => value === daysPlayed)
    ) {
      setDaysPlayed(ALL);
    }
  }, [daysPlayed, daysOptions]);

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
      <div className="flex flex-wrap items-center gap-3">
        <GradeFilter
          label="Age group"
          value={ageGroup}
          onChange={setAgeGroup}
          options={ageOptions}
        />
        <GradeFilter
          label="Gender"
          value={gender}
          onChange={setGender}
          options={genderOptions}
        />
        <GradeFilter
          label="Days played"
          value={daysPlayed}
          onChange={setDaysPlayed}
          options={daysOptions}
        />
      </div>
      {visibleGrades.length === 0 ? (
        <EmptyState
          variant="card"
          title="No grades match these filters"
          description="Try another age group, gender, or days played."
        />
      ) : (
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
          {visibleGrades.map((grade) => {
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
      )}
    </div>
  );
}

function GradeFilter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, number][];
}) {
  return (
    <div className="flex items-center gap-2">
      <Label>{label}:</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {options.map(([option, count]) => (
            <SelectItem key={option} value={option}>
              {option} ({count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
