"use client";

import { useGradeByID } from "@/hooks/grades/useGradeByID";
import { useParams } from "next/navigation";

import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { P, S } from "@/components/type/type";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { GradeTeamsTable } from "./components/gradeTeamsTable";
import { daysFromToday } from "@/lib/utils";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

export default function DisplayGradeInRender() {
  const { gradeID } = useParams();
  const { strapiLocation } = useGlobalContext();
  const { data, isLoading, isError } = useGradeByID(
    gradeID ? parseInt(gradeID as string) : 0
  );

  if (isLoading) {
    return (
      <p className="text-center text-gray-500">Loading grade details...</p>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Error loading grade</p>;
  }

  const grade = data;
  return (
    <CreatePage>
      <CreatePageTitle
        title={grade?.competitionData.competitionName || ""}
        byLine={`${grade?.competitionData.association.name} - ${grade?.competitionData.season}`}
        byLineBottom={`${grade?.topLineData.gradeName}`}
        image={
          grade?.competitionData.association.Logo || "/placeholder-logo.png"
        }
      />

      <div className="flex flex-row gap-2 items-center justify-between">
        <P>
          <strong>Age Group:</strong> {grade?.topLineData.ageGroup} |{" "}
          <strong>Days Played:</strong> {grade?.topLineData.daysPlayed} |{" "}
          <strong>Gender:</strong> {grade?.topLineData.gender}
        </P>
        <div className="flex flex-row gap-2 items-center">
          <Link href={grade?.topLineData.url || ""} target="_blank">
            <Button variant="outline">
              <ExternalLinkIcon size="16" />
            </Button>
          </Link>
          <Link
            href={`${strapiLocation.grade}${grade?.topLineData.id}`}
            target="_blank"
            rel="noopener noreferrer">
            <Button variant="outline">
              <DatabaseIcon size="16" />
            </Button>
          </Link>
          <Badge variant="outline" className={`bg-blue-500 text-white`}>
            <S className="text-xs text-white ">
              Updated{" "}
              {grade?.topLineData.updatedAt &&
                daysFromToday(grade?.topLineData.updatedAt)}{" "}
              Days Ago
            </S>
          </Badge>
          <Badge
            variant="outline"
            className={`${
              grade?.competitionData.status === "Active"
                ? "bg-green-500"
                : "bg-red-500"
            } text-white`}>
            {grade?.competitionData.status === "Active"
              ? "Active"
              : "Not Active"}
          </Badge>
        </div>
      </div>

      <GradeTeamsTable />
    </CreatePage>
  );
}
