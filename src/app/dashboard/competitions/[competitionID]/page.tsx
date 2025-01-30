"use client";

import { useCompetitionsQuery } from "@/hooks/competitions/useFetchCompetitionByID";
import { useParams } from "next/navigation";
import { CompetitionGradeTable } from "./components/competitionGradeTable";
import { Button } from "@/components/ui/button";
import { Title, ByLine } from "@/components/type/titles";
import { P, S } from "@/components/type/type";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { DatabaseIcon, ExternalLinkIcon } from "lucide-react";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { daysFromToday } from "@/lib/utils";

export default function Competition() {
  const { competitionID } = useParams();
  const { data, isLoading, isError, error } = useCompetitionsQuery(
    Number(competitionID)
  );
  const { strapiLocation } = useGlobalContext();
  if (isLoading) return <p>Loading competition details...</p>;
  if (isError) return <p>Error loading competition: {error?.message}</p>;

  const competition = data?.attributes;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>{competition?.association.data.attributes.Name}</ByLine>
              <Title>{competition?.competitionName}</Title>
              <ByLine>
                {competition?.season} - {competition?.status}
              </ByLine>
            </div>
            <Image
              src={
                competition?.association.data.attributes.ParentLogo ||
                "/placeholder-logo.png"
              }
              alt={
                competition?.association.data.attributes.Name ||
                "Competition Logo"
              }
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between">
          <P>
            <strong>Start Date:</strong> {competition?.startDate} |{" "}
            <strong>End Date:</strong> {competition?.endDate}
          </P>
          <div className="flex flex-row gap-2 items-center">
            <Link href={competition?.url || ""} target="_blank">
              <Button variant="outline">
                <ExternalLinkIcon size="16" />
              </Button>
            </Link>
            <Link
              href={`${strapiLocation.competition}${data?.id}`}
              target="_blank"
              rel="noopener noreferrer">
              <Button variant="outline">
                <DatabaseIcon size="16" />
              </Button>
            </Link>

            <Badge variant="outline" className={`bg-blue-500 text-white`}>
              <S className="text-xs text-white ">
                Updated{" "}
                {competition?.updatedAt &&
                  daysFromToday(competition?.updatedAt)}{" "}
                Days Ago
              </S>
            </Badge>
            <Badge
              variant="outline"
              className={`${
                competition?.status === "Active" ? "bg-green-500" : "bg-red-500"
              } text-white`}>
              {competition?.status === "Active" ? "Active" : "Not Active"}
            </Badge>
          </div>
        </div>
      </div>

      <CompetitionGradeTable />
    </div>
  );
}
