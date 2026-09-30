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
import {
  useCreateTemplatePalette,
  useDeleteTemplatePalette,
  useSetTemplatePalettePublished,
  useTemplatePalettes,
  useUpdateTemplatePalette,
} from "@/hooks/template-palette/useTemplatePalette";
import {
  PROTECTED_TEMPLATE_PALETTE_ID,
  TemplatePalette,
} from "@/types/template-palette";

export function PaletteCatalogue() {
  const { data, isLoading, isError, error, refetch } = useTemplatePalettes();
  const createPalette = useCreateTemplatePalette();
  const updatePalette = useUpdateTemplatePalette();
  const setPublished = useSetTemplatePalettePublished();
  const deletePalette = useDeleteTemplatePalette();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<TemplatePalette | undefined>();
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplatePalette | undefined>();

  const openCreate = () => {
    setEditing(undefined);
    setName("");
    setValue("");
    setSheetOpen(true);
  };

  const openEdit = (row: TemplatePalette) => {
    setEditing(row);
    setName(row.name);
    setValue(row.value);
    setSheetOpen(true);
  };

  const save = async () => {
    const trimmedName = name.trim();
    const trimmedValue = value.trim();
    if (!trimmedName || !trimmedValue) {
      toast.error("Name and value are required");
      return;
    }
    const input = { name: trimmedName, value: trimmedValue };
    try {
      if (editing) {
        await updatePalette.mutateAsync({ id: editing.id, input });
        toast.success("Palette updated");
      } else {
        await createPalette.mutateAsync(input);
        toast.success("Palette created as a draft");
      }
      setSheetOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  const togglePublished = async (row: TemplatePalette) => {
    try {
      await setPublished.mutateAsync({ id: row.id, published: !row.publishedAt });
      toast.success(row.publishedAt ? "Palette unpublished" : "Palette published");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Publish failed");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePalette.mutateAsync(deleteTarget.id);
      toast.success("Palette deleted");
      setDeleteTarget(undefined);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (isLoading) return <LoadingState message="Loading palettes..." />;
  if (isError) {
    return <ErrorState error={error} title="Failed to load palettes" onRetry={() => refetch()} />;
  }

  const rows = data?.data ?? [];
  const saving = createPalette.isPending || updatePalette.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} palette{rows.length === 1 ? "" : "s"}. Value is a token the renderer receives. Brand colours stay on Theme.
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add palette
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No palettes yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const locked = row.id === PROTECTED_TEMPLATE_PALETTE_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">#{row.id}</div>
                    </TableCell>
                    <TableCell>{row.value || "-"}</TableCell>
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
                        disabled={locked && Boolean(row.publishedAt)}
                        onClick={() => togglePublished(row)}
                      >
                        {row.publishedAt ? "Unpublish" : "Publish"}
                      </Button>
                      <Button variant="ghost" size="sm" disabled={locked} onClick={() => setDeleteTarget(row)}>
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
            <SheetTitle>{editing ? "Edit palette" : "Add palette"}</SheetTitle>
            <SheetDescription>
              A shared token. Saving it changes every account that still points at this id. Do not put hex colours here.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="palette-name">Name</Label>
              <Input id="palette-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="palette-value">Value</Label>
              <Input id="palette-value" value={value} onChange={(event) => setValue(event.target.value)} />
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
            <DialogTitle>Delete palette</DialogTitle>
            <DialogDescription>
              Delete {deleteTarget?.name}? Accounts that still point at this row will lose it.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deletePalette.isPending}>
              {deletePalette.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
