"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableDownloads from "./TableDownloads";
import TableGamesResults from "./TableGameResults";
import TableUpcomingGames from "./TableUpcomingGames";
import TableGrades from "./TableGradesInRender";

export function RenderTabs() {
  return (
    <Tabs defaultValue="downloads" className="w-full">
      <TabsList variant="secondary" className="">
        <TabsTrigger value="downloads">Downloads</TabsTrigger>
        <TabsTrigger value="gameResults">Game Results</TabsTrigger>
        <TabsTrigger value="upcomingGames">Upcoming Games</TabsTrigger>
        <TabsTrigger value="grades">Grades</TabsTrigger>
      </TabsList>
      <TabsContent value="downloads">
        <TableDownloads />
      </TabsContent>
      <TabsContent value="gameResults">
        <TableGamesResults />
      </TabsContent>
      <TabsContent value="upcomingGames">
        <TableUpcomingGames />
      </TabsContent>
      <TabsContent value="grades">
        <TableGrades />
      </TabsContent>
    </Tabs>
  );
}
