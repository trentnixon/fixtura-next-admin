"use client";
import { AccountStatsResponse } from "@/types/dataCollection";
import EntityStatisticsTable from "../entities/EntityStatisticsTable";
import DataVolumeCard from "../volume/DataVolumeCard";

interface EntitiesTabProps {
  data: AccountStatsResponse;
}

export default function EntitiesTab({ data }: EntitiesTabProps) {
  return (
    <div className="space-y-6">
      <EntityStatisticsTable data={data} />
      <DataVolumeCard data={data} />
    </div>
  );
}
