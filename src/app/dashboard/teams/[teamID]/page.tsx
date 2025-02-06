"use client";

import { Title } from "@/components/type/titles";
import { ByLine } from "@/components/type/titles";
import { S } from "@/components/type/type";
import { P } from "@/components/type/type";
import { DatabaseIcon } from "lucide-react";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeamByID } from "@/hooks/teams/useTeamsByID";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { daysFromToday } from "@/lib/utils";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HistoryTab from "./components/History";
import FixturesTab from "./components/Fixtures";
import OverviewTab from "./components/Overview";

// TODO: Add team page
export default function TeamPage() {
  const { teamID } = useParams();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const { strapiLocation } = useGlobalContext();
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error:</div>;

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>{team?.competition?.competitionName}</ByLine>
              <Title>{team?.TopLineData?.teamName}</Title>
              <ByLine>{team?.competition?.season}</ByLine>
            </div>
            <Image
              src={team?.association?.ParentLogo || "/placeholder-logo.png"}
              alt={team?.association?.Name || "Competition Logo"}
              width={80}
              height={80}
            />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-between">
          <P>
            <strong>Age Group:</strong> {team?.TopLineData?.age} |{" "}
            <strong>Games Played:</strong> {team?.TopLineData?.gamesPlayed} |{" "}
            <strong>Gender:</strong> {team?.TopLineData?.gender}
          </P>

          <div className="flex flex-row gap-2 items-center">
            <Link
              href={`https://www.playhq.com${team?.TopLineData?.href}` || ""}
              target="_blank">
              <Button variant="outline">
                <ExternalLinkIcon size="16" />
              </Button>
            </Link>
            <Link
              href={`${strapiLocation.team}${team?.TopLineData?.teamID}`}
              target="_blank"
              rel="noopener noreferrer">
              <Button variant="outline">
                <DatabaseIcon size="16" />
              </Button>
            </Link>
            <Badge variant="outline" className={`bg-blue-500 text-white`}>
              <S className="text-xs text-white ">
                Updated{" "}
                {team?.TopLineData?.updatedAt &&
                  daysFromToday(team?.TopLineData?.updatedAt)}
                Days Ago
              </S>
            </Badge>

            <Badge
              variant="outline"
              className={`${
                team?.competition?.status === "Active"
                  ? "bg-green-500"
                  : "bg-red-500"
              } text-white`}>
              {team?.competition?.status === "Active" ? "Active" : "Not Active"}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>

        <TabsContent value="fixtures">
          <FixturesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
