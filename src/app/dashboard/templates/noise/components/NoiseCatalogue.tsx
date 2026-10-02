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
  useCreateTemplateNoise,
  useDeleteTemplateNoise,
  useSetTemplateNoisePublished,
  useTemplateNoises,
  useUpdateTemplateNoise,
} from "@/hooks/template-noise/useTemplateNoise";
import {
  NOISE_TYPES,
  NoiseType,
  PROTECTED_TEMPLATE_NOISE_ID,
  TemplateNoise,
} from "@/types/template-noise";
import { assertNoiseType } from "@/lib/services/template-noise/templateNoiseRecord";
import {
  CatalogueToolbar,
  matchesPublishFilter,
  PublishFilter,
} from "../../components/CatalogueToolbar";
import { StyleCatalogueCard, StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { SwatchPicker } from "../../components/SwatchPicker";
import { humanizeToken } from "../../components/humanizeToken";
import { NoiseSwatch } from "../../components/swatches/NoiseSwatch";

export function NoiseCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplateNoises();
  const createNoise = useCreateTemplateNoise();
  const updateNoise = useUpdateTemplateNoise();
  const setPublished = useSetTemplateNoisePublished();
  const deleteNoise = useDeleteTemplateNoise();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplateNoise | undefined>();
  const [name, setName] = useState("");
  const [noiseType, setNoiseType] = useState<NoiseType>("default");
  const [deleteTarget, setDeleteTarget] = useState<TemplateNoise | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setNoiseType("default");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplateNoise) => {
    try {
      setNoiseType(assertNoiseType(row.noiseType));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown noise type");
      return;
    }
    setEditing(row);
    setName(row.name);
    setSheetOpen(true);
  };

  const save = async () => {
    const input = { name: name.trim(), noiseType };
    if (!input.name) {
      toast.error("Name is required");
      return;
    }
    try {
      if (editing) {
        await updateNoise.mutateAsync({ id: editing.id, input });
        toast.success("Noise updated");
      } else {
        await createNoise.mutateAsync(input);
        toast.success("Noise created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplateNoise) => {
    try {
      await setPublished.mutateAsync({
        id: row.id,
        published: !row.publishedAt,
      });
      toast.success(row.publishedAt ? "Noise unpublished" : "Noise published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteNoise.mutateAsync(deleteTarget.id);
      toast.success("Noise deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading noise rows..." />;
  if (isError) {
    return (
      <ErrorState
        error={error}
        title="Failed to load noise"
        onRetry={() => refetch()}
      />
    );
  }

  const rows = data?.data ?? [];
  const visible = rows.filter(
    (row) => matchesPublishFilter(row.publishedAt, status) && (typeFilter === "all" || row.noiseType === typeFilter)
  );
  const saving = createNoise.isPending || updateNoise.isPending;

  return (
    <>
      <CatalogueToolbar
        addLabel="Add noise"
        onAdd={openCreate}
        status={status}
        onStatusChange={setStatus}
        typeValue={typeFilter}
        onTypeChange={setTypeFilter}
        typeOptions={NOISE_TYPES.map((type) => ({ value: type, label: humanizeToken(type) }))}
      />

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No noise rows yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No noise rows match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => {
            const locked = row.id === PROTECTED_TEMPLATE_NOISE_ID;
            const published = Boolean(row.publishedAt);
            const publishing = setPublished.isPending && setPublished.variables?.id === row.id;
            return (
              <StyleCatalogueCard
                key={row.id}
                name={row.name}
                id={row.id}
                typeLabel={humanizeToken(row.noiseType) || row.noiseType}
                published={published}
                locked={locked}
                publishDisabled={(locked && published) || publishing}
                onEdit={() => openEdit(row)}
                onTogglePublished={() => togglePublished(row)}
                onDelete={() => setDeleteTarget(row)}
                preview={<NoiseSwatch type={row.noiseType} />}
              />
            );
          })}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit noise" : "Add noise"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="h-28 overflow-hidden rounded-md">
              <NoiseSwatch type={noiseType} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noise-name">Name</Label>
              <Input
                id="noise-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <SwatchPicker
              label="Noise type"
              value={noiseType}
              options={NOISE_TYPES}
              onChange={setNoiseType}
              swatch={(type) => <NoiseSwatch type={type} />}
              optionLabel={humanizeToken}
            />
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
            <DialogTitle>Delete noise</DialogTitle>
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
              disabled={deleteNoise.isPending}
            >
              {deleteNoise.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
