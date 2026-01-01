"use client";

import { useMemo } from "react";
import { useGetYesterdaysRenders } from "@/hooks/scheduler/useGetYesterdaysRenders";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { AlertCircle, Clock, History, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function QuickInterventionSidebar() {
    const { data: yesterdayData } = useGetYesterdaysRenders();
    const { data: todayData } = useGetTodaysRenders();

    const interventions = useMemo(() => {
        const list: Array<{
            id: number;
            name: string;
            reason: string;
            type: "failure" | "stalled";
            time?: string;
        }> = [];

        // 1. Yesterday's Failures
        yesterdayData?.forEach((item) => {
            if (!item.render.complete) {
                list.push({
                    id: item.schedulerId,
                    name: item.accountName || item.schedulerName,
                    reason: "Failed Yesterday",
                    type: "failure",
                });
            }
        });

        // 2. Today's Stalled Renders (> 30 mins)
        todayData?.forEach((item) => {
            if (item.render?.processing) {
                const start = new Date(item.render.startedAt);
                const diffMins = Math.floor((new Date().getTime() - start.getTime()) / (1000 * 60));
                if (diffMins > 30) {
                    list.push({
                        id: item.schedulerId,
                        name: item.accountName || item.schedulerName,
                        reason: `Stalled (${diffMins}m)`,
                        type: "stalled",
                        time: item.scheduledTime,
                    });
                }
            }
        });

        return list;
    }, [yesterdayData, todayData]);

    return (
        <SectionContainer
            title="Attention Needed"
            description="Renders requiring immediate review"
            icon={<AlertCircle className="h-5 w-5 text-rose-500" />}
            className="h-full"
        >
            <div className="flex flex-col gap-3">
                {interventions.length > 0 ? (
                    interventions.map((item, idx) => (
                        <Link
                            key={`${item.id}-${idx}`}
                            href={`/dashboard/schedulers/${item.id}`}
                            className="group flex flex-col gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-brandPrimary-200 hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                                    {item.name}
                                </span>
                                <Badge
                                    variant={item.type === "failure" ? "destructive" : "warning"}
                                    className="text-[10px] px-1.5 py-0 h-4 uppercase font-bold"
                                >
                                    {item.type}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    {item.type === "failure" ? (
                                        <History className="h-3 w-3" />
                                    ) : (
                                        <Clock className="h-3 w-3" />
                                    )}
                                    <span>{item.reason}</span>
                                </div>
                                <div className="h-6 w-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brandPrimary-600 group-hover:border-brandPrimary-200 transition-colors">
                                    <ExternalLink className="h-3 w-3" />
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="py-8 text-center">
                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-50 text-green-500 mb-3">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <p className="text-sm text-slate-500 italic">All systems performing within normal parameters.</p>
                    </div>
                )}
            </div>
        </SectionContainer>
    );
}
