
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Asset } from "@/types/asset";

interface AssetTableRowProps {
    asset: Asset;
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
}

export function AssetTableRow({ asset, onEdit, onDelete }: AssetTableRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium">
                {asset.attributes.Name}
                {asset.attributes.SubTitle && (
                    <div className="text-xs text-muted-foreground">
                        {asset.attributes.SubTitle}
                    </div>
                )}
            </TableCell>
            <TableCell>
                <span className="text-sm text-muted-foreground font-mono">
                    {asset.attributes.CompositionID}
                </span>
            </TableCell>
            <TableCell>
                <Badge variant="secondary">{asset.attributes.Sport}</Badge>
            </TableCell>
            <TableCell>
                {asset.attributes.asset_category?.data?.attributes?.Name || "-"}
            </TableCell>
            <TableCell>
                {asset.attributes.asset_type?.data?.attributes?.Name || "-"}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(asset)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(asset)}
                            className="text-red-600"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
