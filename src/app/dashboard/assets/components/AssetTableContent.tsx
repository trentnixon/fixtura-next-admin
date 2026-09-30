import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { AssetTableRow } from "./AssetTableRow";
import { Asset } from "@/types/asset";
import { AssetTypeGroup } from "./groupAssetsByType";

interface AssetTableContentProps {
  groups: AssetTypeGroup[];
  onEdit: (asset: Asset) => void;
  onDelete: (asset: Asset) => void;
  selectedSport: string;
  hasSearch: boolean;
}

export function AssetTableContent({
  groups,
  onEdit,
  onDelete,
  selectedSport,
  hasSearch,
}: AssetTableContentProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-md border py-8 text-center text-sm text-muted-foreground">
        {hasSearch
          ? `No ${selectedSport} assets match that search.`
          : `No assets found for ${selectedSport}.`}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const countLabel = `${group.assets.length} asset${group.assets.length === 1 ? "" : "s"}`;

        return (
          <ElementContainer
            key={group.typeName}
            title={group.typeName}
            subtitle={countLabel}
            border={false}
            padding="none"
          >
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Composition ID</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.assets.map((asset) => (
                    <AssetTableRow
                      key={asset.id}
                      asset={asset}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </ElementContainer>
        );
      })}
    </div>
  );
}
