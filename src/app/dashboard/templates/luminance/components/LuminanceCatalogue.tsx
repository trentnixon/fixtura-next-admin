"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import {
  useCreateTemplateLuminance,
  useDeleteTemplateLuminance,
  useSetTemplateLuminancePublished,
  useTemplateLuminances,
  useUpdateTemplateLuminance,
} from "@/hooks/template-luminance/useTemplateLuminance";
import { TemplateLuminance } from "@/types/template-luminance";

function plateSrc(url: string | null): string | null {
  return resolveStrapiMediaUrl(url);
}

export function LuminanceCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateLuminances();
  const createPlate = useCreateTemplateLuminance();
  const updatePlate = useUpdateTemplateLuminance();
  const setPublished = useSetTemplateLuminancePublished();
  const deletePlate = useDeleteTemplateLuminance();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateLuminance | undefined>();
  const [name, setName] = useState("");
  const [imageId, setImageId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateLuminance | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setImageId("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateLuminance) => {
    setEditing(row);
    setName(row.name);
    setImageId(row.imageId === null ? "" : String(row.imageId));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    const parsedId = Number(imageId);
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      toast.error("Image must be an existing media library file id");
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
  const saving = createPlate.isPending || updatePlate.isPending;
  const previewUrl =
    editing && String(editing.imageId ?? "") === imageId.trim()
      ? plateSrc(editing.imageUrl)
      : null;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} plate{rows.length === 1 ? "" : "s"}. The image is an existing media library file.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add plate
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Plate</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No luminance plates yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const src = plateSrc(row.imageUrl);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="h-12 w-20 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {row.imageId ? `File #${row.imageId}` : "No image"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">
                        #{row.id}
                        {row.imageName ? ` · ${row.imageName}` : ""}
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
                      <Button variant="outline" size="sm" onClick={() => togglePublished(row)}>
                        {row.publishedAt ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(row)}>
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
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit plate" : "Add plate"}</SheetTitle>
            <SheetDescription>
              Link a grayscale file that is already in the media library. This form does not upload a new file.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="luminance-name">Name</Label>
              <Input
                id="luminance-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="luminance-image">Media library file id</Label>
              <Input
                id="luminance-image"
                value={imageId}
                onChange={(event) => setImageId(event.target.value)}
              />
            </div>
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewUrl} alt="" className="h-28 w-full rounded object-cover" />
            ) : null}
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
