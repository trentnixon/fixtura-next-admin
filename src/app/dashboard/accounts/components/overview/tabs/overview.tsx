"use client";

import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import MetricsTable from "./components/MetricsTable";

export default function OverviewTab({
  accountData,
}: {
  accountData: fixturaContentHubAccountDetails;
  accountId?: number;
}) {
  return <MetricsTable accountData={accountData} />;
}
