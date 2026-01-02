"use client";

import { useParams } from "next/navigation";
import { useSchedulerByID } from "@/hooks/scheduler/useSchedulerByID";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { Clock, Calendar, Settings, User, Trophy, ExternalLink, Activity } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SchedulerPage = () => {
  const { schedulersID } = useParams();
  const { data, isLoading, isError } = useSchedulerByID(Number(schedulersID));

  if (isLoading) return <LoadingState message="Loading scheduler details..." />;
  if (isError || !data) return <ErrorState title="Error" description="Could not load scheduler details" />;

  const { attributes: scheduler } = data;
  const account = scheduler.account?.data;

  return (
    <div className="space-y-6">
      <SectionContainer
        title={scheduler.Name}
        description="Configuration and Account Details"
        icon={<Settings className="h-5 w-5 text-slate-500" />}
        action={
          <div className="flex items-center gap-3">

            {account && (
              <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                <Button variant="primary" asChild size="sm">
                  <Link
                    href={`/dashboard/accounts/${account.attributes.account_type?.data?.attributes?.Name.toLowerCase()}/${account.id}`}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Account Dashboard
                  </Link>
                </Button>
              </div>
            )}
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Account Context */}
          {account && (
            <>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-brandPrimary-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account</span>
                  <span className="text-sm font-bold text-slate-900 leading-tight">
                    {account.attributes.FirstName} {account.attributes.LastName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-brandSecondary-600">
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Competition</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{account.attributes.Sport}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold uppercase border border-slate-200">
                      {account.attributes.account_type?.data?.attributes?.Name}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Schedule Context */}
          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-amber-500">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</span>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-900">{scheduler.Time?.slice(0, 5) || "--:--"}</span>
                <span className="text-[10px] text-slate-500 font-medium">on</span>
                <span className="text-sm font-bold text-slate-900">
                  {scheduler.days_of_the_week?.data?.attributes?.Name || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
            <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-500">
              <Activity className="h-5 w-5" />
            </div>
            <div className="flex flex-col grow">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Status</span>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <StatusBadge
                    status={!scheduler.isRendering}
                    trueLabel="Idle"
                    falseLabel="Rendering"
                    variant={!scheduler.isRendering ? "neutral" : "info"}
                    className="text-[9px] py-0 px-2 h-4"
                  />
                </div>
                <div className="flex flex-col">
                  <StatusBadge
                    status={!scheduler.Queued}
                    trueLabel="Ready"
                    falseLabel="Queued"
                    variant={!scheduler.Queued ? "neutral" : "warning"}
                    className="text-[9px] py-0 px-2 h-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>


      </SectionContainer>
    </div>
  );
};

export default SchedulerPage;
