"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, DatabaseIcon, ArrowRight } from "lucide-react";
import { useSchedulerSearch } from "@/hooks/scheduler/useSchedulerSearch";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export function SchedulerSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const { data: results, isLoading } = useSchedulerSearch(debouncedSearch);

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Search schedulers by name or ID..."
                    className="pl-10 h-10 bg-white border-slate-200 focus-visible:ring-brandPrimary-500"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                )}
            </div>

            {isOpen && searchTerm.length >= 2 && (
                <Card className="absolute top-full mt-2 w-full z-50 shadow-xl border-slate-200 overflow-hidden bg-white">
                    <div className="max-h-[300px] overflow-y-auto">
                        {results && results.length > 0 ? (
                            <div className="py-2">
                                {results.map((scheduler) => (
                                    <Link
                                        key={scheduler.id}
                                        href={`/dashboard/schedulers/${scheduler.id}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brandPrimary-50 group-hover:text-brandPrimary-600 transition-colors">
                                                <DatabaseIcon className="h-4 w-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 line-clamp-1">
                                                    {scheduler.Name}
                                                </span>
                                                <span className="text-xs text-slate-500">ID: {scheduler.id}</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brandPrimary-500 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        ) : results ? (
                            <div className="p-4 text-center text-sm text-slate-500 italic">
                                No schedulers found
                            </div>
                        ) : null}
                    </div>
                    <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Press ESC to close
                    </div>
                </Card>
            )}

            {/* Backdrop to close on click outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 pointer-events-auto"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
