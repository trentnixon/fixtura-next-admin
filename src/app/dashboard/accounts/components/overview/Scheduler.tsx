"use client";

import { useSchedulerQuery } from "@/hooks/scheduler/useSchedulerQuery";
import { Label, SectionTitle } from "@/components/type/titles";
import SchedulerDetailsGrid from "./components/SchedulerDetails";
import ListRendersInTable from "./components/ListRendersInTable";
export default function SchedulerDetails({
  schedulerId,
  accountId,
  sport,
  accountType,
}: {
  schedulerId: string;
  accountId: string;
  sport: string;
  accountType: string;
}) {
  const {
    data: scheduler,
    isLoading,
    isError,
    error,
  } = useSchedulerQuery(schedulerId);

  if (isLoading) return <p>Loading scheduler...</p>;
  if (isError) {
    return (
      <div>
        <p>Error loading scheduler: {error?.message}</p>
        <pre>{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <section>
      <div>
        <SectionTitle>Scheduler Details</SectionTitle>
        <Label>
          Last Updated:{" "}
          {new Date(scheduler?.attributes?.updatedAt || "").toLocaleDateString(
            "en-US",
            {
              day: "numeric",
              month: "short",
              year: "2-digit",
            }
          )}
        </Label>
        <SchedulerDetailsGrid schedulerId={schedulerId} />

        <ListRendersInTable
          schedulerId={schedulerId}
          accountId={accountId}
          sport={sport}
          accountType={accountType}
        />
      </div>
    </section>
  );
}
