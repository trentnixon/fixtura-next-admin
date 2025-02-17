"use client";

import { S } from "@/components/type/type";
import { P } from "@/components/type/type";
import { DatabaseIcon } from "lucide-react";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeamByID } from "@/hooks/teams/useTeamsByID";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { daysFromToday } from "@/lib/utils";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FixturesTab from "./components/Fixtures";
import OverviewTab from "./components/Overview";
import UpcomingGames from "./components/UpcomingGames";
import CreatePage from "@/components/scaffolding/containers/createPage";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";

// TODO: Add team page
export default function TeamPage() {
  const { teamID } = useParams();
  const { data, isLoading, isError } = useTeamByID(Number(teamID));
  const { strapiLocation } = useGlobalContext();
  const team = data;

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error:</div>;

  return (
    <CreatePage>
      <CreatePageTitle
        title={team?.TopLineData?.teamName || ""}
        byLine={team?.competition?.competitionName || ""}
        image={team?.association?.ParentLogo || ""}
        byLineBottom={team?.competition?.season || ""}
      />

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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>
        <TabsContent value="upcoming">
          <UpcomingGames />
        </TabsContent>

        <TabsContent value="completed">
          <FixturesTab />
        </TabsContent>
      </Tabs>
    </CreatePage>
  );
}
