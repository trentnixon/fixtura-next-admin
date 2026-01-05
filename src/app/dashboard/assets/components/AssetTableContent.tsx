
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationInfo,
    PaginationNext,
    PaginationPages,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { AssetTableRow } from "./AssetTableRow";
import { Asset } from "@/types/asset";

interface AssetTableContentProps {
    assets: Asset[];
    pagination: {
        page: number;
        pageCount: number;
        total: number;
    } | undefined;
    onPageChange: (page: number) => void;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
    selectedSport: string;
}

export function AssetTableContent({
    assets,
    pagination,
    onPageChange,
    onEdit,
    onDelete,
    selectedSport,
}: AssetTableContentProps) {
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Composition ID</TableHead>
                            <TableHead>Sport</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assets.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="py-8 text-center text-sm text-muted-foreground"
                                >
                                    No assets found for {selectedSport}. Try adjusting your search
                                    or filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            assets.map((asset) => (
                                <AssetTableRow
                                    key={asset.id}
                                    asset={asset}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.pageCount > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.pageCount}
                        onPageChange={onPageChange}
                        variant="primary"
                        className="w-full"
                    >
                        <PaginationInfo
                            format="long"
                            totalItems={pagination.total}
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
        </div>
    );
}
