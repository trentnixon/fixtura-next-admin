
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useAssets } from "@/hooks/assets/useAssets";
import { useCreateAsset } from "@/hooks/assets/useCreateAsset";
import { useUpdateAsset } from "@/hooks/assets/useUpdateAsset";
import { useDeleteAsset } from "@/hooks/assets/useDeleteAsset";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetForm } from "./AssetForm";
import { AssetTableFilters } from "./AssetTableFilters";
import { AssetTableContent } from "./AssetTableContent";
import { Asset } from "@/types/asset";
import { AssetFormValues } from "../schemas/assetFormSchema";
import { toast } from "sonner";

export function AssetTable() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("Cricket");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | undefined>(undefined);

  const buildFilters = () => {
    const filters: any = { Sport: selectedSport };
    if (searchTerm) {
      filters.Name = { $contains: searchTerm };
    }
    return filters;
  };

  const {
    data: assetsData,
    isLoading,
    isError,
    error,
  } = useAssets({
    page,
    pageSize: 20,
    filters: buildFilters(),
  });

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();
  const deleteMutation = useDeleteAsset();

  const handleCreateClick = () => {
    setEditingAsset(undefined);
    setIsSheetOpen(true);
  };

  const handleEditClick = (asset: Asset) => {
    setEditingAsset(asset);
    setIsSheetOpen(true);
  };

  const handleDeleteClick = (asset: Asset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: AssetFormValues) => {
    try {
      if (editingAsset) {
        await updateMutation.mutateAsync({ id: editingAsset.id, data });
        toast.success("Asset updated successfully!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Asset created successfully!");
      }
      setIsSheetOpen(false);
      setEditingAsset(undefined);
    } catch (err) {
      toast.error(editingAsset ? "Failed to update asset" : "Failed to create asset");
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!assetToDelete) return;
    try {
      await deleteMutation.mutateAsync(assetToDelete.id);
      toast.success("Asset deleted successfully!");
      setDeleteDialogOpen(false);
      setAssetToDelete(undefined);
    } catch (err) {
      toast.error("Failed to delete asset");
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-4">Loading assets...</div>;
  if (isError) return <div className="p-4 text-red-500">Error loading assets: {error?.message}</div>;

  const assets = assetsData?.data || [];
  const meta = assetsData?.meta?.pagination;

  const sortedAssets = [...assets].sort((a, b) => {
    const compositionIDA = a.attributes.CompositionID || "";
    const compositionIDB = b.attributes.CompositionID || "";
    return compositionIDA.localeCompare(compositionIDB);
  });

  return (
    <>
      <div className="space-y-4">
        <AssetTableFilters
          searchTerm={searchTerm}
          setSearchTerm={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          selectedSport={selectedSport}
          onSportChange={(sport) => {
            setSelectedSport(sport);
            setPage(1);
          }}
          onClearSearch={() => {
            setSearchTerm("");
            setPage(1);
          }}
          onCreateClick={handleCreateClick}
          assetCount={sortedAssets.length}
        />

        <AssetTableContent
          assets={sortedAssets}
          pagination={meta}
          onPageChange={setPage}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          selectedSport={selectedSport}
        />
      </div>

      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingAsset ? "Edit Asset" : "Create New Asset"}</SheetTitle>
            <SheetDescription>
              {editingAsset ? "Update the asset details below." : "Fill in the details to create a new asset."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AssetForm
              asset={editingAsset}
              onSubmit={handleFormSubmit}
              isSubmitting={createMutation.isPending || updateMutation.isPending}
              onCancel={() => setIsSheetOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Asset</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{assetToDelete?.attributes.Name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
