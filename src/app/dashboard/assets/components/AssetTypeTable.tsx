
"use client";

import React, { useState } from "react";
import { useAssetTypes } from "@/hooks/asset-types/useAssetTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, AlertCircle, FileStack } from "lucide-react";
import {
    Pagination,
    PaginationInfo,
    PaginationNext,
    PaginationPages,
    PaginationPrevious,
} from "@/components/ui/pagination";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";

export function AssetTypeTable() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const {
        data,
        isLoading,
        isError,
        error,
    } = useAssetTypes({
        page,
        pageSize: 12, // Increased page size for grid layout
        Name: searchTerm,
        populate: "assets",
    });

    if (isLoading) {
        return (
            <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Loading asset types...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-32 items-center justify-center rounded-md border border-destructive/50 bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p className="text-sm">Error loading asset types: {error?.message}</p>
            </div>
        );
    }

    const assetTypes = data?.data || [];
    const meta = data?.meta?.pagination;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search asset types..."
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
                <div className="text-sm text-muted-foreground">
                    Total: {meta?.total || 0}
                </div>
            </div>

            {assetTypes.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground border rounded-lg bg-slate-50/50">
                    No asset types found matching your criteria.
                </div>
            ) : (
                <MetricGrid columns={4} gap="md">
                    {assetTypes.map((type) => (
                        <StatCard
                            key={type.id}
                            title={type.Name}
                            value={type.assets?.length || 0}
                            description="Assets linked"
                            icon={<FileStack className="h-5 w-5" />}
                            variant="light"
                            className="h-full"
                        />
                    ))}
                </MetricGrid>
            )}

            {meta && meta.pageCount > 1 && (
                <div className="flex items-center justify-between border-t pt-4">
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
                            itemsPerPage={12}
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
        </div>
    );
}
