"use client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetYesterdaysRenders } from "@/hooks/scheduler/useGetYesterdaysRenders";
import { YesterdaysRenders } from "@/types/scheduler";
import { EyeIcon, DatabaseIcon, Mail } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/ui-library/badges/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function GetYesterdaysSchedulers() {
    const { data, isLoading } = useGetYesterdaysRenders();

    if (isLoading) return <div className="p-12 text-center text-slate-400 italic">Finding yesterday&apos;s results...</div>;

    const sortedData = [...(data || [])].sort((a, b) => {
        if (a.accountSport < b.accountSport) return -1;
        if (a.accountSport > b.accountSport) return 1;
        return 0;
    });

    const clubSchedulers = sortedData.filter((s) => s.accountType === "Club");
    const associationSchedulers = sortedData.filter((s) => s.accountType === "Association");

    return (
        <div className="space-y-6">
            <Tabs defaultValue="club" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <TabsList variant="secondary">
                        <TabsTrigger value="club">Club ({clubSchedulers.length})</TabsTrigger>
                        <TabsTrigger value="association">
                            Association ({associationSchedulers.length})
                        </TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="club" className="mt-0">
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <Table>
                            <SchedulerTableHeader />
                            <SchedulerTableBody data={clubSchedulers} />
                        </Table>
                    </div>
                </TabsContent>
                <TabsContent value="association" className="mt-0">
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        <Table>
                            <SchedulerTableHeader />
                            <SchedulerTableBody data={associationSchedulers} />
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const SchedulerTableHeader = () => {
    return (
        <TableHeader>
            <TableRow className="bg-slate-50/50">
                <TableHead className="text-left font-semibold">Account Name</TableHead>
                <TableHead className="text-center font-semibold">Sport</TableHead>
                <TableHead className="text-center font-semibold">Status</TableHead>
                <TableHead className="text-center font-semibold text-xs px-2">Wait (s)</TableHead>
                <TableHead className="text-center font-semibold">Email</TableHead>
                <TableHead className="text-center font-semibold">Completed At</TableHead>
                <TableHead className="text-center font-semibold">Actions</TableHead>
            </TableRow>
        </TableHeader>
    );
};

const SchedulerTableBody = ({ data }: { data: YesterdaysRenders[] }) => {
    return (
        <TableBody>
            {data?.map((scheduler) => (
                <TableRow key={scheduler.schedulerId} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-left font-medium">
                        <div className="flex flex-col">
                            <span>{scheduler.accountName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">ID: {scheduler.schedulerId}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-center">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                            {scheduler.accountSport}
                        </span>
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                            <StatusBadge
                                status={scheduler.render.complete}
                                trueLabel="Success"
                                falseLabel="Incomplete"
                                variant={scheduler.render.complete ? "default" : "error"}
                            />
                            {scheduler.render.failureReason && !scheduler.render.complete && (
                                <span className="text-[10px] text-error-600 font-bold uppercase tracking-tight">
                                    {scheduler.render.failureReason}
                                </span>
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-[10px] text-slate-500">
                        {scheduler.render.queueWaitTimeSeconds !== null ? `${scheduler.render.queueWaitTimeSeconds}s` : "--"}
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex justify-center">
                            {scheduler.render.emailSent ? (
                                <Mail className="h-4 w-4 text-green-500" aria-label="Email Sent" />
                            ) : (
                                <Mail className="h-4 w-4 text-slate-300" aria-label="Email Not Sent" />
                            )}
                        </div>
                    </TableCell>
                    <TableCell className="text-center font-mono text-xs text-slate-500">
                        {scheduler.render.completedAt ? formatDate(scheduler.render.completedAt) : "--:--"}
                    </TableCell>
                    <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Link
                                href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${scheduler.accountId}`}
                            >
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600" title="View Account">
                                    <EyeIcon className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href={`/dashboard/schedulers/${scheduler.schedulerId}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600" title="View Scheduler">
                                    <DatabaseIcon className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </TableCell>
                </TableRow>
            ))}
            {data?.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500 italic">
                        No history found for yesterday
                    </TableCell>
                </TableRow>
            )}
        </TableBody>
    );
};
