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
import {
    DatabaseIcon,
    EyeIcon,
    CheckCircle2,
    FileText,
    Video,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { RenderAuditItem } from "@/types/render";

export function GlobalRenderTable() {
    const [page, setPage] = useState(1);
    const { data, isLoading, isError, error } = useRenderAudit(page);

    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState error={error} />;

    const renders = data?.data || [];
    const pagination = data?.pagination;

    const getStatusBadge = (render: RenderAuditItem) => {
        if (render.isGhostRender) {
            return <Badge variant="warning">Ghost Render</Badge>;
        }
        if (render.Processing) {
            return <Badge variant="info" className="animate-pulse">Rendering</Badge>;
        }
        if (render.Complete) {
            return <Badge variant="secondary">Complete</Badge>;
        }
        return <Badge variant="outline">Queued</Badge>;
    };

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-b border-slate-200">
                            <TableHead className="font-semibold text-slate-900">Render / Entity</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900">Status</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900">Output</TableHead>
                            <TableHead className="text-right font-semibold text-slate-900">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {renders.map((render) => (
                            <TableRow key={render.renderId} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                <TableCell className="py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-slate-900">
                                                {render.renderName || "Unnamed Render"}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">#{render.renderId}</span>
                                        </div>
                                        {render.account && (
                                            <div className="flex items-center gap-1.5 mt-1">
                                                <span className="text-xs text-slate-600 font-medium">{render.account.accountName}</span>
                                                <span className="text-[10px] text-slate-400">({render.account.accountSport})</span>
                                                <span className="text-[9px] px-1 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase font-bold">
                                                    {render.account.accountType}
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-[10px] text-slate-400 mt-1 italic">
                                            {new Date(render.publishedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center">
                                        {getStatusBadge(render)}
                                    </div>
                                    {render.EmailSent && (
                                        <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-emerald-600 font-bold uppercase">
                                            <CheckCircle2 className="h-2.5 w-2.5" />
                                            Email Sent
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1.5">
                                            <Video className="h-3 w-3 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-700">{render.downloadsCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FileText className="h-3 w-3 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-700">{render.aiArticlesCount}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="primary" size="icon" asChild className="h-8 w-8">
                                            <Link href={`/dashboard/renders/${render.renderId}`} title="View Details">
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="secondary" size="icon" asChild className="h-8 w-8">
                                            <Link href={`/strapi-deep-link-placeholder/${render.renderId}`} target="_blank" title="View in CMS">
                                                <DatabaseIcon className="h-4 w-4 text-slate-500" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {renders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-12 text-slate-400 italic">
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
