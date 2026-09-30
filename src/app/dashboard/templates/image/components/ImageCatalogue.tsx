"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

function pick<T extends string>(options: readonly T[], value: string, fallback: T): T {
  const match = options.find((option) => option === value);
  return match ?? fallback;
}

function EnumSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
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
              {option}
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
  const saving = createImage.isPending || updateImage.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} preset{rows.length === 1 ? "" : "s"}. The photo comes from the account media library, not this row.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add preset
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Motion</TableHead>
              <TableHead>Overlay</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No image presets yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const locked = row.id === PROTECTED_TEMPLATE_IMAGE_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">#{row.id}</div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.animationType || "-"}
                      <div className="text-xs text-muted-foreground">
                        {row.animationDirection || "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {row.overlayStyle || "-"}
                      <div className="text-xs text-muted-foreground">
                        {row.gradientType || "-"}
                        {row.overlayOpacity === null ? "" : ` · ${row.overlayOpacity}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {row.publishedAt ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={locked && Boolean(row.publishedAt)}
                        onClick={() => togglePublished(row)}
                      >
                        {row.publishedAt ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={locked}
                        onClick={() => setDeleteTarget(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit image preset" : "Add image preset"}</SheetTitle>
            <SheetDescription>
              Motion and overlay settings only. This row does not store the background photo.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="image-name">Name</Label>
              <Input id="image-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <EnumSelect
              label="Animation type"
              value={animationType}
              options={IMAGE_ANIMATION_TYPES}
              onChange={setAnimationType}
            />
            <EnumSelect
              label="Animation direction"
              value={animationDirection}
              options={IMAGE_ANIMATION_DIRECTIONS}
              onChange={setAnimationDirection}
            />
            <EnumSelect
              label="Overlay style"
              value={overlayStyle}
              options={IMAGE_OVERLAY_STYLES}
              onChange={setOverlayStyle}
            />
            <EnumSelect
              label="Gradient type"
              value={gradientType}
              options={IMAGE_GRADIENT_TYPES}
              onChange={setGradientType}
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
