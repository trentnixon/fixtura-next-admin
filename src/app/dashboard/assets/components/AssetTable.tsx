"use client";

import React, { useMemo, useState } from "react";
import { useAllAssets } from "@/hooks/assets/useAssets";
import { useCreateAsset } from "@/hooks/assets/useCreateAsset";
import { useUpdateAsset } from "@/hooks/assets/useUpdateAsset";
import { useDeleteAsset } from "@/hooks/assets/useDeleteAsset";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
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
import {
  filterAssetsBySearch,
  groupAssetsByType,
} from "./groupAssetsByType";

export function AssetTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string>("Cricket");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>(
    undefined,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | undefined>(
    undefined,
  );

  const {
    data: assetsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useAllAssets({
    filters: { Sport: selectedSport },
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
      toast.error(
        editingAsset ? "Failed to update asset" : "Failed to create asset",
      );
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

  const assets = useMemo(() => assetsData?.data ?? [], [assetsData]);
  const total = assetsData?.meta?.pagination?.total ?? assets.length;
  const filteredAssets = useMemo(
    () => filterAssetsBySearch(assets, searchTerm),
    [assets, searchTerm],
  );
  const groups = useMemo(
    () => groupAssetsByType(filteredAssets),
    [filteredAssets],
  );

  if (isLoading) {
    return <LoadingState message="Loading assets..." />;
  }

  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load assets"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        <AssetTableFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          onClearSearch={() => setSearchTerm("")}
          onCreateClick={handleCreateClick}
          assetCount={filteredAssets.length}
          typeCount={groups.length}
          loadedCount={assets.length}
          totalCount={total}
        />

        <AssetTableContent
          groups={groups}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          selectedSport={selectedSport}
          hasSearch={searchTerm.trim().length > 0}
        />
      </div>

      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingAsset ? "Edit Asset" : "Create New Asset"}
            </SheetTitle>
            <SheetDescription>
              {editingAsset
                ? "Update the asset details below."
                : "Fill in the details to create a new asset."}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <AssetForm
              asset={editingAsset}
              onSubmit={handleFormSubmit}
              isSubmitting={
                createMutation.isPending || updateMutation.isPending
              }
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
              Are you sure you want to delete &ldquo;
              {assetToDelete?.attributes.Name}&rdquo;? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
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
