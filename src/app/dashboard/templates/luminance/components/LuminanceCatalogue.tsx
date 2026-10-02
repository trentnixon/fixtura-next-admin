"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { cn } from "@/lib/utils";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import {
  useCreateTemplateLuminance,
  useDeleteTemplateLuminance,
  useSetTemplateLuminancePublished,
  useTemplateLuminances,
  useUpdateTemplateLuminance,
} from "@/hooks/template-luminance/useTemplateLuminance";
import { useBrandThemes } from "@/hooks/brand-theme/useBrandTheme";
import { useUploadCmsImage } from "@/hooks/media/useUploadCmsImage";
import { TemplateLuminance } from "@/types/template-luminance";
import { isHexColor, resolveBrandPresetStops } from "./luminanceMap";
import { CatalogueToolbar, matchesPublishFilter, PublishFilter } from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { BrandMapLegend, LuminanceMappedPlate } from "./LuminanceMappedPlate";

function plateSrc(url: string | null): string | null {
  return resolveStrapiMediaUrl(url);
}

function hasPublicUrl(url: string | null): boolean {
  return Boolean(url && /^https?:\/\//i.test(url.trim()));
}

function PlatePreview({ src }: { src: string | null }) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-muted-foreground">
        No image
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-full w-full object-cover grayscale" />
  );
}

function PlateFlag({ children }: { children: string }) {
  return (
    <span className={cn("rounded-full border border-amber-300 px-2 py-0.5 text-[11px] text-amber-800")}>
      {children}
    </span>
  );
}

