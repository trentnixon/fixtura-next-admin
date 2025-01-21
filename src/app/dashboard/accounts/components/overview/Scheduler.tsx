"use client";
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
  return (
    <section>
      <div>
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
