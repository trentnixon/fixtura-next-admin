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
  const saving = createNoise.isPending || updateNoise.isPending;

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {rows.length} noise row{rows.length === 1 ? "" : "s"}
        </p>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add noise
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Noise type</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                  No noise rows yet.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const locked = row.id === PROTECTED_TEMPLATE_NOISE_ID;
                return (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">
                      {row.name || "Untitled"}
                      <div className="text-xs text-muted-foreground">#{row.id}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{row.noiseType}</TableCell>
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
            <SheetTitle>{editing ? "Edit noise" : "Add noise"}</SheetTitle>
            <SheetDescription>
              A shared template-style row. Saving it changes every account that still points at this id.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="noise-name">Name</Label>
              <Input
                id="noise-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Noise type</Label>
              <Select
                value={noiseType}
                onValueChange={(value) => setNoiseType(assertNoiseType(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOISE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
