"use client";

import { useState } from "react";
import { useRenderAudit } from "@/hooks/renders/useRenderAudit";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Text from "@/components/ui-library/foundation/Text";
import {
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { RenderAuditItem } from "@/types/render";
import { formatDate } from "@/utils/chart-formatters";

export function GlobalRenderTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error } = useRenderAudit(page);

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState error={error} />;

    const renders = data?.data || [];
    const pagination = data?.pagination;

    // Grouping logic
    const groupedRenders = renders.reduce((acc, render) => {
        const accountId = render.account?.accountId || 0;
        if (!acc[accountId]) {
            acc[accountId] = {
                renderId: render.renderId, // Keep latest render ID
                account: render.account,
                rendersCount: 0,
                completeCount: 0,
                totalDownloads: 0,
                totalAiArticles: 0,
                latestRender: render,
            };
        }
        acc[accountId].rendersCount += 1;
        if (render.Complete) acc[accountId].completeCount += 1;
        acc[accountId].totalDownloads += render.downloadsCount;
        acc[accountId].totalAiArticles += render.aiArticlesCount;
        return acc;
    }, {} as Record<number, {
        renderId: number;
        account: RenderAuditItem['account'];
        rendersCount: number;
        completeCount: number;
        totalDownloads: number;
        totalAiArticles: number;
        latestRender: RenderAuditItem;
    }>);

    const displayItems = Object.values(groupedRenders);

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            <TableHead className="font-semibold text-slate-900">Organization / Entity</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-20">Renders</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-36">Progress</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-20">Videos</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-20">Articles</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-24">Avg Assets</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayItems.map((item) => (
                            <TableRow key={item.account?.accountId || item.renderId} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0 group">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        {/* Organization Name as primary focus */}
                                        {item.account && (
                                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                                <div className="flex items-center gap-1 text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                    <span>{item.account.accountName}</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-medium">({item.account.accountSport})</span>
                                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider text-slate-400/80 border-slate-200 h-auto py-0 px-1.5">
                                                    {item.account.accountType}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Latest Render Name and ID underneath */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[12px] font-medium text-slate-600 truncate max-w-[250px]" title={item.latestRender.renderName || "Unnamed"}>
                                                Latest: {item.latestRender.renderName || "Unnamed Render"}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] text-slate-400 font-mono bg-slate-50 border-slate-100 px-1.5 py-0 rounded h-auto font-normal">
                                                {item.latestRender.renderId}
                                            </Badge>
                                        </div>

                                        {/* Single Date display for latest activity */}
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                            <span>{formatDate(item.latestRender.publishedAt || item.latestRender.createdAt)}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        <Badge variant="secondary" className="font-mono font-bold bg-slate-50 text-slate-700 border-slate-100 text-sm px-2 py-0.5 pointer-events-none">
                                            {item.rendersCount}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-center gap-1.5">
                                            <Progress
                                                value={(item.completeCount / item.rendersCount) * 100}
                                                className="w-16 h-1.5 border border-slate-200 bg-slate-100"
                                                indicatorClassName="bg-emerald-500"
                                            />
                                            <span className="text-[10px] font-black text-slate-500 font-mono">
                                                {item.completeCount}/{item.rendersCount}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-bold text-slate-700">{item.totalDownloads}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] font-bold text-slate-700">{item.totalAiArticles}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center">
                                        <Text variant="tiny" weight="bold" className="text-slate-900 font-black">
                                            {((item.totalDownloads + item.totalAiArticles) / item.rendersCount).toFixed(1)}
                                        </Text>
                                        <Text variant="tiny" weight="bold" className="text-[8px] text-slate-400 uppercase tracking-tighter leading-tight">
                                            Avg/Render
                                        </Text>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {displayItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-slate-400 italic">
                                    No renders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.pageCount > 1 && (
                <div className="flex items-center justify-between px-2">
                    <div className="text-xs text-slate-500">
                        Showing <span className="font-bold">{(page - 1) * 25 + 1}</span> to{" "}
                        <span className="font-bold">{Math.min(page * 25, pagination.total)}</span> of{" "}
                        <span className="font-bold">{pagination.total}</span> renders
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="h-8 px-2"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        <div className="text-xs font-bold text-slate-700 px-3 py-1 bg-slate-100 rounded-md border border-slate-200">
                            Page {page} of {pagination.pageCount}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(Math.min(pagination.pageCount, page + 1))}
                            disabled={page === pagination.pageCount}
                            className="h-8 px-2"
                        >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
