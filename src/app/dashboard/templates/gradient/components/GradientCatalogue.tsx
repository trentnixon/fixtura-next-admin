"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  useCreateTemplateGradient,
  useDeleteTemplateGradient,
  useSetTemplateGradientPublished,
  useTemplateGradients,
  useUpdateTemplateGradient,
} from "@/hooks/template-gradient/useTemplateGradient";
import {
  PROTECTED_TEMPLATE_GRADIENT_ID,
  TemplateGradient,
} from "@/types/template-gradient";
import {
  CatalogueToolbar,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { humanizeToken } from "../../components/humanizeToken";
import { GradientSwatch } from "../../components/swatches/GradientSwatch";

export function GradientCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateGradients();
  const createGradient = useCreateTemplateGradient();
  const updateGradient = useUpdateTemplateGradient();
  const setPublished = useSetTemplateGradientPublished();
  const deleteGradient = useDeleteTemplateGradient();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateGradient | undefined>();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [direction, setDirection] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateGradient | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setType("");
    setDirection("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateGradient) => {
    setEditing(row);
    setName(row.name);
    setType(row.type);
    setDirection(row.direction);
    setSheetOpen(true);
  };

  const save = async () => {
    const input = {
      name: name.trim(),
      type: type.trim(),
      direction: direction.trim(),
    };
    if (!input.name) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateGradient.mutateAsync({ id: editing.id, input });
        toast.success("Gradient updated");
      } else {
        await createGradient.mutateAsync(input);
        toast.success("Gradient created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateGradient) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Gradient unpublished" : "Gradient published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteGradient.mutateAsync(deleteTarget.id);
      toast.success("Gradient deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading gradients..." />;
  if (isError) {
    return (
      <ErrorState error={error} title="Failed to load gradients" onRetry={() => refetch()} />
    );
  }

  const rows = data?.data ?? [];
  const typeOptions = Array.from(new Set(rows.map((row) => row.type).filter((type) => type.length > 0)))
    .sort((left, right) => left.localeCompare(right))
    .map((type) => ({ value: type, label: humanizeToken(type) }));
  const visible = rows.filter(
    (row) => matchesPublishFilter(row.publishedAt, status) && (typeFilter === "all" || row.type === typeFilter)
  );
  const saving = createGradient.isPending || updateGradient.isPending;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add gradient"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeValue={typeFilter}
        onTypeChange={setTypeFilter}
        typeOptions={typeOptions.length > 0 ? typeOptions : undefined}
      />

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No gradients yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No gradients match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const locked = row.id === PROTECTED_TEMPLATE_GRADIENT_ID;
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={humanizeToken(row.type) || "No type"}
                detail={humanizeToken(row.direction) || "No direction"}
                published={published}
                locked={locked}
                publishDisabled={(locked && published) || publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={<GradientSwatch type={row.type} direction={row.direction} />}
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit gradient" : "Add gradient"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-28 overflow-hidden rounded-md">
              <GradientSwatch type={type} direction={direction} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradient-name">Name</Label>
              <Input id="gradient-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradient-type">Type</Label>
              <Input id="gradient-type" value={type} onChange={(event) => setType(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradient-direction">Direction</Label>
              <Input
                id="gradient-direction"
                value={direction}
                onChange={(event) => setDirection(event.target.value)}
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
            <DialogTitle>Delete gradient</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteGradient.isPending}
            >
              {deleteGradient.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
