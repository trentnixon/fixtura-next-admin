"use client";

import { AccountStatsResponse } from "@/types/dataCollection";
import { P } from "@/components/type/type";
import { H3 } from "@/components/type/titles";
import EntityStatisticsTable from "../entities/EntityStatisticsTable";
import DataVolumeCard from "../volume/DataVolumeCard";

interface EntitiesTabProps {
  data: AccountStatsResponse;
}

export default function EntitiesTab({ data }: EntitiesTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="mb-1">Entity Statistics</H3>
        <P className="text-sm text-muted-foreground">
          Detailed statistics for competitions, teams, and games
        </P>
      </div>
      <EntityStatisticsTable data={data} />
      <div>
        <H3 className="mb-1">Data Volume</H3>
        <P className="text-sm text-muted-foreground">
          Volume statistics and processing breakdowns
        </P>
      </div>
      <DataVolumeCard data={data} />
    </div>
  );
}
