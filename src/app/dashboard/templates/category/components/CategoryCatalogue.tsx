"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  jsonToEditorValue,
  parseOptionalJson,
} from "@/lib/services/template-category/templateCategoryRecord";
import {
  useCreateTemplateCategory,
  useDeleteTemplateCategory,
  useSetTemplateCategoryPublished,
  useTemplateCategories,
  useUpdateTemplateCategory,
} from "@/hooks/template-category/useTemplateCategory";
import {
  PROTECTED_TEMPLATE_CATEGORY_ID,
  TemplateCategory,
} from "@/types/template-category";

export function CategoryCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateCategories();
  const createCategory = useCreateTemplateCategory();
  const updateCategory = useUpdateTemplateCategory();
  const setPublished = useSetTemplateCategoryPublished();
  const deleteCategory = useDeleteTemplateCategory();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateCategory | undefined>();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [divideFixturesBy, setDivideFixturesBy] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [bundleAudioId, setBundleAudioId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateCategory | undefined>();

  const locked = editing?.id === PROTECTED_TEMPLATE_CATEGORY_ID;

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setSlug("");
    setDivideFixturesBy("");
    setIsPrivate(false);
    setBundleAudioId("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateCategory) => {
    setEditing(row);
    setName(row.name);
    setSlug(row.slug);
    setDivideFixturesBy(jsonToEditorValue(row.divideFixturesBy));
    setIsPrivate(row.isPrivate);
    setBundleAudioId(row.bundleAudioId === null ? "" : String(row.bundleAudioId));
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }
    let parsedJson: unknown | null;
    try {
      parsedJson = parseOptionalJson("Fixture split", divideFixturesBy);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid JSON");
      return;
    }
    const trimmedBundle = bundleAudioId.trim();
    let parsedBundle: number | null = null;
    if (trimmedBundle) {
      parsedBundle = Number(trimmedBundle);
      if (!Number.isInteger(parsedBundle) || parsedBundle <= 0) {
        toast.error("Audio bundle must be an existing bundle id");
        return;
      }
    }
    const input = {
      name: trimmedName,
      slug: slug.trim(),
      divideFixturesBy: parsedJson,
      isPrivate: locked ? false : isPrivate,
      bundleAudioId: parsedBundle,
    };
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, input });
        toast.success("Category updated");
      } else {
        await createCategory.mutateAsync(input);
        toast.success("Category created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateCategory) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Category unpublished" : "Category published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteCategory.mutateAsync(deleteTarget.id);
      toast.success("Category deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading categories..." />;
  if (isError) {
    return (
      <ErrorState error={error} title="Failed to load categories" onRetry={() => refetch()} />
    );
  }

  const rows = data?.data ?? [];
  const saving = createCategory.isPending || updateCategory.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} categor{rows.length === 1 ? "y" : "ies"}. A private category cannot be selected by the member save. Row 1 stays public and published.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No categories yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const protectedRow = row.id === PROTECTED_TEMPLATE_CATEGORY_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">
                        #{row.id}
                        {row.bundleAudioName
                          ? ` · ${row.bundleAudioName}`
                          : row.bundleAudioId
                            ? ` · bundle #${row.bundleAudioId}`
                            : ""}
                      </div>
                    </TableCell>
                    <TableCell>{row.slug || "-"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.isPrivate ? "Private" : "Public"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{row.publishedAt ? "Published" : "Draft"}</Badge>
                    </TableCell>
                    <TableCell className="space-x-2 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={protectedRow && Boolean(row.publishedAt)}
                        onClick={() => togglePublished(row)}
                      >
                        {row.publishedAt ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={protectedRow}
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
            <SheetTitle>{editing ? "Edit category" : "Add category"}</SheetTitle>
            <SheetDescription>
              A layout family. Saving it changes every account that still points at this id. The audio bundle is an existing bundle id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input id="category-slug" value={slug} onChange={(event) => setSlug(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-split">Fixture split</Label>
              <Textarea
                id="category-split"
                value={divideFixturesBy}
                onChange={(event) => setDivideFixturesBy(event.target.value)}
                className="min-h-32 font-mono text-xs"
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={locked ? false : isPrivate}
                disabled={locked}
                onChange={(event) => setIsPrivate(event.target.checked)}
              />
              Private
            </label>
            <div className="space-y-2">
              <Label htmlFor="category-bundle">Audio bundle id</Label>
              <Input
                id="category-bundle"
                value={bundleAudioId}
                onChange={(event) => setBundleAudioId(event.target.value)}
              />
              {editing?.bundleAudioName && bundleAudioId === String(editing.bundleAudioId ?? "") ? (
                <p className="text-xs text-muted-foreground">{editing.bundleAudioName}</p>
              ) : null}
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

      <Dialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteCategory.isPending}>
              {deleteCategory.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
