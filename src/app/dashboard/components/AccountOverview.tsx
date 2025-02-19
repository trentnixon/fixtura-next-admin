// QuickView.tsx
"use client";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import MetricCard from "../accounts/components/overview/tabs/components/metricCard";
import { TodaysRenders } from "@/types/scheduler";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
export default function AccountOverview() {
  const { data } = useGetTodaysRenders();
  const { data: accountSummary } = useAccountSummaryQuery();

  const useAccountSummary = accountSummary?.data;
  console.log(useAccountSummary);
  const renderingCount = getRenderingCount(data ?? []);
  const queuedCount = getQueuedCount(data ?? []);

  const ClubsBySport = useAccountSummary?.Totals.sportsPerAccountTypeCount.Club;
  const AssociationsBySport =
    useAccountSummary?.Totals.sportsPerAccountTypeCount.Association;

  return (
    <div className="flex flex-col gap-4">
      <div className="col-span-12 gap-4 space-y-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <MetricCard
                  title={"Associations"}
                  lastUpdate={`${AssociationsBySport?.Cricket} Cricket | ${AssociationsBySport?.AFL} AFL | ${AssociationsBySport?.Netball} Netball`}
                  value={
                    useAccountSummary?.Totals.accountTypesCount.Association
                  }
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/accounts/association">
                        View Associations
                      </Link>
                    </Button>
                  }
                />
              </div>
              <div>
                <MetricCard
                  title={"Total Clubs"}
                  lastUpdate={`${ClubsBySport?.Cricket} Cricket | ${ClubsBySport?.AFL} AFL | ${ClubsBySport?.Netball} Netball`}
                  value={useAccountSummary?.Totals.accountTypesCount.Club}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/accounts/club">View Clubs</Link>
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
          {/* Right Side */}
          <div className=" grid col-span-4 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <MetricCard
                  title={"Cricket Accounts"}
                  value={useAccountSummary?.Totals.sportsCount.Cricket}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={`${useAccountSummary?.Totals.sportsCount.AFL} AFL | ${useAccountSummary?.Totals.sportsCount.Netball} Netball`}
                />
              </div>
              <div>
                <MetricCard
                  title={"Active trial"}
                  value={useAccountSummary?.Totals.trialInstanceStatus.active}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={`Expired ${useAccountSummary?.Totals.trialInstanceStatus.expired}`}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <MetricCard
                  title={"Accounts Rendering"}
                  value={renderingCount}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={"From today"}
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/schedulers">Schedulers</Link>
                    </Button>
                  }
                />
              </div>
              <div>
                <MetricCard
                  title={"Accounts Queued"}
                  value={queuedCount}
                  icon={
                    <CalendarIcon className="w-6 h-6 ml-2 text-emerald-500" />
                  }
                  lastUpdate={"From today"}
                  action={
                    <Button variant="outline">
                      <Link href="/dashboard/schedulers">Schedulers</Link>
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// func to work out the number of items where isRendering is true
function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter(item => item.isRendering).length || 0;
}

// func to work out the number of items where queued is false
function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter(item => item.queued).length || 0;
}
