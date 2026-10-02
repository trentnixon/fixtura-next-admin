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
import { cn } from "@/lib/utils";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import { useBrandThemes } from "@/hooks/brand-theme/useBrandTheme";
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
import { isHexColor } from "../../luminance/components/luminanceMap";
import {
  CatalogueToolbar,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { TextureInUse } from "./TextureInUse";
import { textureOverlayOpacity } from "./texturePreview";

function pickCategory(value: string): TextureCategory {
  return TEXTURE_CATEGORIES.find((option) => option === value) ?? "Paper";
}

function textureSrc(url: string | null): string | null {
  return resolveStrapiMediaUrl(url);
}

function hasPublicUrl(url: string | null): boolean {
  return Boolean(url && /^https?:\/\//i.test(url.trim()));
}

function EmptyPlate() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-muted-foreground">
      No image
    </div>
  );
}

function UrlFlag() {
  return (
    <span className={cn("rounded-full border border-amber-300 px-2 py-0.5 text-[11px] text-amber-800")}>
      Needs a public URL
    </span>
  );
}

export function TextureCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateTextures();
  const createTexture = useCreateTemplateTexture();
  const updateTexture = useUpdateTemplateTexture();
  const setPublished = useSetTemplateTexturePublished();
  const deleteTexture = useDeleteTemplateTexture();
  const themes = useBrandThemes();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateTexture | undefined>();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<TextureCategory>("Paper");
  const [opacity, setOpacity] = useState("");
  const [textureId, setTextureId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateTexture | undefined>();
  const [viewing, setViewing] = useState<TemplateTexture | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [themeId, setThemeId] = useState<string>("");

  const themeRows = (themes.data?.data ?? []).filter(
    (theme) => isHexColor(theme.theme.primary) && isHexColor(theme.theme.secondary),
  );
  const selectedTheme = themeRows.find((theme) => String(theme.id) === themeId) ?? themeRows[0];
  const primary = selectedTheme?.theme.primary;

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
  const visible = rows.filter(
    (row) =>
      matchesPublishFilter(row.publishedAt, status) &&
      (categoryFilter === "all" || row.category === categoryFilter),
  );
  const saving = createTexture.isPending || updateTexture.isPending;
  const previewUrl =
    editing && String(editing.textureId ?? "") === textureId.trim()
      ? textureSrc(editing.textureUrl)
      : null;
  const typedOpacity = opacity.trim() === "" ? null : Number(opacity);
  const sheetOpacity = textureOverlayOpacity(typedOpacity !== null && Number.isNaN(typedOpacity) ? null : typedOpacity);
  const viewSrc = viewing ? textureSrc(viewing.textureUrl) : null;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add texture"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeAllLabel="All categories"
        typeValue={categoryFilter}
        onTypeChange={setCategoryFilter}
        typeOptions={TEXTURE_CATEGORIES.map((option) => ({ value: option, label: option }))}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Label htmlFor="texture-theme">Preview theme</Label>
          <Select
            value={selectedTheme ? String(selectedTheme.id) : undefined}
            onValueChange={setThemeId}
            disabled={themeRows.length === 0}
          >
            <SelectTrigger id="texture-theme" className="w-56">
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
        <StyleCatalogueEmpty message="No textures yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No textures match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            const src = textureSrc(row.textureUrl);
            const needsPublicUrl = row.textureId !== null && !hasPublicUrl(row.textureUrl);
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={row.category || "No category"}
                detail={`${row.textureName || (row.textureId ? `File #${row.textureId}` : "No image")} · opacity ${row.opacity ?? "0.8"} · ${row.blendMode || TEXTURE_BLEND_MODE}`}
                published={published}
                locked={false}
                publishDisabled={publishing}
                onEdit={() => openEdit(row)}
                onPreview={src ? () => setViewing(row) : undefined}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={
                  src && primary ? (
                    <TextureInUse
                      src={src}
                      fit="cover"
                      color={primary}
                      opacity={textureOverlayOpacity(row.opacity)}
                    />
                  ) : src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <EmptyPlate />
                  )
                }
                badges={needsPublicUrl ? <UrlFlag /> : undefined}
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit texture" : "Add texture"}</SheetTitle>
            <SheetDescription>
              Link a file that is already in the media library. This form does not upload a new file. Blend mode is multiply.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-28 overflow-hidden rounded-md">
              {previewUrl && primary ? (
                <TextureInUse src={previewUrl} fit="cover" color={primary} opacity={sheetOpacity} />
              ) : previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <EmptyPlate />
              )}
            </div>
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

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(undefined)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewing?.name || "Texture"}</DialogTitle>
            <DialogDescription>
              The texture image stays visible. The theme primary is multiplied over it at this row’s opacity.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center overflow-hidden rounded-md bg-slate-950">
            {viewSrc && primary && viewing ? (
              <TextureInUse
                src={viewSrc}
                fit="contain"
                color={primary}
                opacity={textureOverlayOpacity(viewing.opacity)}
              />
            ) : viewSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={viewSrc} alt="" className="max-h-[70vh] max-w-full object-contain" />
            ) : (
              <EmptyPlate />
            )}
          </div>
          {primary ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-3 w-3 rounded-sm border" style={{ backgroundColor: primary }} />
              Primary · multiply · opacity {viewing ? (viewing.opacity ?? "0.8") : "0.8"}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

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
