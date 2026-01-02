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
import { DatabaseIcon, EyeIcon, PlayCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Scheduler } from "@/types/scheduler";

interface ActiveRendersTableProps {
    items: Scheduler[];
    strapiLocation: { scheduler: string };
}

export function ActiveRendersTable({ items, strapiLocation }: ActiveRendersTableProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
                <PlayCircle className="h-4 w-4 text-blue-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Renders</h3>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50/50 border-b border-slate-200">
                            <TableHead className="text-left font-semibold text-slate-900">Name</TableHead>
                            <TableHead className="text-center font-semibold text-slate-900 w-[120px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((scheduler) => (
                            <TableRow key={scheduler.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0">
                                <TableCell className="text-left font-medium py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-900 font-bold">{scheduler.accountName || scheduler.Name}</span>
                                            {scheduler.accountType && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                                                    {scheduler.accountType}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[11px] text-slate-500">{scheduler.organizationName}</span>
                                            <span className="text-[9px] text-slate-400 font-normal">ID: {scheduler.id}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {scheduler.accountId && scheduler.accountType && (
                                            <Button variant="primary" size="icon" asChild className="h-8 w-8">
                                                <Link
                                                    href={`/dashboard/accounts/${scheduler.accountType.toLowerCase()}/${scheduler.accountId}`}
                                                    title="View Account"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        )}
                                        <Button variant="primary" size="icon" asChild className="h-8 w-8">
                                            <Link href={`/dashboard/schedulers/${scheduler.id}`} title="View Scheduler">
                                                <EyeIcon className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button variant="primary" size="icon" asChild className="h-8 w-8">
                                            <Link href={`${strapiLocation.scheduler}${scheduler.id}`} target="_blank" title="View in CMS">
                                                <DatabaseIcon className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center py-10 text-slate-400 italic text-sm">
                                    No active renders
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
