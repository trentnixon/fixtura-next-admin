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
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import {
  useCreateTemplateTexture,
  useDeleteTemplateTexture,
  useSetTemplateTexturePublished,
  useTemplateTextures,
  useUpdateTemplateTexture,
} from "@/hooks/template-texture/useTemplateTexture";
import {
  TEXTURE_BLEND_MODE,
  TEXTURE_CATEGORIES,
  TextureCategory,
  TemplateTexture,
} from "@/types/template-texture";

function pickCategory(value: string): TextureCategory {
  return TEXTURE_CATEGORIES.find((option) => option === value) ?? "Paper";
}

function textureSrc(url: string | null): string | null {
  return resolveStrapiMediaUrl(url);
}

export function TextureCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateTextures();
  const createTexture = useCreateTemplateTexture();
  const updateTexture = useUpdateTemplateTexture();
  const setPublished = useSetTemplateTexturePublished();
  const deleteTexture = useDeleteTemplateTexture();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateTexture | undefined>();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TextureCategory>("Paper");
  const [opacity, setOpacity] = useState("");
  const [textureId, setTextureId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateTexture | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setCategory("Paper");
    setOpacity("");
    setTextureId("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateTexture) => {
    setEditing(row);
    setName(row.name);
    setCategory(pickCategory(row.category));
    setOpacity(row.opacity === null ? "" : String(row.opacity));
    setTextureId(row.textureId === null ? "" : String(row.textureId));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    const parsedId = Number(textureId);
    const trimmedOpacity = opacity.trim();
    let parsedOpacity: number | null = null;
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      toast.error("Texture must be an existing media library file id");
      return;
    }
    if (trimmedOpacity) {
      parsedOpacity = Number(trimmedOpacity);
      if (Number.isNaN(parsedOpacity)) {
        toast.error("Opacity must be a number");
        return;
      }
    }
    const input = {
      name: trimmedName,
      category,
      opacity: parsedOpacity,
      textureId: parsedId,
    };
    try {
      if (editing) {
        await updateTexture.mutateAsync({ id: editing.id, input });
        toast.success("Texture updated");
      } else {
        await createTexture.mutateAsync(input);
        toast.success("Texture created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateTexture) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Texture unpublished" : "Texture published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTexture.mutateAsync(deleteTarget.id);
      toast.success("Texture deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading textures..." />;
  if (isError) {
    return <ErrorState error={error} title="Failed to load textures" onRetry={() => refetch()} />;
  }

  const rows = data?.data ?? [];
  const saving = createTexture.isPending || updateTexture.isPending;
  const previewUrl =
    editing && String(editing.textureId ?? "") === textureId.trim()
      ? textureSrc(editing.textureUrl)
      : null;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} texture{rows.length === 1 ? "" : "s"}. The image is an existing media library file. Blend mode stays multiply.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add texture
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No textures yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const src = textureSrc(row.textureUrl);
                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      {src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={src} alt="" className="h-12 w-20 rounded object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {row.textureId ? `File #${row.textureId}` : "No image"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">
                        #{row.id}
                        {row.textureName ? ` · ${row.textureName}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      {row.category || "-"}
                      <div className="text-xs text-muted-foreground">
                        opacity {row.opacity ?? "-"} · {row.blendMode || TEXTURE_BLEND_MODE}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.publishedAt ? "Published" : "Draft"}</Badge>
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
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit texture" : "Add texture"}</SheetTitle>
            <SheetDescription>
              Link a file that is already in the media library. This form does not upload a new file. Blend mode is multiply.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="texture-name">Name</Label>
              <Input id="texture-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={(next) => setCategory(pickCategory(next))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEXTURE_CATEGORIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="texture-opacity">Opacity</Label>
              <Input
                id="texture-opacity"
                value={opacity}
                onChange={(event) => setOpacity(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="texture-file">Media library file id</Label>
              <Input
                id="texture-file"
                value={textureId}
                onChange={(event) => setTextureId(event.target.value)}
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

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete texture</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteTexture.isPending}>
              {deleteTexture.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
