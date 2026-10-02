"use client";

import { useState } from "react";
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
import {
  useCreateTemplateImage,
  useDeleteTemplateImage,
  useSetTemplateImagePublished,
  useTemplateImages,
  useUpdateTemplateImage,
} from "@/hooks/template-image/useTemplateImage";
import {
  IMAGE_ANIMATION_DIRECTIONS,
  IMAGE_ANIMATION_TYPES,
  IMAGE_GRADIENT_TYPES,
  IMAGE_OVERLAY_STYLES,
  ImageAnimationDirection,
  ImageAnimationType,
  ImageGradientType,
  ImageOverlayStyle,
  PROTECTED_TEMPLATE_IMAGE_ID,
  TemplateImage,
} from "@/types/template-image";
import {
  CatalogueToolbar,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { SwatchPicker } from "../../components/SwatchPicker";
import { humanizeToken } from "../../components/humanizeToken";
import { ImageOverlaySwatch } from "../../components/swatches/ImageOverlaySwatch";
import { imageMotionLabel, imageOverlayLabel } from "../../components/swatches/imagePresetLabels";

function pick<T extends string>(options: readonly T[], value: string, fallback: T): T {
  const match = options.find((option) => option === value);
  return match ?? fallback;
}

function EnumSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  optionLabel,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  optionLabel: (value: T) => string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={(next) => onChange(pick(options, next, value))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {optionLabel(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function ImageCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateImages();
  const createImage = useCreateTemplateImage();
  const updateImage = useUpdateTemplateImage();
  const setPublished = useSetTemplateImagePublished();
  const deleteImage = useDeleteTemplateImage();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateImage | undefined>();
  const [name, setName] = useState("");
  const [animationType, setAnimationType] = useState<ImageAnimationType>("none");
  const [animationDirection, setAnimationDirection] = useState<ImageAnimationDirection>("in");
  const [overlayStyle, setOverlayStyle] = useState<ImageOverlayStyle>("none");
  const [gradientType, setGradientType] = useState<ImageGradientType>("linear");
  const [overlayOpacity, setOverlayOpacity] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateImage | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [overlayFilter, setOverlayFilter] = useState<string>("all");

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setAnimationType("none");
    setAnimationDirection("in");
    setOverlayStyle("none");
    setGradientType("linear");
    setOverlayOpacity("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateImage) => {
    setEditing(row);
    setName(row.name);
    setAnimationType(pick(IMAGE_ANIMATION_TYPES, row.animationType, "none"));
    setAnimationDirection(pick(IMAGE_ANIMATION_DIRECTIONS, row.animationDirection, "in"));
    setOverlayStyle(pick(IMAGE_OVERLAY_STYLES, row.overlayStyle, "none"));
    setGradientType(pick(IMAGE_GRADIENT_TYPES, row.gradientType, "linear"));
    setOverlayOpacity(row.overlayOpacity === null ? "" : String(row.overlayOpacity));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    const opacity = overlayOpacity.trim();
    const parsedOpacity = opacity === "" ? null : Number(opacity);
    if (parsedOpacity !== null && Number.isNaN(parsedOpacity)) {
      toast.error("Overlay opacity must be a number");
      return;
    }
    const input = {
      name: trimmedName,
      animationType,
      animationDirection,
      overlayStyle,
      gradientType,
      overlayOpacity: parsedOpacity,
    };
    try {
      if (editing) {
        await updateImage.mutateAsync({ id: editing.id, input });
        toast.success("Image preset updated");
      } else {
        await createImage.mutateAsync(input);
        toast.success("Image preset created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateImage) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Image preset unpublished" : "Image preset published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteImage.mutateAsync(deleteTarget.id);
      toast.success("Image preset deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading image presets..." />;
  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load image presets"
        onRetry={() => refetch()}
      />
    );
  }

  const rows = data?.data ?? [];
  const visible = rows.filter(
    (row) =>
      matchesPublishFilter(row.publishedAt, status) &&
      (overlayFilter === "all" || row.overlayStyle === overlayFilter),
  );
  const saving = createImage.isPending || updateImage.isPending;
  const typedOpacity = overlayOpacity.trim() === "" ? null : Number(overlayOpacity);
  const previewOpacity = typedOpacity !== null && Number.isNaN(typedOpacity) ? null : typedOpacity;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add preset"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeValue={overlayFilter}
        onTypeChange={setOverlayFilter}
        typeAllLabel="All overlays"
        typeOptions={IMAGE_OVERLAY_STYLES.map((style) => ({
          value: style,
          label: imageOverlayLabel(style),
        }))}
      />

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No image presets yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No image presets match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const locked = row.id === PROTECTED_TEMPLATE_IMAGE_ID;
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            const direction = humanizeToken(row.animationDirection);
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={imageOverlayLabel(row.overlayStyle)}
                detail={`${imageMotionLabel(row.animationType)}${direction ? ` ${direction.toLowerCase()}` : ""} · ${humanizeToken(row.gradientType) || "No gradient"} · opacity ${row.overlayOpacity ?? "—"}`}
                published={published}
                locked={locked}
                publishDisabled={(locked && published) || publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={
                  <ImageOverlaySwatch
                    overlayStyle={row.overlayStyle}
                    gradientType={row.gradientType}
                    opacity={row.overlayOpacity}
                  />
                }
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit image preset" : "Add image preset"}</SheetTitle>
            <SheetDescription>
              Motion and overlay settings only. This row does not store the background photo.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-28 overflow-hidden rounded-md">
              <ImageOverlaySwatch
                overlayStyle={overlayStyle}
                gradientType={gradientType}
                opacity={previewOpacity}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-name">Name</Label>
              <Input id="image-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <EnumSelect
              label="Animation type"
              value={animationType}
              options={IMAGE_ANIMATION_TYPES}
              onChange={setAnimationType}
              optionLabel={imageMotionLabel}
            />
            <EnumSelect
              label="Animation direction"
              value={animationDirection}
              options={IMAGE_ANIMATION_DIRECTIONS}
              onChange={setAnimationDirection}
              optionLabel={humanizeToken}
            />
            <SwatchPicker
              label="Overlay style"
              value={overlayStyle}
              options={IMAGE_OVERLAY_STYLES}
              onChange={setOverlayStyle}
              swatch={(style) => (
                <ImageOverlaySwatch overlayStyle={style} gradientType={gradientType} opacity={previewOpacity} />
              )}
              optionLabel={imageOverlayLabel}
            />
            <EnumSelect
              label="Gradient type"
              value={gradientType}
              options={IMAGE_GRADIENT_TYPES}
              onChange={setGradientType}
              optionLabel={humanizeToken}
            />
            <div className="space-y-2">
              <Label htmlFor="image-opacity">Overlay opacity</Label>
              <Input
                id="image-opacity"
                value={overlayOpacity}
                onChange={(event) => setOverlayOpacity(event.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSheetOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete image preset</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteImage.isPending}>
              {deleteImage.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