export function LuminanceCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateLuminances();
  const createPlate = useCreateTemplateLuminance();
  const updatePlate = useUpdateTemplateLuminance();
  const setPublished = useSetTemplateLuminancePublished();
  const deletePlate = useDeleteTemplateLuminance();
  const uploadImage = useUploadCmsImage();
  const themes = useBrandThemes();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateLuminance | undefined>();
  const [name, setName] = useState("");
  const [imageId, setImageId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [localPreview, setLocalPreview] = useState<string | undefined>();
  const [fileKey, setFileKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<TemplateLuminance | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [viewing, setViewing] = useState<TemplateLuminance | undefined>();
  const [themeId, setThemeId] = useState<string>("");

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const clearFile = () => {
    setSelectedFile(undefined);
    setLocalPreview(undefined);
    setFileKey((key) => key + 1);
  };

  const chooseFile = (file: File | undefined) => {
    if (file && !file.type.startsWith("image/")) {
      toast.error("The plate must be an image");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10 MB or smaller");
      return;
    }
    setSelectedFile(file);
    setLocalPreview(file ? URL.createObjectURL(file) : undefined);
  };

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setImageId("");
    clearFile();
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateLuminance) => {
    setEditing(row);
    setName(row.name);
    setImageId(row.imageId === null ? "" : String(row.imageId));
    clearFile();
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    let parsedId: number | null = null;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", trimmedName);
      try {
        const uploaded = await uploadImage.mutateAsync(formData);
        parsedId = uploaded.id;
        setImageId(String(uploaded.id));
        setSelectedFile(undefined);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
        return;
      }
    } else {
      const trimmedId = imageId.trim();
      if (trimmedId) {
        const parsed = Number(trimmedId);
        if (!Number.isInteger(parsed) || parsed <= 0) {
          toast.error("Media library file id must be a number");
          return;
        }
        parsedId = parsed;
      } else if (editing?.imageId) {
        parsedId = editing.imageId;
      }
    }
    if (parsedId === null) {
      toast.error("Upload an image or enter a media library file id");
      return;
    }
    const input = { name: trimmedName, imageId: parsedId };
    try {
      if (editing) {
        await updatePlate.mutateAsync({ id: editing.id, input });
        toast.success("Luminance plate updated");
      } else {
        await createPlate.mutateAsync(input);
        toast.success("Luminance plate created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateLuminance) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Plate unpublished" : "Plate published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePlate.mutateAsync(deleteTarget.id);
      toast.success("Luminance plate deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const themeRows = (themes.data?.data ?? []).filter(
    (theme) => isHexColor(theme.theme.primary) && isHexColor(theme.theme.secondary),
  );
  const selectedTheme = themeRows.find((theme) => String(theme.id) === themeId) ?? themeRows[0];
  const primary = selectedTheme?.theme.primary ?? "";
  const secondary = selectedTheme?.theme.secondary ?? "";
  const brandMap = useMemo(
    () => (primary && secondary ? resolveBrandPresetStops(primary, secondary) : null),
    [primary, secondary],
  );

  if (isLoading) return <LoadingState message="Loading luminance plates..." />;
  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load luminance plates"
        onRetry={() => refetch()}
      />
    );
  }

  const rows = data?.data ?? [];
  const visible = rows.filter((row) => matchesPublishFilter(row.publishedAt, status));
  const saving = createPlate.isPending || updatePlate.isPending || uploadImage.isPending;
  const previewUrl =
    editing && String(editing.imageId ?? "") === imageId.trim()
      ? plateSrc(editing.imageUrl)
      : null;
  const sheetPreview = localPreview ?? previewUrl;

  return (
    <>
      <CatalogueToolbar addLabel="Add plate" onAdd={openCreate} status={status} onStatusChange={setStatus}>
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor="luminance-theme">Preview theme</Label>
          <Select
            value={selectedTheme ? String(selectedTheme.id) : undefined}
            onValueChange={setThemeId}
            disabled={themeRows.length === 0}
          >
            <SelectTrigger id="luminance-theme" className="w-56">
              <SelectValue placeholder={themes.isLoading ? "Loading themes..." : "No themes"} />
            </SelectTrigger>
            <SelectContent>
              {themeRows.map((theme) => (
                <SelectItem key={theme.id} value={String(theme.id)}>
                  {theme.name || `Theme #${theme.id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CatalogueToolbar>

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No luminance plates yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No luminance plates match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            const src = plateSrc(row.imageUrl);
            const needsPublicUrl = row.imageId !== null && !hasPublicUrl(row.imageUrl);
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={row.imageName || (row.imageId ? `File #${row.imageId}` : "No image")}
                published={published}
                locked={false}
                publishDisabled={publishing}
                onEdit={() => openEdit(row)}
                onPreview={src ? () => setViewing(row) : undefined}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={
                  src && brandMap ? (
                    <LuminanceMappedPlate src={src} fit="cover" stops={brandMap.stops} />
                  ) : (
                    <PlatePreview src={src} />
                  )
                }
                badges={needsPublicUrl ? <PlateFlag>Needs a public URL</PlateFlag> : undefined}
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit plate" : "Add plate"}</SheetTitle>
            <SheetDescription>
              Upload a grayscale plate into the CMS media library. It is linked on this row. You can also enter a file id that is already in the library. The stored URL must be absolute http or https before an account can select the plate.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-28 overflow-hidden rounded-md">
              {sheetPreview && brandMap ? (
                <LuminanceMappedPlate src={sheetPreview} fit="cover" stops={brandMap.stops} />
              ) : (
                <PlatePreview src={sheetPreview ?? null} />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="luminance-name">Name</Label>
              <Input
                id="luminance-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="luminance-file">Image</Label>
              <Input
                id="luminance-file"
                key={fileKey}
                type="file"
                accept="image/*"
                onChange={(event) => chooseFile(event.target.files?.[0])}
              />
              {selectedFile ? (
                <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="luminance-image">Existing media library file id</Label>
              <Input
                id="luminance-image"
                value={imageId}
                onChange={(event) => setImageId(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {uploadImage.isPending ? "Uploading..." : saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(undefined)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewing?.name || "Luminance plate"}</DialogTitle>
            <DialogDescription>
              {brandMap?.preset === "tonal-brand"
                ? "This theme’s primary and secondary are too close in lightness, so the preview uses the tonal preset: a darker primary, the primary, then a lighter primary."
                : "The brand preset recolours the plate from the selected theme. Shadows use a darker primary, midtones the primary, and highlights the secondary."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden rounded-md bg-slate-950">
            {viewing && plateSrc(viewing.imageUrl) && brandMap ? (
              <LuminanceMappedPlate src={plateSrc(viewing.imageUrl) ?? ""} fit="contain" stops={brandMap.stops} />
            ) : (
              <PlatePreview src={viewing ? plateSrc(viewing.imageUrl) : null} />
            )}
          </div>
          {brandMap ? <BrandMapLegend preset={brandMap.preset} stops={brandMap.stops} /> : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete luminance plate</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this plate will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePlate.isPending}
            >
              {deletePlate.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
