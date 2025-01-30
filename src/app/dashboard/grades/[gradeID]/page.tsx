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

  const grade = data?.attributes;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>
                {grade?.competition.data.attributes.competitionName}
              </ByLine>
              <Title>{grade?.gradeName}</Title>
              <ByLine>{grade?.competition.data.attributes.season}</ByLine>
            </div>
            <Image
              src={
                grade?.competition.data.attributes.association.data.attributes
                  .Logo.data.attributes.url || "/placeholder-logo.png"
              }
              alt={
                grade?.competition.data.attributes.association.data.attributes
                  .Name || "Competition Logo"
              }
              width={80}
              height={80}
            />
          </div>
        </div>

        <div className="flex flex-row gap-2 items-center justify-between">
          <P>
            <strong>Age Group:</strong> {grade?.ageGroup} |{" "}
            <strong>Days Played:</strong> {grade?.daysPlayed} |{" "}
            <strong>Gender:</strong> {grade?.gender}
          </P>
          <div className="flex flex-row gap-2 items-center">
            <Link href={grade?.url || ""} target="_blank">
              <Button variant="outline">
                <ExternalLinkIcon size="16" />
              </Button>
            </Link>
            <Link
              href={`${strapiLocation.grade}${data?.id}`}
              target="_blank"
              rel="noopener noreferrer">
              <Button variant="outline">
                <DatabaseIcon size="16" />
              </Button>
            </Link>
            <Badge variant="outline" className={`bg-blue-500 text-white`}>
              <S className="text-xs text-white ">
                Updated {grade?.updatedAt && daysFromToday(grade?.updatedAt)}{" "}
                Days Ago
              </S>
            </Badge>
            <Badge
              variant="outline"
              className={`${
                grade?.competition.data.attributes?.status === "Active"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-white`}>
              {grade?.competition.data.attributes?.status === "Active"
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
