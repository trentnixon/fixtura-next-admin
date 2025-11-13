"use client";

import type { LadderGrade } from "@/types/downloadAsset";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LadderGradeCard from "./LadderGradeCard";

interface AssetDetailsLadderProps {
  grades: LadderGrade[];
}

/**
 * AssetDetailsLadder Component
 *
 * Displays CricketLadder asset-specific data:
 * - Grades list with count
 * - Each grade shows team count and league table
 * - Tables can be expanded/collapsed
 */
export default function AssetDetailsLadder({
  grades,
}: AssetDetailsLadderProps) {
  const gradeCount = grades.length;

  return (
    <SectionContainer
      title="Ladder"
      description={`${gradeCount} ${gradeCount === 1 ? "grade" : "grades"} with league tables`}
    >
      <div className="space-y-4">
        {grades.map((grade, index) => (
          <LadderGradeCard key={grade.ID || index} grade={grade} />
        ))}
      </div>
    </SectionContainer>
  );
}

