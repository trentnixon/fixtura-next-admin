"use client";

import { useGradeByID } from "@/hooks/grades/useGradeByID";
import { useParams } from "next/navigation";

import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ByLine } from "@/components/type/titles";
import { Title } from "@/components/type/titles";
import { P, S } from "@/components/type/type";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { GradeTeamsTable } from "./components/gradeTeamsTable";
import Image from "next/image";
import { daysFromToday } from "@/lib/utils";

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
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>{grade?.competitionData.competitionName}</ByLine>
              <Title>{grade?.topLineData.gradeName}</Title>
              <ByLine>{grade?.competitionData.season}</ByLine>
            </div>
            <Image
              src={
                grade?.competitionData.association.Logo ||
                "/placeholder-logo.png"
              }
              alt={
                grade?.competitionData.association.name || "Competition Logo"
              }
              width={80}
              height={80}
            />
          </div>
        </div>

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
      </div>
      <GradeTeamsTable />
    </div>
  );
}
