"use client";

import React, { useState } from "react";
import { useAudioOptions } from "@/hooks/audio-options/useAudioOptions";
import { useDeleteAudioOption } from "@/hooks/audio-options/useAudioOptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    X,
    Loader2,
    AlertCircle,
    Edit,
    Trash2,
    Music
} from "lucide-react";
import {
    Pagination,
    PaginationInfo,
    PaginationNext,
    PaginationPages,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AudioOption } from "@/types/audio-option";
import { AudioPlayer } from "@/components/ui/audio-player";

export function AudioOptionTable() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState<AudioOption | undefined>(undefined);

    const {
        data,
        isLoading,
        isError,
        error,
    } = useAudioOptions({
        page,
        pageSize: 20, // Better for table view
        filters: searchTerm ? { Name: searchTerm } : undefined,
    });

    const deleteMutation = useDeleteAudioOption();

    const handleDeleteClick = (option: AudioOption) => {
        setOptionToDelete(option);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!optionToDelete) return;
        try {
            await deleteMutation.mutateAsync(optionToDelete.id);
            toast.success("Audio option deleted");
            setDeleteDialogOpen(false);
        } catch (_err) {
            console.error("Failed to delete audio option", _err);
            toast.error("Failed to delete audio option");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading audio options...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-32 items-center justify-center rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p className="text-sm">Error loading audio options: {error?.message}</p>
            </div>
        );
    }

    const audioOptions = data?.data || [];
    const meta = data?.meta?.pagination;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search audio options..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        className="pl-10 pr-9"
                    />
                    {searchTerm && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                                setSearchTerm("");
                                setPage(1);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        Total: {meta?.total || 0}
                    </div>
                </div>
            </div>

            <div className="rounded-md border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow>
                            <TableHead className="w-[40px]"></TableHead>
                            <TableHead className="font-semibold text-slate-700">Name</TableHead>
                            <TableHead className="font-semibold text-slate-700">Composition ID</TableHead>
                            <TableHead className="font-semibold text-slate-700">Component Name</TableHead>
                            <TableHead className="font-semibold text-slate-700">Source URL</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {audioOptions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                                    No audio options found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            audioOptions.map((opt) => (
                                <TableRow key={opt.id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell>
                                        <div className="bg-brandPrimary-50 p-2 rounded-md">
                                            <Music className="h-4 w-4 text-brandPrimary-600" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-slate-900">{opt.Name}</TableCell>
                                    <TableCell>
                                        <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono">
                                            {opt.CompositionID || "N/A"}
                                        </code>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{opt.ComponentName || "N/A"}</TableCell>
                                    <TableCell>
                                        {opt.URL ? (
                                            <AudioPlayer url={opt.URL} id={opt.id} />
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">No audio URL</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-brandPrimary-600">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-slate-500 hover:text-destructive"
                                                onClick={() => handleDeleteClick(opt)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {meta && meta.pageCount > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                    <Pagination
                        currentPage={page}
                        totalPages={meta.pageCount}
                        onPageChange={setPage}
                        variant="primary"
                        className="w-full"
                    >
                        <PaginationInfo
                            format="short"
                            totalItems={meta.total}
                            itemsPerPage={20}
                            className="mr-auto"
                        />
                        <div className="ml-auto flex items-center gap-1">
                            <PaginationPrevious />
                            <PaginationPages />
                            <PaginationNext />
                        </div>
                    </Pagination>
                </div>
            )}

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Audio Option</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-slate-900">&quot;{optionToDelete?.Name}&quot;</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={deleteMutation.isPending}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmDelete}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
