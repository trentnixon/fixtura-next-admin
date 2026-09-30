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
  const saving = createGradient.isPending || updateGradient.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} gradient{rows.length === 1 ? "" : "s"}
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add gradient
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                  No gradients yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const locked = row.id === PROTECTED_TEMPLATE_GRADIENT_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">#{row.id}</div>
                    </TableCell>
                    <TableCell>{row.type || "-"}</TableCell>
                    <TableCell>{row.direction || "-"}</TableCell>
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
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit gradient" : "Add gradient"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
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
