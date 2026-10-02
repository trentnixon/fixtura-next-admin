"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { CatalogueToolbar, matchesPublishFilter, PublishFilter } from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { fixtureSplits } from "./fixtureSplits";

type AccessFilter = "all" | "public" | "private";

function Flag({ children, tone }: { children: string; tone?: "amber" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px]",
        tone === "amber" ? "border-amber-300 text-amber-800" : "border-slate-200 text-slate-600",
      )}
    >
      {children}
    </span>
  );
}

function audioLabel(row: TemplateCategory): string {
  if (row.bundleAudioName) return row.bundleAudioName;
  if (row.bundleAudioId) return `Bundle #${row.bundleAudioId}`;
  return "No audio bundle";
}

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
  const [status, setStatus] = useState<PublishFilter>("all");
  const [access, setAccess] = useState<AccessFilter>("all");

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
  const visible = rows.filter((row) => {
    if (!matchesPublishFilter(row.publishedAt, status)) return false;
    if (access === "public") return !row.isPrivate;
    if (access === "private") return row.isPrivate;
    return true;
  });
  const saving = createCategory.isPending || updateCategory.isPending;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add category"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeAllLabel="All access"
        typeValue={access}
        onTypeChange={(value) => {
          if (value === "public" || value === "private" || value === "all") setAccess(value);
        }}
        typeOptions={[
          { value: "public", label: "Public" },
          { value: "private", label: "Private" },
        ]}
      />

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No categories yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No categories match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const protectedRow = row.id === PROTECTED_TEMPLATE_CATEGORY_ID;
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            const splits = fixtureSplits(row.divideFixturesBy);
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={row.slug || "No slug"}
                typeClassName="font-mono"
                detail={audioLabel(row)}
                published={published}
                locked={protectedRow}
                publishDisabled={(protectedRow && published) || publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                badges={
                  <>
                    <Flag>{row.isPrivate ? "Private" : "Public"}</Flag>
                    {protectedRow ? <Flag tone="amber">Stays published</Flag> : null}
                    {splits === null ? <Flag>Custom split</Flag> : null}
                    {splits?.map((split) => (
                      <Flag key={split.label}>
                        {split.label} {split.count}
                      </Flag>
                    ))}
                  </>
                }
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit category" : "Add category"}</SheetTitle>
            <SheetDescription>
              A layout family. Saving it changes every account that still points at this id. The audio bundle is an existing bundle id.
              {locked ? " Row 1 stays public and published." : ""}
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
                rows={10}
                className="font-mono text-xs"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="category-private">Private</Label>
              <Switch
                id="category-private"
                checked={locked ? false : isPrivate}
                disabled={locked}
                onCheckedChange={setIsPrivate}
              />
            </div>
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
